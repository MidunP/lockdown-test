import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTest } from '../context/TestContext';
import { Play, Send, RefreshCw, ChevronRight, Terminal, CheckCircle2, XCircle } from 'lucide-react';

export const CodeWorkspace = () => {
  const { 
    code, 
    setCode, 
    language, 
    setLanguage, 
    activeProblem, 
    submitTest 
  } = useTest();

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);

  // Clear console output when problem changes
  useEffect(() => {
    setConsoleOutput(null);
  }, [activeProblem]);

  const handleResetCode = () => {
    if (window.confirm('Are you sure you want to reset the editor code to starter template?')) {
      setCode(activeProblem.starterCode[language] || '');
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput({ status: 'running', message: 'Compiling & executing test cases...' });
    
    // Simulate compilation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (language === 'javascript') {
      try {
        // Extract function reference by evaluating code
        const evalCode = `
          ${code}
          if (typeof twoSum === 'function') twoSum;
          else if (typeof isValid === 'function') isValid;
          else if (typeof isPalindrome === 'function') isPalindrome;
          else null;
        `;
        const testFunction = (0, eval)(evalCode);

        if (!testFunction) {
          throw new Error('ReferenceError: Primary target function not defined in workspace.');
        }

        const results = [];
        let passedCount = 0;

        if (activeProblem.id === 'two-sum') {
          const testCases = [
            { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
            { nums: [3, 2, 4], target: 6, expected: [1, 2] },
            { nums: [3, 3], target: 6, expected: [0, 1] }
          ];

          testCases.forEach((tc, idx) => {
            try {
              const actual = testFunction(tc.nums, tc.target);
              const isMatch = Array.isArray(actual) && actual.length === 2 && 
                ((actual[0] === tc.expected[0] && actual[1] === tc.expected[1]) ||
                 (actual[0] === tc.expected[1] && actual[1] === tc.expected[0]));
              
              if (isMatch) passedCount++;
              results.push({
                name: `Test Case ${idx + 1}`,
                input: `nums = [${tc.nums.join(',')}], target = ${tc.target}`,
                expected: `[${tc.expected.join(', ')}]`,
                actual: Array.isArray(actual) ? `[${actual.join(', ')}]` : String(actual),
                passed: isMatch
              });
            } catch (e) {
              results.push({
                name: `Test Case ${idx + 1}`,
                input: `nums = [${tc.nums.join(',')}], target = ${tc.target}`,
                expected: `[${tc.expected.join(', ')}]`,
                actual: `RuntimeError: ${e.message}`,
                passed: false
              });
            }
          });
        } else if (activeProblem.id === 'valid-parentheses') {
          const testCases = [
            { s: '()', expected: true },
            { s: '()[]{}', expected: true },
            { s: '(]', expected: false }
          ];

          testCases.forEach((tc, idx) => {
            try {
              const actual = testFunction(tc.s);
              const isMatch = actual === tc.expected;
              if (isMatch) passedCount++;
              results.push({
                name: `Test Case ${idx + 1}`,
                input: `s = "${tc.s}"`,
                expected: String(tc.expected),
                actual: String(actual),
                passed: isMatch
              });
            } catch (e) {
              results.push({
                name: `Test Case ${idx + 1}`,
                input: `s = "${tc.s}"`,
                expected: String(tc.expected),
                actual: `RuntimeError: ${e.message}`,
                passed: false
              });
            }
          });
        } else if (activeProblem.id === 'palindrome-number') {
          const testCases = [
            { x: 121, expected: true },
            { x: -121, expected: false },
            { x: 10, expected: false }
          ];

          testCases.forEach((tc, idx) => {
            try {
              const actual = testFunction(tc.x);
              const isMatch = actual === tc.expected;
              if (isMatch) passedCount++;
              results.push({
                name: `Test Case ${idx + 1}`,
                input: `x = ${tc.x}`,
                expected: String(tc.expected),
                actual: String(actual),
                passed: isMatch
              });
            } catch (e) {
              results.push({
                name: `Test Case ${idx + 1}`,
                input: `x = ${tc.x}`,
                expected: String(tc.expected),
                actual: `RuntimeError: ${e.message}`,
                passed: false
              });
            }
          });
        }

        setConsoleOutput({
          status: passedCount === results.length ? 'success' : 'failed',
          passedCount,
          totalCount: results.length,
          results
        });
      } catch (err) {
        setConsoleOutput({
          status: 'error',
          message: err.stack || err.toString()
        });
      }
    } else {
      // Mock compilers for non-JS languages
      // Simple heuristic: if user didn't write anything substantial or left standard templates
      const isEmpty = code.includes('// Write your code here') || 
                      code.includes('# Write your code here') || 
                      code.trim().length < 80;
      
      const results = activeProblem.testCases.map((tc, idx) => ({
        name: `Test Case ${idx + 1}`,
        input: tc.input,
        expected: tc.expected,
        actual: isEmpty ? 'null (starter stub unmodified)' : tc.expected,
        passed: !isEmpty
      }));

      const passedCount = isEmpty ? 0 : results.length;
      setConsoleOutput({
        status: passedCount === results.length ? 'success' : 'failed',
        passedCount,
        totalCount: results.length,
        results,
        isSimulated: true
      });
    }

    setIsRunning(false);
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to final submit your code? This ends the assessment.')) {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      submitTest('submit');
    }
  };

  return (
    <div className="h-full flex flex-col bg-dark-900 border-l border-dark-800">
      
      {/* Editor Control Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-950 border-b border-dark-850 shrink-0">
        
        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold tracking-wide text-dark-400 uppercase">Lang:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-dark-900 border border-dark-800 focus:border-primary-500 text-white cursor-pointer focus:outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++</option>
            <option value="java">Java 17</option>
          </select>
        </div>

        {/* Reset Trigger */}
        <button
          onClick={handleResetCode}
          title="Reset code editor template"
          className="p-1.5 rounded hover:bg-dark-900 hover:text-white border border-transparent hover:border-dark-800 text-dark-400 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Code Editor Container */}
      <div className="flex-1 min-h-0 bg-dark-900">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            fontSize: 14,
            fontFamily: 'Fira Code, Consolas, Courier New, monospace',
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            },
            tabSize: 2,
            insertSpaces: true,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
            fontLigatures: true
          }}
          loading={
            <div className="h-full flex items-center justify-center text-sm text-dark-400 bg-dark-900">
              Initializing Code Editor...
            </div>
          }
        />
      </div>

      {/* Console Area */}
      <div className="h-56 border-t border-dark-850 flex flex-col bg-dark-950 shrink-0">
        {/* Console Header */}
        <div className="flex items-center px-4 py-1.5 bg-dark-900/60 border-b border-dark-850 text-xs font-semibold text-dark-300">
          <Terminal className="h-3.5 w-3.5 mr-2 text-primary-400" />
          <span>Execution Console</span>
        </div>

        {/* Console Logs Output */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-dark-300">
          {!consoleOutput && (
            <div className="text-dark-500 italic h-full flex items-center justify-center">
              Write code and click 'Run Code' to execute against test cases.
            </div>
          )}

          {consoleOutput && consoleOutput.status === 'running' && (
            <div className="flex items-center space-x-2 text-primary-400 h-full justify-center">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{consoleOutput.message}</span>
            </div>
          )}

          {consoleOutput && consoleOutput.status === 'error' && (
            <div className="text-rose-400 whitespace-pre bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg">
              {consoleOutput.message}
            </div>
          )}

          {consoleOutput && (consoleOutput.status === 'success' || consoleOutput.status === 'failed') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-dark-850">
                <span className="flex items-center font-bold">
                  {consoleOutput.status === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1.5 text-rose-400" />
                  )}
                  {consoleOutput.status === 'success' ? 'All Test Cases Passed' : 'Some Test Cases Failed'}
                </span>
                <span className="text-dark-400 font-semibold">
                  Passed: {consoleOutput.passedCount}/{consoleOutput.totalCount}
                </span>
              </div>
              
              <div className="space-y-2">
                {consoleOutput.results.map((res, idx) => (
                  <div key={idx} className={`p-2.5 rounded-lg border text-2xs ${
                    res.passed 
                      ? 'bg-emerald-950/10 border-emerald-900/30' 
                      : 'bg-rose-950/10 border-rose-900/30'
                  }`}>
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className={res.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {res.name}
                      </span>
                      <span>{res.passed ? 'Pass' : 'Fail'}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1 mt-1.5 font-mono text-3xs text-dark-400">
                      <div className="col-span-3 font-semibold uppercase">Input:</div>
                      <div className="col-span-9 text-dark-200">{res.input}</div>

                      <div className="col-span-3 font-semibold uppercase">Expected:</div>
                      <div className="col-span-9 text-dark-200">{res.expected}</div>

                      <div className="col-span-3 font-semibold uppercase">Actual:</div>
                      <div className="col-span-9 text-dark-200">{res.actual}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {consoleOutput.isSimulated && (
                <p className="text-3xs text-dark-500 italic mt-2">
                  * Execution simulated. Write solution logic inside the function body to pass.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 py-2.5 bg-dark-900/80 border-t border-dark-850 flex justify-end space-x-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-700 text-white cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>Run Code</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-5 py-2 text-sm font-bold rounded-xl bg-primary-600 hover:bg-primary-500 text-white cursor-pointer disabled:opacity-50 transition-all shadow-md shadow-primary-500/10 hover:shadow-primary-500/20"
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Submit Code</span>
          </button>
        </div>
      </div>

    </div>
  );
};
