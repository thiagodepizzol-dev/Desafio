import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen';
import ChallengeScreen from './components/ChallengeScreen';
import { CHALLENGE_DATA } from './constants';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [challengeStarted, setChallengeStarted] = useState(false);

  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<boolean[]>(Array(CHALLENGE_DATA.length).fill(false));

  // Handle user authentication state and load data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // User is logged in, load their progress
        const docRef = doc(db, 'userProgress', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // If a progress doc exists, the user has started. Load the data.
          const data = docSnap.data();
          
          // Load currentDay, defaulting to 1 if not present
          setCurrentDay(data.currentDay || 1);

          // Load completedDays, defaulting to a new array if not present
          const loadedCompleted = data.completedDays || Array(CHALLENGE_DATA.length).fill(false);
          
          // Safety check: ensure the array length matches the current challenge length
          if (loadedCompleted.length !== CHALLENGE_DATA.length) {
              const correctedCompleted = Array(CHALLENGE_DATA.length).fill(false);
              const copyLength = Math.min(loadedCompleted.length, CHALLENGE_DATA.length);
              for (let i = 0; i < copyLength; i++) {
                  correctedCompleted[i] = loadedCompleted[i];
              }
              setCompletedDays(correctedCompleted);
          } else {
              setCompletedDays(loadedCompleted);
          }
          
          setChallengeStarted(true); // User has existing progress, go directly to challenge
        } else {
            // New user or no progress saved, show welcome screen first
            setChallengeStarted(false);
            // Reset to default state for a clean start
            setCurrentDay(1);
            setCompletedDays(Array(CHALLENGE_DATA.length).fill(false));
        }
      } else {
        // User is logged out, reset everything
        setCurrentDay(1);
        setCompletedDays(Array(CHALLENGE_DATA.length).fill(false));
        setChallengeStarted(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Save progress to Firestore whenever it changes
  useEffect(() => {
    if (!user || loading) {
      return; // Don't save if there's no user or initial data is loading
    }

    const saveProgress = async () => {
      try {
        const docRef = doc(db, 'userProgress', user.uid);
        await setDoc(docRef, {
          currentDay,
          completedDays,
        });
      } catch (error) {
        console.error("Error saving progress: ", error);
      }
    };
    
    saveProgress();

  }, [currentDay, completedDays, user, loading]);


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