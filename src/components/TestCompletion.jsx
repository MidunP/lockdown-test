import React from 'react';
import { useTest } from '../context/TestContext';
import { CheckCircle2, AlertOctagon, Clock, ShieldAlert, Award, Calendar, RefreshCw, Settings } from 'lucide-react';

export const TestCompletion = ({ onNavigateToAdmin }) => {
  const {
    userName,
    userEmail,
    sessionEndReason,
    warningCount,
    warnings,
    activeProblem,
    language,
    timeRemaining,
    config,
    resetState
  } = useTest();

  const totalTimeSeconds = config.timeLimitMinutes * 60;
  const timeTakenSeconds = totalTimeSeconds - timeRemaining;

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getStatusConfig = () => {
    switch (sessionEndReason) {
      case 'warnings_exceeded':
        return {
          icon: <ShieldAlert className="h-12 w-12 text-rose-400" />,
          title: 'Assessment Terminated',
          description: 'Your test session was closed automatically because you exceeded the maximum allowed proctoring warnings.',
          bgColor: 'bg-rose-950/20 border-rose-900/40 text-rose-300',
          titleColor: 'text-rose-300'
        };
      case 'timeout':
        return {
          icon: <Clock className="h-12 w-12 text-yellow-400" />,
          title: 'Session Timeout',
          description: 'The examination countdown timer expired before manual submission.',
          bgColor: 'bg-yellow-950/20 border-yellow-900/40 text-yellow-300',
          titleColor: 'text-yellow-300'
        };
      case 'submit':
      default:
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-emerald-400" />,
          title: 'Assessment Submitted',
          description: 'Thank you! Your code solution has been compiled, checked against test cases, and logged successfully.',
          bgColor: 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300',
          titleColor: 'text-emerald-300'
        };
    }
  };

  const status = getStatusConfig();

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Centered Main Box */}
      <main className="max-w-2xl mx-auto w-full my-auto glass-panel rounded-2xl shadow-xl overflow-hidden animate-slide-in">
        
        {/* Status Header */}
        <div className="p-8 border-b border-dark-850 text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-dark-900 border border-dark-800">
            {status.icon}
          </div>
          <div className="space-y-1">
            <h2 className={`text-2xl font-extrabold tracking-tight ${status.titleColor} m-0`}>
              {status.title}
            </h2>
            <p className="text-xs text-dark-400 font-mono mt-1">Candidate ID: {userEmail}</p>
          </div>
          <p className="text-sm text-dark-300 max-w-md mx-auto leading-relaxed mt-2">
            {status.description}
          </p>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 gap-px bg-dark-850 text-xs">
          
          <div className="bg-dark-900 p-4 flex flex-col justify-between space-y-2">
            <span className="text-dark-450 uppercase font-semibold tracking-wider text-4xs">Candidate Name</span>
            <span className="text-white font-medium text-sm">{userName}</span>
          </div>

          <div className="bg-dark-900 p-4 flex flex-col justify-between space-y-2">
            <span className="text-dark-450 uppercase font-semibold tracking-wider text-4xs">Target Problem</span>
            <span className="text-white font-medium text-sm">{activeProblem?.title || 'Unknown'}</span>
          </div>

          <div className="bg-dark-900 p-4 flex flex-col justify-between space-y-2">
            <span className="text-dark-450 uppercase font-semibold tracking-wider text-4xs">Language Used</span>
            <span className="text-white font-medium text-sm uppercase">{language}</span>
          </div>

          <div className="bg-dark-900 p-4 flex flex-col justify-between space-y-2">
            <span className="text-dark-450 uppercase font-semibold tracking-wider text-4xs">Total Time Taken</span>
            <span className="text-white font-medium text-sm">{formatDuration(timeTakenSeconds)}</span>
          </div>

          <div className="bg-dark-900 p-4 col-span-2 flex items-center justify-between">
            <span className="text-dark-450 uppercase font-semibold tracking-wider text-4xs">Proctoring Warnings</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
              warningCount > 0 ? 'bg-rose-950 text-rose-300 border border-rose-900/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-900/30'
            }`}>
              {warningCount} Warnings Triggered
            </span>
          </div>

        </div>

        {/* Violation Log Section */}
        {warningCount > 0 && (
          <div className="p-6 border-t border-dark-850">
            <h4 className="text-xs font-bold uppercase tracking-wider text-dark-300 mb-3 flex items-center">
              <AlertOctagon className="h-4 w-4 mr-1.5 text-rose-400" />
              Proctoring Violation Timeline
            </h4>
            
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {warnings.map((warn, i) => (
                <div key={i} className="flex justify-between items-start p-2.5 rounded bg-dark-950 border border-dark-850 font-mono text-3xs">
                  <div className="space-y-0.5">
                    <span className="text-rose-400 font-bold block uppercase">{warn.type}</span>
                    <span className="text-dark-300 block">{warn.description}</span>
                  </div>
                  <span className="text-dark-500 font-semibold shrink-0 ml-2">{warn.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div className="p-6 bg-dark-950 border-t border-dark-850 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={resetState}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-dark-900 hover:bg-dark-800 border border-dark-850 hover:border-dark-750 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Practice Again</span>
          </button>
          
          <button
            onClick={onNavigateToAdmin}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 cursor-pointer text-sm"
          >
            <Settings className="h-4 w-4" />
            <span>Go to Admin & Review Logs</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center text-xs text-dark-500">
        © {new Date().getFullYear()} CodeSphere Proctoring Sandbox
      </footer>

    </div>
  );
};
