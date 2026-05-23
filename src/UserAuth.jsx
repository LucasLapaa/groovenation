import React, { useState } from 'react';
import { auth } from './firebaseConfig'; // Ajuste o caminho conforme seu projeto
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const UserAuth = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) return;
    
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, senha);
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-neutral-950 border border-neutral-800 p-8 rounded-lg shadow-2xl">
      <h3 className="text-xl font-black text-white italic tracking-widest uppercase text-center mb-6">
        {isRegister ? 'Criar Conta' : 'Área do Cliente'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-neutral-600" size={18} />
          <input
            type="email"
            placeholder="SEU E-MAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded pl-10 pr-4 py-3 text-sm text-white font-bold placeholder-neutral-600 focus:border-purple-500 outline-none uppercase transition-colors"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-neutral-600" size={18} />
          <input
            type="password"
            placeholder="SUA SENHA"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded pl-10 pr-4 py-3 text-sm text-white font-bold placeholder-neutral-600 focus:border-purple-500 outline-none uppercase transition-colors"
          />
        </div>

        {error && (
          <p className="text-red-500 text-[10px] font-black tracking-widest uppercase text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white hover:bg-purple-600 text-black hover:text-white transition-all font-black py-4 rounded tracking-widest uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : (isRegister ? 'CADASTRAR' : 'ENTRAR')} <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          {isRegister ? 'Já tenho conta. Fazer Login' : 'Não tem conta? Cadastre-se'}
        </button>
      </div>
    </div>
  );
};

export default UserAuth;