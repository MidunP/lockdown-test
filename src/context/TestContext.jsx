import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const TestContext = createContext();

const DEFAULT_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    points: 100,
    description: `### Problem Description

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Examples

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

### Constraints
* \`2 <= nums.length <= 10^4\`
* \`-10^9 <= nums[i] <= 10^9\`
* \`-10^9 <= target <= 10^9\`
* Only one valid answer exists.`,
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your code here\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) {\n        return [i, j];\n      }\n    }\n  }\n  return [];\n}`,
      python: `def two_sum(nums, target):\n    # Write your code here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}`
    },
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1, 2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0, 1]' }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    points: 200,
    description: `### Problem Description

Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Examples

**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: s = "(]"
Output: false
\`\`\`

### Constraints
* \`1 <= s.length <= 10^4\`
* \`s\` consists of parentheses only \`'()[]{}'\`.`,
    starterCode: {
      javascript: `function isValid(s) {\n  // Write your code here\n  const stack = [];\n  const mapping = {\n    ')': '(',\n    '}': '{',\n    ']': '['\n  };\n  \n  for (let char of s) {\n    if (char in mapping) {\n      const topElement = stack.length === 0 ? '#' : stack.pop();\n      if (mapping[char] !== topElement) {\n        return false;\n      }\n    } else {\n      stack.push(char);\n    }\n  }\n  \n  return stack.length === 0;\n}`,
      python: `def is_valid(s):\n    # Write your code here\n    pass`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n    }\n}`
    },
    testCases: [
      { input: 's = "()"', expected: 'true' },
      { input: 's = "()[]{}"', expected: 'true' },
      { input: 's = "(]"', expected: 'false' }
    ]
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    points: 100,
    description: `### Problem Description

Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

### Examples

**Example 1:**
\`\`\`
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.
\`\`\`

**Example 2:**
\`\`\`
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
\`\`\`

### Constraints
* \`-2^31 <= x <= 2^31 - 1\``,
    starterCode: {
      javascript: `function isPalindrome(x) {\n  // Write your code here\n  if (x < 0) return false;\n  const str = x.toString();\n  return str === str.split('').reverse().join('');\n}`,
      python: `def is_palindrome(x):\n    # Write your code here\n    pass`,
      cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // Write your code here\n    }\n};`,
      java: `class Solution {\n    public boolean isPalindrome(int x) {\n        // Write your code here\n    }\n}`
    },
    testCases: [
      { input: 'x = 121', expected: 'true' },
      { input: 'x = -121', expected: 'false' },
      { input: 'x = 10', expected: 'false' }
    ]
  }
];

export const TestProvider = ({ children }) => {
  // Config
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('proctor_config');
    return saved ? JSON.parse(saved) : {
      timeLimitMinutes: 90,
      maxWarnings: 3,
      forceFullscreen: true
    };
  });

  // Problems list (including custom ones)
  const [problems, setProblems] = useState(() => {
    const saved = localStorage.getItem('proctor_problems');
    return saved ? JSON.parse(saved) : DEFAULT_PROBLEMS;
  });

  // Global test session details
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  
  // Timer & active workspace details
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [activeProblem, setActiveProblem] = useState(problems[0]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  
  // Monitoring details
  const [warningCount, setWarningCount] = useState(0);
  const [warnings, setWarnings] = useState([]); // Array of { timestamp, type, description }
  const [sessionEndReason, setSessionEndReason] = useState(''); // 'submit', 'warnings_exceeded', 'timeout'
  
  // History of all mock attempts
  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem('proctor_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const timerRef = useRef(null);

  // Synchronize configs and problems
  useEffect(() => {
    localStorage.setItem('proctor_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('proctor_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('proctor_attempts', JSON.stringify(attempts));
  }, [attempts]);

  // Handle countdown timer
  useEffect(() => {
    if (isTestActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitTest('timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestActive, timeRemaining]);

  // Set default code when problem or language changes
  useEffect(() => {
    if (activeProblem && activeProblem.starterCode) {
      setCode(activeProblem.starterCode[language] || '');
    }
  }, [activeProblem, language]);

  // Starts the test session
  const startTest = (name, email, selectedProblemId) => {
    setUserName(name || 'Candidate');
    setUserEmail(email || 'candidate@example.com');
    
    const problem = problems.find(p => p.id === selectedProblemId) || problems[0];
    setActiveProblem(problem);
    setCode(problem.starterCode[language] || '');
    
    setTimeRemaining(config.timeLimitMinutes * 60);
    setWarningCount(0);
    setWarnings([]);
    setSessionEndReason('');
    setIsTestCompleted(false);
    setIsTestActive(true);
  };

  // Submit/End test
  const submitTest = (reason = 'submit') => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsTestActive(false);
    setIsTestCompleted(true);
    setSessionEndReason(reason);

    // Save attempt logs
    const newAttempt = {
      id: Date.now().toString(),
      userName,
      userEmail,
      problemTitle: activeProblem ? activeProblem.title : 'N/A',
      codeSubmitted: code,
      language,
      warningsCount: warningCount,
      warningsLog: [...warnings],
      submittedAt: new Date().toISOString(),
      endReason: reason,
      timeTakenSeconds: (config.timeLimitMinutes * 60) - timeRemaining
    };

    setAttempts((prev) => [newAttempt, ...prev]);

    // Attempt exit fullscreen safely
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch (e) {
      console.warn("Could not exit fullscreen: ", e);
    }
  };

  // Reset to landing page
  const resetState = () => {
    setIsTestActive(false);
    setIsTestCompleted(false);
    setWarningCount(0);
    setWarnings([]);
    setSessionEndReason('');
  };

  // Add violation warning
  const addWarning = (type, description) => {
    if (!isTestActive) return;

    const timestamp = new Date().toLocaleTimeString();
    const newWarning = { timestamp, type, description };
    
    setWarnings((prev) => {
      const updated = [...prev, newWarning];
      const newCount = updated.length;
      setWarningCount(newCount);

      if (newCount >= config.maxWarnings) {
        setTimeout(() => {
          submitTest('warnings_exceeded');
        }, 100);
      }
      return updated;
    });
  };

  // Helper to add custom problems
  const addCustomProblem = (newProblem) => {
    const formattedProblem = {
      id: newProblem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...newProblem
    };
    setProblems((prev) => [...prev, formattedProblem]);
  };

  const deleteProblem = (problemId) => {
    setProblems((prev) => prev.filter(p => p.id !== problemId));
  };

  const clearAttempts = () => {
    setAttempts([]);
  };

  return (
    <TestContext.Provider
      value={{
        config,
        setConfig,
        problems,
        addCustomProblem,
        deleteProblem,
        userName,
        userEmail,
        isTestActive,
        isTestCompleted,
        timeRemaining,
        activeProblem,
        setActiveProblem,
        code,
        setCode,
        language,
        setLanguage,
        warningCount,
        warnings,
        sessionEndReason,
        attempts,
        clearAttempts,
        startTest,
        submitTest,
        resetState,
        addWarning
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};
