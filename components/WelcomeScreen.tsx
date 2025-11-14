

import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";
import { PlayIcon, PauseIcon } from './icons';

interface WelcomeScreenProps {
  userName: string;
  onStart: () => void;
}

const WELCOME_VIDEO_ID = "L3r_TSwq1zc"; // Using Day 1 video as welcome video

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userName, onStart }) => {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // The video is unmuted programmatically to allow autoplay with sound.
  const onPlayerReady = (event: { target: any; }) => {
    setPlayer(event.target);
    event.target.unMute();
  };

  const handleStateChange = (event: { data: number; }) => {
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

  return (
    <div className="flex flex-col items-center justify-between min-h-screen relative bg-brand-bg text-brand-text text-center">
      <header className="absolute top-0 right-0 p-6 z-10">
        <button 
          onClick={handleLogout} 
          className="font-sans text-brand-text hover:underline focus:outline-none focus:ring-2 focus:ring-brand-text/50 rounded px-2 py-1"
          aria-label="Sair da conta"
        >
          Sair
        </button>
      </header>

      <div className="w-full max-w-md mt-16 px-8 flex-1 flex flex-col justify-center">
        <h1 className="font-serif text-5xl">Namaskar</h1>
        <p className="mt-6 text-lg leading-relaxed">
          Bem-vindo(a) ao desafio dos 7 dias para regular o sistema nervoso transformando estresse e ansiedade em força e presença!
        </p>

        <div className="relative w-72 h-72 rounded-full overflow-hidden shadow-lg mx-auto bg-black group mt-8">
          <YouTube
            videoId={WELCOME_VIDEO_ID}
            opts={{
              playerVars: {
                autoplay: 1,
                controls: 0,
                rel: 0,
                disablekb: 1,
                modestbranding: 1,
                loop: 1,
                playlist: WELCOME_VIDEO_ID, // Required for loop to work
              },
            }}
            onReady={onPlayerReady}
            onStateChange={handleStateChange}
            className="absolute top-1/2 left-1/2 w-[125%] h-[222%] -translate-x-1/2 -translate-y-1/2"
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
        
        <button
          onClick={onStart}
          className="mt-8 px-10 py-3 border border-brand-text rounded-full hover:bg-brand-text hover:text-white transition-colors duration-300 self-center"
        >
          COMEÇAR
        </button>
      </div>
      
      <div className="relative w-full h-24">
        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-brand-green to-transparent"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;