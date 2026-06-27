import React, { useState } from 'react';
import { useTest } from '../context/TestContext';
import { Play, ShieldAlert, Clock, AlertTriangle, Monitor, Settings, Code } from 'lucide-react';

export const LandingPage = ({ onNavigateToAdmin }) => {
  const { config, problems, startTest } = useTest();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProblemId, setSelectedProblemId] = useState(problems[0]?.id || '');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!selectedProblemId) {
      setError('Please select a problem.');
      return;
    }
    if (!agreed) {
      setError('You must read and agree to the exam terms.');
      return;
    }

    setError('');

    // Try going fullscreen if configured
    if (config.forceFullscreen) {
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.mozRequestFullScreen) { // Firefox
          await docEl.mozRequestFullScreen();
        } else if (docEl.webkitRequestFullscreen) { // Chrome, Safari and Opera
          await docEl.webkitRequestFullscreen();
        } else if (docEl.msRequestFullscreen) { // IE/Edge
          await docEl.msRequestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen permission denied or blocked: ", err);
        // We will still start the test but let the user know
      }
    }

    startTest(name, email, selectedProblemId);
  };

  return (
    <div className="min-height-screen bg-dark-950 text-dark-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between border-b border-dark-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/20">
            <Code className="h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white m-0">CodeSphere</h1>
            <p className="text-xs text-dark-400">Assessment & Proctoring Sandbox</p>
          </div>
        </div>

        <button
          onClick={onNavigateToAdmin}
          className="flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-dark-900 border border-dark-800 hover:bg-dark-800 hover:border-dark-700 hover:text-white transition-all cursor-pointer"
        >
          <Settings className="h-4 w-4" />
          <span>Admin & Logs</span>
        </button>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8">
        
        {/* Left Side: Instructions */}
        <section className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-950 text-primary-300 border border-primary-800/40">
              Environment Setup Test
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl m-0 leading-tight">
              Mock Assessment Sandbox
            </h2>
            <p className="text-lg text-dark-300">
              Test your browser compatibility and experience a simulation of standard coding assessment layouts.
            </p>
          </div>

          {/* Guidelines Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl flex space-x-3">
              <Clock className="h-6 w-6 text-primary-400 shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm m-0">Countdown Timer</h4>
                <p className="text-xs text-dark-400 mt-1">
                  You have {config.timeLimitMinutes} minutes to solve the chosen coding challenge.
                </p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex space-x-3">
              <Monitor className="h-6 w-6 text-primary-400 shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm m-0">Fullscreen Enforced</h4>
                <p className="text-xs text-dark-400 mt-1">
                  {config.forceFullscreen ? 'System will lock browser to fullscreen. Exits trigger alerts.' : 'Fullscreen is configured as optional.'}
                </p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex space-x-3">
              <ShieldAlert className="h-6 w-6 text-yellow-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm m-0">Proctoring System</h4>
                <p className="text-xs text-dark-400 mt-1">
                  We track tab switches, window blur focus, screen state, and developer tools shortcuts.
                </p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex space-x-3">
              <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm m-0">Warning Budget</h4>
                <p className="text-xs text-dark-400 mt-1">
                  Exceeding {config.maxWarnings} warning violations terminates your test automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 text-xs text-dark-400 leading-relaxed">
            <p className="font-semibold text-dark-300 mb-1">Disclaimer & Scope:</p>
            This portal is for compatibility testing and practicing in a simulated layout. It is locally executed, uses browser storage for history logs, and does not record screen or webcam content.
          </div>
        </section>

        {/* Right Side: Credentials & Initiation Form */}
        <section className="lg:col-span-5 flex flex-col justify-center">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-xl shadow-black/40">
            <h3 className="text-xl font-bold text-white mb-6">Candidate Details</h3>
            
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-950 border border-dark-800 focus:border-primary-500 text-white placeholder-dark-500 transition-colors focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-950 border border-dark-800 focus:border-primary-500 text-white placeholder-dark-500 transition-colors focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1">
                  Select Coding Challenge
                </label>
                <select
                  value={selectedProblemId}
                  onChange={(e) => setSelectedProblemId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-950 border border-dark-800 focus:border-primary-500 text-white placeholder-dark-500 transition-colors focus:outline-none appearance-none cursor-pointer"
                >
                  {problems.map((prob) => (
                    <option key={prob.id} value={prob.id} className="bg-dark-950 text-white">
                      {prob.title} ({prob.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-dark-800 text-primary-600 focus:ring-primary-500 bg-dark-950 cursor-pointer accent-primary-500"
                  />
                  <span className="text-xs text-dark-300 select-none">
                    I acknowledge that leaving fullscreen, switching tabs, or resizing my browser window will count as a proctoring violation.
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center space-x-2 py-3 px-4 bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Assessment</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full border-t border-dark-850 pt-4 flex items-center justify-between text-xs text-dark-400">
        <span>© {new Date().getFullYear()} CodeSphere. All rights reserved.</span>
        <span>Environment Version 1.0.0</span>
      </footer>
    </div>
  );
};
