import React, { useState } from 'react';
import { useTest } from '../context/TestContext';
import { 
  ArrowLeft, Settings, BookOpen, History, Save, Trash2, Plus, 
  ChevronDown, ChevronUp, AlertOctagon, User, FileCode, CheckCircle, Clock, ShieldAlert 
} from 'lucide-react';

export const AdminPanel = ({ onBack }) => {
  const {
    config,
    setConfig,
    problems,
    addCustomProblem,
    deleteProblem,
    attempts,
    clearAttempts
  } = useTest();

  const [activeTab, setActiveTab] = useState('config'); // 'config', 'problems', 'history'
  
  // Config form local states
  const [timeLimit, setTimeLimit] = useState(config.timeLimitMinutes);
  const [maxWarns, setMaxWarns] = useState(config.maxWarnings);
  const [fullscreenRequired, setFullscreenRequired] = useState(config.forceFullscreen);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Problem creation form local states
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newProbDifficulty, setNewProbDifficulty] = useState('Easy');
  const [newProbPoints, setNewProbPoints] = useState(100);
  const [newProbDesc, setNewProbDesc] = useState('');
  const [newProbJS, setNewProbJS] = useState('');
  const [newProbPy, setNewProbPy] = useState('');
  const [showProbForm, setShowProbForm] = useState(false);

  // Expand attempt history records
  const [expandedAttempt, setExpandedAttempt] = useState(null);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setConfig({
      timeLimitMinutes: Number(timeLimit),
      maxWarnings: Number(maxWarns),
      forceFullscreen: fullscreenRequired
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCreateProblem = (e) => {
    e.preventDefault();
    if (!newProbTitle.trim() || !newProbDesc.trim()) {
      alert('Please fill out Title and Description.');
      return;
    }

    const newProblem = {
      title: newProbTitle,
      difficulty: newProbDifficulty,
      points: Number(newProbPoints),
      description: newProbDesc,
      starterCode: {
        javascript: newProbJS || `function solve() {\n  // Write code\n}`,
        python: newProbPy || `def solve():\n    # Write code\n    pass`,
        cpp: `class Solution {\npublic:\n    // Write code\n};`,
        java: `class Solution {\n    // Write code\n}`
      },
      testCases: [
        { input: 'Default Case 1', expected: 'true' }
      ]
    };

    addCustomProblem(newProblem);
    
    // Reset form
    setNewProbTitle('');
    setNewProbDesc('');
    setNewProbJS('');
    setNewProbPy('');
    setShowProbForm(false);
  };

  const toggleExpandAttempt = (id) => {
    setExpandedAttempt(expandedAttempt === id ? null : id);
  };

  const getEndReasonLabel = (reason) => {
    switch (reason) {
      case 'warnings_exceeded':
        return {
          text: 'Lockout (Warnings Exceeded)',
          color: 'bg-rose-950 text-rose-300 border-rose-900/40',
          icon: <ShieldAlert className="h-3 w-3 mr-1" />
        };
      case 'timeout':
        return {
          text: 'Timeout',
          color: 'bg-yellow-950 text-yellow-300 border-yellow-800/40',
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case 'submit':
      default:
        return {
          text: 'Submitted Successfully',
          color: 'bg-emerald-950 text-emerald-300 border-emerald-800/40',
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6">
        
        {/* Header navigation bar */}
        <header className="flex items-center justify-between border-b border-dark-800 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-dark-900 border border-dark-800 text-dark-350 hover:bg-dark-800 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white m-0">Admin Controls</h2>
              <p className="text-xs text-dark-400">Configure parameters and examine violation databases.</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/10 transition-all cursor-pointer"
          >
            Practice Workspace
          </button>
        </header>

        {/* Dashboard Tabs Selectors */}
        <div className="flex border-b border-dark-850">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center space-x-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-dark-400 hover:text-dark-200'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Test Parameters</span>
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center space-x-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'problems'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-dark-400 hover:text-dark-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Problem Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-dark-400 hover:text-dark-200'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Attempt History ({attempts.length})</span>
          </button>
        </div>

        {/* Tab contents viewport */}
        <div className="flex-1">
          
          {/* TAB 1: Config Details */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="glass-panel p-6 rounded-2xl space-y-6 animate-slide-in">
              <h3 className="text-lg font-bold text-white m-0 pb-3 border-b border-dark-850">Configure Proctoring Rules</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                    Time Limit (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-950 border border-dark-800 focus:border-primary-500 text-white transition-colors focus:outline-none"
                  />
                  <p className="text-3xs text-dark-500 mt-1.5">Timer duration for coding challenges.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                    Max Warnings Allowed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={maxWarns}
                    onChange={(e) => setMaxWarns(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-950 border border-dark-800 focus:border-primary-500 text-white transition-colors focus:outline-none"
                  />
                  <p className="text-3xs text-dark-500 mt-1.5">Warnings allocated before automated test submission.</p>
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fullscreenRequired}
                      onChange={(e) => setFullscreenRequired(e.target.checked)}
                      className="h-4 w-4 rounded border-dark-800 text-primary-600 focus:ring-primary-500 bg-dark-950 cursor-pointer accent-primary-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-white block select-none">Require Fullscreen Mode</span>
                      <span className="text-xs text-dark-400 block select-none">
                        Forces candidates into fullscreen before beginning. Exits trigger alerts.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-dark-850 flex items-center justify-between">
                {saveSuccess ? (
                  <span className="text-xs font-medium text-emerald-450">Settings updated successfully!</span>
                ) : <span />}

                <button
                  type="submit"
                  className="flex items-center space-x-2 py-2.5 px-6 bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 cursor-pointer transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Problems Management */}
          {activeTab === 'problems' && (
            <div className="space-y-6 animate-slide-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white m-0">Uploaded Problems ({problems.length})</h3>
                <button
                  onClick={() => setShowProbForm(!showProbForm)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-dark-900 border border-dark-800 hover:bg-dark-800 text-white transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{showProbForm ? 'Cancel Creation' : 'Add Custom Problem'}</span>
                </button>
              </div>

              {/* Problem upload form overlay */}
              {showProbForm && (
                <form onSubmit={handleCreateProblem} className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-white m-0 pb-2 border-b border-dark-850">Create Challenge</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-3xs font-semibold uppercase text-dark-350 mb-1">Problem Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Reverse List"
                        value={newProbTitle}
                        onChange={(e) => setNewProbTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded bg-dark-950 border border-dark-800 focus:border-primary-500 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-3xs font-semibold uppercase text-dark-350 mb-1">Difficulty</label>
                      <select
                        value={newProbDifficulty}
                        onChange={(e) => setNewProbDifficulty(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded bg-dark-950 border border-dark-800 focus:border-primary-500 text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-3xs font-semibold uppercase text-dark-350 mb-1">Points</label>
                      <input
                        type="number"
                        value={newProbPoints}
                        onChange={(e) => setNewProbPoints(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded bg-dark-950 border border-dark-800 focus:border-primary-500 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-3xs font-semibold uppercase text-dark-350 mb-1">Description (Markdown Supported)</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Write problem statement descriptions, expected responses, and restrictions..."
                      value={newProbDesc}
                      onChange={(e) => setNewProbDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded bg-dark-950 border border-dark-800 focus:border-primary-500 text-white font-sans focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-3xs font-semibold uppercase text-dark-350 mb-1">JavaScript Starter Template</label>
                      <textarea
                        rows="3"
                        placeholder="function solve() { ... }"
                        value={newProbJS}
                        onChange={(e) => setNewProbJS(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-dark-950 border border-dark-800 focus:border-primary-500 text-white font-mono text-2xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-3xs font-semibold uppercase text-dark-350 mb-1">Python Starter Template</label>
                      <textarea
                        rows="3"
                        placeholder="def solve(): ..."
                        value={newProbPy}
                        onChange={(e) => setNewProbPy(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-dark-950 border border-dark-800 focus:border-primary-500 text-white font-mono text-2xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    Insert Problem Template
                  </button>
                </form>
              )}

              {/* Table of problems */}
              <div className="space-y-2">
                {problems.map((prob) => (
                  <div key={prob.id} className="p-4 rounded-xl bg-dark-900 border border-dark-850 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white m-0 text-sm">{prob.title}</h4>
                      <p className="text-3xs text-dark-400 mt-0.5">
                        Difficulty: <span className="text-primary-400 font-semibold">{prob.difficulty}</span> | Points: {prob.points}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (problems.length <= 1) {
                          alert("You must keep at least one problem in database!");
                          return;
                        }
                        if (window.confirm(`Are you sure you want to delete problem "${prob.title}"?`)) {
                          deleteProblem(prob.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-dark-950 border border-dark-800 text-dark-400 hover:bg-rose-950/20 hover:border-rose-900/40 hover:text-rose-400 cursor-pointer transition-all"
                      title="Delete problem"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: History Timeline Logs */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-slide-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white m-0">Completed Attempts Database</h3>
                {attempts.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all attempt logs? This resets local records.')) {
                        clearAttempts();
                      }
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-dark-950 border border-rose-900/35 hover:bg-rose-950/30 text-rose-350 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Purge Attempts Database</span>
                  </button>
                )}
              </div>

              {attempts.length === 0 ? (
                <div className="p-8 text-center text-xs text-dark-500 italic glass-panel rounded-2xl">
                  No practice submissions found. Start a test and submit solutions to populate logs database.
                </div>
              ) : (
                <div className="space-y-3">
                  {attempts.map((att) => {
                    const status = getEndReasonLabel(att.endReason);
                    const isExpanded = expandedAttempt === att.id;

                    return (
                      <div key={att.id} className="glass-panel rounded-xl overflow-hidden transition-all duration-300">
                        
                        {/* Summary Header Accordion click */}
                        <div
                          onClick={() => toggleExpandAttempt(att.id)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-900/60 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-dark-950 border border-dark-850 text-primary-400">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-white text-sm m-0">{att.userName}</h4>
                                <span className="text-4xs text-dark-450 font-mono">({att.userEmail})</span>
                              </div>
                              <p className="text-3xs text-dark-450 mt-1">
                                Problem: <span className="text-white font-medium">{att.problemTitle}</span> ({att.language}) | Date: {new Date(att.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-4xs font-bold border ${status.color}`}>
                              {status.icon}
                              {status.text}
                            </span>
                            
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-dark-400" /> : <ChevronDown className="h-4 w-4 text-dark-400" />}
                          </div>
                        </div>

                        {/* Collapsed/Expanded Log Timeline details */}
                        {isExpanded && (
                          <div className="px-6 py-4 bg-dark-950/80 border-t border-dark-850 space-y-4 animate-slide-in">
                            
                            {/* Proctoring log summaries */}
                            <div>
                              <h5 className="text-4xs font-bold uppercase tracking-wider text-dark-400 mb-2 flex items-center">
                                <AlertOctagon className="h-3.5 w-3.5 mr-1.5 text-rose-450" />
                                Proctoring Event Registry ({att.warningsCount} warnings)
                              </h5>

                              {att.warningsLog.length === 0 ? (
                                <p className="text-3xs text-emerald-450 italic m-0">
                                  No warnings detected. Perfect compliance.
                                </p>
                              ) : (
                                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                  {att.warningsLog.map((log, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-2 rounded bg-dark-900 border border-dark-850 text-4xs font-mono">
                                      <div className="space-y-0.5">
                                        <span className="text-rose-400 font-bold block uppercase">{log.type}</span>
                                        <span className="text-dark-300 block">{log.description}</span>
                                      </div>
                                      <span className="text-dark-500 font-semibold shrink-0 ml-2">{log.timestamp}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Submitted Workspace Code */}
                            <div>
                              <h5 className="text-4xs font-bold uppercase tracking-wider text-dark-400 mb-2 flex items-center">
                                <FileCode className="h-3.5 w-3.5 mr-1.5 text-primary-400" />
                                Submitted Code Solution
                              </h5>
                              <pre className="p-3.5 rounded-lg bg-dark-950 border border-dark-850 text-3xs font-mono overflow-x-auto text-dark-250 max-h-48 overflow-y-auto leading-relaxed">
                                {att.codeSubmitted}
                              </pre>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
