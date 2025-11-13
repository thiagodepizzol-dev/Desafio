import React, { useState } from 'react';
import { CHALLENGE_DATA } from '../constants';
import { ChallengeDay } from '../types';
import { MenuIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons';
import { auth } from '../firebase';
import { signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

interface ChallengeScreenProps {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  completedDays: boolean[];
  toggleDayCompletion: (dayIndex: number) => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ currentDay, setCurrentDay, completedDays, toggleDayCompletion }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dayData = CHALLENGE_DATA[currentDay - 1];

  const goToDay = (day: number) => {
    if (day >= 1 && day <= CHALLENGE_DATA.length) {
      setCurrentDay(day);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const dayIndex = currentDay - 1;

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      <header className="absolute top-0 right-0 p-6 z-20">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu">
          <MenuIcon />
        </button>
      </header>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30" 
          onClick={() => setIsMenuOpen(false)}
        >
          <nav 
            className="absolute top-0 right-0 h-full w-64 bg-brand-bg shadow-lg p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            aria-label="Menu de navegação"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-2xl">Desafio</h2>
              <button onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
                <CloseIcon />
              </button>
            </div>
            <ul>
              {CHALLENGE_DATA.map(day => (
                <li key={day.day}>
                  <button 
                    onClick={() => goToDay(day.day)}
                    className={`w-full text-left py-2 px-2 rounded transition-colors ${currentDay === day.day ? 'bg-brand-green font-bold' : 'hover:bg-brand-green/50'}`}
                  >
                    Dia {day.day}
                  </button>
                </li>
              ))}
            </ul>
             <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-2 rounded mt-auto transition-colors hover:bg-brand-green/50"
            >
                Sair
            </button>
          </nav>
        </div>
      )}

      <main className="pt-20 px-4 md:px-8">
        <div className="aspect-video rounded-lg overflow-hidden shadow-lg mx-auto max-w-sm">
           <iframe 
            src={`https://www.youtube.com/embed/${dayData.videoId}?autoplay=1&mute=1&loop=1&playlist=${dayData.videoId}`} 
            title={dayData.title}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        <div className="max-w-4xl mx-auto mt-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl">Dia {dayData.day}: {dayData.title}</h1>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto">{dayData.description}</p>
        </div>
        
        <div className="flex items-center justify-between max-w-xl mx-auto mt-8">
          <button onClick={() => goToDay(currentDay - 1)} disabled={currentDay === 1} className="disabled:opacity-30" aria-label="Dia anterior">
            <ChevronLeftIcon />
          </button>
          <div className="flex items-center text-lg font-semibold">
            <ClockIcon />
            <span>{dayData.duration} MINUTOS</span>
          </div>
          <button onClick={() => goToDay(currentDay + 1)} disabled={currentDay === CHALLENGE_DATA.length} className="disabled:opacity-30" aria-label="Próximo dia">
            <ChevronRightIcon />
          </button>
        </div>
      </main>

      <footer className="relative mt-12 py-12 flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-brand-blue opacity-50 -skew-y-3"></div>
        <div className="relative z-10">
            <label className="flex items-center text-lg cursor-pointer">
              <div className="relative flex items-center justify-center h-6 w-6 mr-3">
                  <input 
                      type="checkbox" 
                      checked={completedDays[dayIndex]}
                      onChange={() => toggleDayCompletion(dayIndex)}
                      className="appearance-none h-full w-full border border-brand-text bg-white rounded-sm checked:bg-brand-text focus:outline-none"
                      aria-labelledby="challenge-complete-label"
                  />
                  {completedDays[dayIndex] && (
                      <svg className="absolute w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                  )}
              </div>
              <span id="challenge-complete-label">DESAFIO CONCLUÍDO</span>
            </label>
        </div>
      </footer>
    </div>
  );
};

export default ChallengeScreen;