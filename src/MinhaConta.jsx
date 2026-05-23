import React, { useState, useEffect } from 'react';
import { auth, db } from "./firebase"; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Lock, Mail, ArrowRight, Loader2, Package, LogOut, Calendar } from 'lucide-react';

// 1. SUB-COMPONENTE: LOGIN / CADASTRO
const UserAuth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lógica de Login/Cadastro com E-mail e Senha
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) return;
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        // 1. Cria o usuário no Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // 2. Salva no banco de dados (Firestore)
        await setDoc(doc(db, 'clientes', user.uid), {
          uid: user.uid,
          email: email.toLowerCase(),
          dataCadastro: new Date().toISOString(),
          status: 'ativo'
        });
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter no mínimo 6 caracteres.');
      } else {
        setError('Erro ao autenticar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Login Exclusiva do Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Salva ou atualiza no banco com merge: true (para não apagar dados se ele já for cliente antigo)
      await setDoc(doc(db, 'clientes', user.uid), {
        uid: user.uid,
        email: user.email,
        nome: user.displayName || '',
        foto: user.photoURL || '',
        dataUltimoAcesso: new Date().toISOString()
      }, { merge: true });

    } catch (err) {
      console.error(err);
      setError('Erro ao fazer login com o Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-neutral-950 border border-neutral-800 p-8 rounded-lg shadow-2xl mt-12">
      <h3 className="text-xl font-black text-white italic tracking-widest uppercase text-center mb-6">
        {isRegister ? 'Criar Conta' : 'Área do Cliente'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-neutral-600" size={18} />
          <input type="email" placeholder="SEU E-MAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded pl-10 pr-4 py-3 text-sm text-white font-bold focus:border-purple-500 outline-none uppercase transition-colors" />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-neutral-600" size={18} />
          <input type="password" placeholder="SUA SENHA" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded pl-10 pr-4 py-3 text-sm text-white font-bold focus:border-purple-500 outline-none uppercase transition-colors" />
        </div>
        
        {error && <p className="text-red-500 text-[10px] font-black tracking-widest uppercase text-center">{error}</p>}
        
        <button type="submit" disabled={loading} className="w-full bg-white hover:bg-purple-600 text-black hover:text-white transition-all font-black py-4 rounded tracking-widest uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={18} /> : (isRegister ? 'CADASTRAR' : 'ENTRAR')} <ArrowRight size={16} />
        </button>
      </form>

      {/* DIVISOR */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-neutral-800"></div>
        <span className="text-neutral-500 text-[10px] font-black tracking-widest uppercase">OU</span>
        <div className="flex-1 h-px bg-neutral-800"></div>
      </div>

      {/* BOTÃO GOOGLE */}
      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
        className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-white transition-all font-bold py-3 rounded text-sm flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
        Entrar com Google
      </button>

      <div className="mt-6 text-center">
        <button onClick={() => setIsRegister(!isRegister)} className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
          {isRegister ? 'Já tenho conta. Fazer Login' : 'Não tem conta? Cadastre-se'}
        </button>
      </div>
    </div>
  );
};

// 2. SUB-COMPONENTE: DASHBOARD DE PEDIDOS
const CustomerDashboard = ({ user }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const q = query(collection(db, 'pedidos'), where('telefone', '!=', '')); 
        const querySnapshot = await getDocs(q);
        const lista = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.emailCliente === user.email || data.endereco?.includes(user.email)) {
            lista.push({ id: doc.id, ...data });
          }
        });
        lista.sort((a, b) => b.data?.seconds - a.data?.seconds);
        setPedidos(lista);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-neutral-950 border border-neutral-800 p-6 rounded-lg text-white mt-6">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-6 mb-8">
        <div>
          <p className="text-neutral-500 text-[10px] font-black tracking-widest uppercase">CONECTADO COMO</p>
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">{user.email}</h2>
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-neutral-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors border border-neutral-800 px-4 py-2 rounded">
          <LogOut size={14} /> Sair
        </button>
      </div>

      <h3 className="text-lg font-black text-white italic tracking-widest uppercase mb-6 flex items-center gap-2">
        <Package size={18} className="text-purple-500" /> Meus Pedidos
      </h3>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-purple-500" size={24} /></div>
      ) : pedidos.length === 0 ? (
        <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest text-center py-6">Nenhum pedido encontrado para este e-mail.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-black border border-neutral-800 rounded p-4 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-purple-500">{p.pedidoId || p.id}</span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">{p.status}</span>
                </div>
                <p className="text-gray-400 text-xs mb-3">{p.itens}</p>
                
                {/* 👇 BLOCO DO RASTREIO ADICIONADO AQUI 👇 */}
                {p.codigoRastreio && (
                  <div className="mt-2 pt-3 border-t border-neutral-900 inline-block">
                    <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest block mb-1 flex items-center gap-1">
                      <Truck size={12} /> Código de Rastreio:
                    </span>
                    <a 
                      href={`https://rastreamento.correios.com.br/app/index.php`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#009EE3] hover:text-white text-xs font-black tracking-widest transition-colors"
                    >
                      {p.codigoRastreio}
                    </a>
                  </div>
                )}
                {/* 👆 FIM DO BLOCO DO RASTREIO 👆 */}

              </div>
              <div className="text-right shrink-0">
                <p className="text-white font-black text-md">R$ {p.valorTotal?.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// COMPONENTE PRINCIPAL EXPORTADO
export default function MinhaConta() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
  }, []);

  if (checking) return <div className="text-center py-20 text-neutral-500 text-xs font-bold uppercase tracking-widest animate-pulse">Carregando...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      {user ? <CustomerDashboard user={user} /> : <UserAuth />}
    </div>
  );
}