import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen';
import ChallengeScreen from './components/ChallengeScreen';
import { CHALLENGE_DATA } from './constants';
import { auth } from './firebase';
import { onAuthStateChanged, User } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [challengeStarted, setChallengeStarted] = useState(false);

  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<boolean[]>(Array(CHALLENGE_DATA.length).fill(false));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Reset challenge progress on logout
        setChallengeStarted(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStartChallenge = () => {
    setChallengeStarted(true);
  };

  const toggleDayCompletion = (dayIndex: number) => {
    const newCompleted = [...completedDays];
    newCompleted[dayIndex] = !newCompleted[dayIndex];
    setCompletedDays(newCompleted);
  };

  const getUserName = () => {
    if (!user) return '';
    // Use the part of the email before the @ as a name, and capitalize it.
    const emailName = user.email?.split('@')[0] || 'Guerreiro';
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-brand-bg text-brand-text">
          <p className="font-serif text-2xl">Carregando...</p>
        </div>
      );
    }

    if (!user) {
      return <LoginScreen />;
    }

    if (!challengeStarted) {
      return <WelcomeScreen userName={getUserName()} onStart={handleStartChallenge} />;
    }

    return (
      <ChallengeScreen
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        completedDays={completedDays}
        toggleDayCompletion={toggleDayCompletion}
      />
    );
  };

  return (
    <div className="min-h-screen font-sans bg-brand-bg text-brand-text">
      {renderView()}
    </div>
  );
};

export default App;
