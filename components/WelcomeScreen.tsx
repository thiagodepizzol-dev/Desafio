
import React from 'react';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

interface WelcomeScreenProps {
  userName: string;
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userName, onStart }) => {
  const handleLogout = async () => {
    await signOut(auth);
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

      <div className="w-full max-w-md mt-16 px-8">
        <h1 className="font-serif text-5xl">Namaskar, Reinventese</h1>
        <p className="mt-6 text-lg leading-relaxed">
          Bem-vindo ao desafio dos 7 dias de Yoga comigo! Você está prestes a começar um processo transformacional de autoconhecimento e disciplina para fortalecer o corpo, a mente e ganhar autodomínio através da regulação do sistema nervoso.
        </p>
        <button
          onClick={onStart}
          className="mt-8 px-10 py-3 border border-brand-text rounded-full hover:bg-brand-text hover:text-white transition-colors duration-300"
        >
          COMEÇAR
        </button>
      </div>
      
      <div className="relative w-full flex justify-center items-end mt-8">
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-green to-transparent"></div>
        <img 
            src="https://i.ibb.co/fV9RKm89/com-Thiago-De-Pizzol-1.png" 
            alt="Pessoa em pose de ioga" 
            className="w-full h-auto opacity-80 relative"
          />
      </div>
    </div>
  );
};

export default WelcomeScreen;