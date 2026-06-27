import React, { useState } from 'react';
import { TestProvider, useTest } from './context/TestContext';
import { LandingPage } from './components/LandingPage';
import { CandidateView } from './components/CandidateView';
import { TestCompletion } from './components/TestCompletion';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { isTestActive, isTestCompleted } = useTest();
  const [isAdmin, setIsAdmin] = useState(false);

  // Router dispatcher based on proctor context
  if (isTestActive) {
    return <CandidateView />;
  }

  if (isTestCompleted) {
    return (
      <TestCompletion
        onNavigateToAdmin={() => {
          setIsAdmin(true);
        }}
      />
    );
  }

  if (isAdmin) {
    return <AdminPanel onBack={() => setIsAdmin(false)} />;
  }

  return <LandingPage onNavigateToAdmin={() => setIsAdmin(true)} />;
}

function App() {
  return (
    <TestProvider>
      <AppContent />
    </TestProvider>
  );
}

export default App;
