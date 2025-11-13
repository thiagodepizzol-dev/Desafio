import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'O formato do e-mail é inválido.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
             return 'E-mail ou senha incorretos.';
        default:
            return 'Ocorreu um erro. Tente novamente.';
    }
};

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
        setError('Por favor, preencha e-mail e senha.');
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 bg-brand-bg text-brand-text text-center">
      <div className="w-full max-w-sm pt-8">
        <h1 className="font-serif text-4xl font-medium">Desafio dos 7 dias</h1>
        <p className="mt-2 text-lg">
          para regular o sistema nervoso<br />
          <span className="font-bold">com Thiago De Pizzol</span>
        </p>
        <div className="w-24 h-px bg-brand-text mx-auto my-6"></div>
        <p className="font-serif text-3xl mb-8">Por favor, coloque suas credenciais de acesso:</p>
      </div>
      
      <div className="w-full max-w-sm flex flex-col items-center">
        <form onSubmit={handleAuthAction} className="w-full flex flex-col items-center space-y-4">
          <input
            type="email"
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-3 bg-white rounded-full text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-text/50"
            required
            aria-label="Endereço de e-mail"
          />
          <input
            type="password"
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-3 bg-white rounded-full text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-text/50"
            required
            aria-label="Senha"
          />
          {error && <p className="text-red-500 text-sm mt-2 px-4">{error}</p>}
          <button
            type="submit"
            className="px-10 py-3 mt-4 border border-brand-text rounded-full hover:bg-brand-text hover:text-white transition-colors duration-300"
          >
            ACESSAR
          </button>
        </form>
      </div>
      
      <div className="relative w-full flex justify-center items-end mt-4 pb-12 flex-1">
         <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-green to-transparent"></div>
         <img 
            src="https://i.ibb.co/p6v4B1fr/com-Thiago-De-Pizzol.png" 
            alt="Pessoa em pose de ioga" 
            className="w-64 h-auto opacity-80 relative"
          />
      </div>
    </div>
  );
};

export default LoginScreen;