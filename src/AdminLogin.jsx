import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import logoImg from './assets/groove.png'; // Confirme se o caminho da logo está certo

const AdminLogin = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // A SENHA FICA AQUI 👇
    if (password === 'groove2026vencemos') {
      setError('');
      onLogin(); // Avisa o sistema que a senha está certa e libera o acesso
    } else {
      setError('Senha incorreta. Acesso negado.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Efeito de luz de fundo */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-20"></div>
        
        <div className="text-center mb-8 relative z-10">
          <img src={logoImg} alt="Groove Nation" className="h-12 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-white uppercase tracking-widest italic">Área Restrita</h1>
          <p className="text-gray-400 text-sm mt-2">Acesso exclusivo para administradores</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-white rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Digite a senha mestra..."
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1 uppercase tracking-widest">
                <ShieldAlert size={14} /> {error}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-lg uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
          >
            Acessar Painel <ArrowRight size={18} />
          </button>
        </form>

      <div className="mt-8 text-center relative z-10">
          <button 
            type="button"
            onClick={onBack} 
            className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            ← Voltar para a loja
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;