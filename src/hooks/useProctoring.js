import { useEffect, useRef } from 'react';
import { useTest } from '../context/TestContext';

export const useProctoring = () => {
  const { isTestActive, config, addWarning, isTestCompleted } = useTest();
  const wasFullscreenRef = useRef(false);

  useEffect(() => {
    if (!isTestActive || isTestCompleted) {
      wasFullscreenRef.current = false;
      return;
    }

    // 1. Monitor Tab switching (visibilitychange)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isTestActive) {
        addWarning(
          'Tab Switch / Minimize',
          'Candidate moved away from the test tab or minimized the browser window.'
        );
      }
    };

    // 2. Monitor Window Focus Loss (blur)
    const handleWindowBlur = () => {
      if (isTestActive) {
        addWarning(
          'Window Focus Loss',
          'Candidate focused on another application or window outside the browser.'
        );
      }
    };

    // 3. Monitor Fullscreen Exits
    const handleFullscreenChange = () => {
      if (config.forceFullscreen) {
        const isCurrentlyFullscreen = !!document.fullscreenElement;
        
        // Only trigger warning if candidate WAS in fullscreen and now exited it
        if (wasFullscreenRef.current && !isCurrentlyFullscreen && isTestActive) {
          addWarning(
            'Fullscreen Exit',
            'Candidate exited the forced full-screen examination mode.'
          );
          wasFullscreenRef.current = false;
        } else if (isCurrentlyFullscreen) {
          wasFullscreenRef.current = true;
        }
      }
    };

    // Set initial fullscreen status
    if (config.forceFullscreen && document.fullscreenElement) {
      wasFullscreenRef.current = true;
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Block standard keys like F12, Ctrl+U, etc., to make it feel like a real assessment
    const handleKeyDown = (e) => {
      // Prevent F12 (Inspect Element)
      if (e.key === 'F12') {
        e.preventDefault();
        addWarning('Shortcut Blocked', 'Candidate attempted to open DevTools using F12 shortcut.');
      }
      
      // Prevent Ctrl+Shift+I / Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) {
        e.preventDefault();
        addWarning('Shortcut Blocked', 'Candidate attempted to open DevTools shortcut.');
      }

      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        addWarning('Shortcut Blocked', 'Candidate attempted to view page source shortcut.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTestActive, config.forceFullscreen, addWarning, isTestCompleted]);
};
