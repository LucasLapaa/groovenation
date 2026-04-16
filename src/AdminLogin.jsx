import { useState } from 'react';
import './AdminLogin.css';
import logoImg from './assets/groove.png';

function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'contato@groovenation.com.br' && password === 'Trovao123!') {
      setError('');
      onLogin();
    } else {
      setError('Acesso negado. E-mail ou senha incorretos.');
    }
  };

  return (
    <div className="login-container">
      {/* Botão de voltar para o site normal */}
      <button onClick={onBack} className="login-back-btn">
        ← Voltar para a loja
      </button>

      <div className="login-box">
        <img src={logoImg} alt="Groove Nation" className="login-logo" />
        <h2 className="login-title">Área Restrita</h2>
        <p className="login-subtitle">Acesso exclusivo para administradores.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="contato@groovenation.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">Entrar no Painel</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;