import React, { useState, useEffect } from 'react';
import { useTest } from '../context/TestContext';
import { useProctoring } from '../hooks/useProctoring';
import { ProblemStatement } from './ProblemStatement';
import { CodeWorkspace } from './CodeWorkspace';
import { WarningDialog } from './WarningDialog';
import { Shield, Clock, AlertTriangle, Maximize2, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export const CandidateView = () => {
  // Start proctoring event listeners
  useProctoring();

  const {
    activeProblem,
    timeRemaining,
    warningCount,
    config,
    userName,
    submitTest
  } = useTest();

  const [dismissedWarnings, setDismissedWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage

  // Track fullscreen changes in UI
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const handleDismissWarning = async () => {
    // Sync dismissed warning counter with total warnings
    setDismissedWarnings(warningCount);

    // Try to re-request fullscreen if forceFullscreen is true
    if (config.forceFullscreen && !document.fullscreenElement) {
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
      } catch (err) {
        console.warn('Re-entering fullscreen failed:', err);
      }
    }
  };

  const handleManualFSRequest = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Manual fullscreen toggle failed:', err);
    }
  };

  // Format time remaining (e.g. 01:29:45)
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const formattedHrs = hrs > 0 ? `${String(hrs).padStart(2, '0')}:` : '';
    const formattedMins = `${String(mins).padStart(2, '0')}:`;
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedHrs}${formattedMins}${formattedSecs}`;
  };

  const handleForceEnd = () => {
    if (window.confirm('Do you really want to end the test session now? All code written will be submitted.')) {
      submitTest('submit');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-dark-950 text-dark-100 overflow-hidden font-sans select-none">
      
      {/* Candidate workspace header */}
      <header className="h-14 bg-dark-900 border-b border-dark-850 px-4 flex items-center justify-between shrink-0">
        
        {/* Logo / Candidate detail */}
        <div className="flex items-center space-x-3">
          <div className="bg-primary-600/10 border border-primary-500/20 p-1.5 rounded-lg">
            <Shield className="h-4 w-4 text-primary-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white block">CodeSphere Exam</span>
            <span className="text-4xs text-dark-450 block font-mono">Candidate: {userName}</span>
          </div>
        </div>

        {/* Dynamic workspace context */}
        <div className="flex items-center space-x-6">
          
          {/* Violations warnings counts */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${
            warningCount > 0 
              ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' 
              : 'bg-dark-950 border-dark-800 text-dark-400'
          }`}>
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Warnings: {warningCount}/{config.maxWarnings}</span>
          </div>

          {/* Time Remaining Timer */}
          <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg border font-mono text-sm font-semibold tracking-wider ${
            timeRemaining < 300 
              ? 'bg-rose-950/40 border-rose-800/40 text-rose-400 animate-pulse' 
              : 'bg-dark-950 border-dark-800 text-white'
          }`}>
            <Clock className="h-4 w-4 text-primary-400" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

        </div>

        {/* Quick controls */}
        <div className="flex items-center space-x-3">
          
          {/* Fullscreen restore button */}
          {!isFullscreen && config.forceFullscreen && (
            <button
              onClick={handleManualFSRequest}
              title="Enter Fullscreen"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-yellow-950/20 border border-yellow-800/40 hover:bg-yellow-950/40 hover:border-yellow-700/60 text-yellow-300 text-xs font-semibold cursor-pointer animate-pulse transition-all"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Fix Fullscreen</span>
            </button>
          )}

          {/* End test early */}
          <button
            onClick={handleForceEnd}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-dark-950 border border-dark-800 hover:bg-rose-950/45 hover:border-rose-900/60 hover:text-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-400" />
            <span>Quit Exam</span>
          </button>
        </div>

      </header>

      {/* Main split viewport workspace */}
      <main className="flex-1 min-h-0 flex relative">
        
        {/* Left Panel: Problem Statement Description */}
        <div 
          style={{ width: `${leftPanelWidth}%` }}
          className="h-full bg-dark-950 overflow-hidden"
        >
          <ProblemStatement problem={activeProblem} />
        </div>

        {/* Split pane resizing handle */}
        <div className="w-1 bg-dark-850 hover:bg-primary-500/80 cursor-col-resize transition-colors flex items-center justify-center shrink-0 relative group">
          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col space-y-1 py-3 px-1 rounded bg-dark-800 border border-dark-750 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-0.5 h-0.5 bg-dark-400 rounded-full"></div>
            <div className="w-0.5 h-0.5 bg-dark-400 rounded-full"></div>
            <div className="w-0.5 h-0.5 bg-dark-400 rounded-full"></div>
          </div>
        </div>

        {/* Right Panel: Code Workspace Editor */}
        <div 
          style={{ width: `${100 - leftPanelWidth}%` }}
          className="h-full"
        >
          <CodeWorkspace />
        </div>

      </main>

      {/* Warning Alert Modal Portal Overlay */}
      <WarningDialog 
        dismissedCount={dismissedWarnings} 
        onDismiss={handleDismissWarning} 
      />

    </div>
  );
};
