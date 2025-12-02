
import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { CHALLENGE_DATA } from '../constants';
import { ChallengeDay } from '../types';
import { MenuIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, PlayIcon, PauseIcon } from './icons';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

// Componente da Barra de Progresso
const ProgressBar: React.FC<{ completedDays: boolean[]; totalDays: number }> = ({ completedDays, totalDays }) => {
  const completedCount = completedDays.filter(Boolean).length;
  const progressPercentage = totalDays > 0 ? (completedCount / totalDays) * 100 : 0;

  return (
    <div className="w-full">
      <div className="h-2 w-full bg-brand-green rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-text rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={totalDays}
        ></div>
      </div>
      <p className="text-xs text-brand-text/80 mt-1 text-center font-sans">
        {completedCount} de {totalDays} dias concluídos
      </p>
    </div>
  );
};


interface ChallengeScreenProps {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  completedDays: boolean[];
  toggleDayCompletion: (dayIndex: number) => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ currentDay, setCurrentDay, completedDays, toggleDayCompletion }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const dayData = CHALLENGE_DATA[currentDay - 1];

  const goToDay = (day: number) => {
    if (day >= 1 && day <= CHALLENGE_DATA.length) {
      setCurrentDay(day);
      setIsPlaying(false);
      if (player) {
        player.stopVideo();
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };
  
  const onPlayerReady = (event: { target: any; }) => {
    setPlayer(event.target);
  };

  const handleStateChange = (event: { data: number; }) => {
    // Player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === 1) { // playing
        setIsPlaying(true);
    } else if (event.data === 2 || event.data === 0) { // paused or ended
        setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!player) return;
    const playerState = player.getPlayerState();
    if (playerState === 1) { // is playing
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const dayIndex = currentDay - 1;

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text overflow-x-hidden flex flex-col">
       <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-20 flex justify-between items-center w-full">
        <div className="flex-grow mr-4">
          <ProgressBar completedDays={completedDays} totalDays={CHALLENGE_DATA.length} />
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu" className="flex-shrink-0">
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
              {CHALLENGE_DATA.map(day => {
                // Lógica de bloqueio: 
                // O dia é bloqueado se não for o dia 1 E o dia anterior não estiver concluído.
                // completedDays é indexado em 0 (Dia 1 = index 0).
                const isLocked = day.day > 1 && !completedDays[day.day - 2];

                return (
                  <li key={day.day}>
                    <button 
                      onClick={() => !isLocked && goToDay(day.day)}
                      disabled={isLocked}
                      className={`w-full text-left py-2 px-2 rounded transition-colors 
                        ${currentDay === day.day ? 'bg-brand-green font-bold' : ''} 
                        ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-brand-green/50'}
                      `}
                    >
                      Dia {day.day}
                    </button>
                  </li>
                );
              })}
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

      <main className="pt-28 px-4 md:px-8 flex-grow">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg mx-auto max-w-sm bg-black group">
          <YouTube
            videoId={dayData.videoId}
            opts={{
              playerVars: {
                controls: 0,
                rel: 0,
                disablekb: 1,
                modestbranding: 1,
              },
            }}
            onReady={onPlayerReady}
            onStateChange={handleStateChange}
            className="absolute top-0 left-0 w-full h-full"
            iframeClassName="w-full h-full"
          />
          <div className="absolute inset-0 cursor-pointer" onClick={togglePlay}>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                className={`flex items-center justify-center bg-black/50 text-white rounded-full h-16 w-16 transform transition-all duration-200 ease-in-out ${isPlaying ? 'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100' : 'opacity-100 scale-100'}`}
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 text-center">
          <h1 className="font-serif text-3xl md:text-4xl">Dia {dayData.day}: {dayData.title}</h1>
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
          <button 
            onClick={() => goToDay(currentDay + 1)} 
            disabled={currentDay === CHALLENGE_DATA.length || !completedDays[dayIndex]} 
            className="disabled:opacity-30 transition-opacity" 
            aria-label="Próximo dia"
          >
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

      <div className="relative z-20 w-full bg-brand-text py-4 text-center">
        <p className="text-sm text-brand-bg font-sans">
          Precisa de ajuda?{' '}
          <a
            href="https://wa.me/5517981463355?text=Suporte%20Desafio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline hover:text-white transition-colors"
          >
            Clique aqui para falar com o suporte
          </a>
        </p>
      </div>
    </div>
  );
};

export default ChallengeScreen;
