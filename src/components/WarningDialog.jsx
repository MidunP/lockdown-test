import React from 'react';
import { ShieldAlert, AlertOctagon, HelpCircle } from 'lucide-react';
import { useTest } from '../context/TestContext';

export const WarningDialog = ({ dismissedCount, onDismiss }) => {
  const { warningCount, warnings, config } = useTest();

  // If there are no warnings or they have all been dismissed, render nothing
  if (warningCount <= dismissedCount) return null;

  const currentWarning = warnings[warnings.length - 1];
  const maxWarnings = config.maxWarnings;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-md w-full rounded-2xl shadow-2xl border-rose-900/60 overflow-hidden transform scale-100 animate-slide-in">
        
        {/* Banner header */}
        <div className="bg-rose-950/60 border-b border-rose-900/40 p-6 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-rose-900/40 text-rose-400 pulsing-dot">
            <AlertOctagon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-300 uppercase tracking-wider m-0">Proctoring Violation</h3>
            <p className="text-xs text-rose-400/80 font-medium mt-1">Warning {warningCount} of {maxWarnings}</p>
          </div>
        </div>

        {/* Warning Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-dark-300 leading-relaxed">
            The browser detected an event that violates the examination parameters. All events are logged for review.
          </p>

          {currentWarning && (
            <div className="p-4 rounded-xl bg-dark-950 border border-dark-850 space-y-1.5">
              <span className="text-3xs font-semibold text-rose-400 uppercase tracking-widest block">
                Violation: {currentWarning.type}
              </span>
              <p className="text-xs text-dark-300 leading-relaxed font-mono">
                {currentWarning.description}
              </p>
              <span className="text-4xs text-dark-500 font-semibold block text-right mt-1">
                Timestamp: {currentWarning.timestamp}
              </span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-dark-900 border border-dark-800 text-2xs text-dark-400 flex items-start space-x-2">
            <HelpCircle className="h-4 w-4 text-dark-500 shrink-0 mt-0.5" />
            <p className="m-0 leading-relaxed">
              Exceeding {maxWarnings} violations will submit your assessment immediately and lock your attempt. Please maintain focus on this tab.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-dark-950 border-t border-dark-850 flex justify-end">
          <button
            onClick={onDismiss}
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20"
          >
            I Understand & Resume Test
          </button>
        </div>

      </div>
    </div>
  );
};
