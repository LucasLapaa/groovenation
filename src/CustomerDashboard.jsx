import React, { useEffect, useState } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Package, LogOut, Loader2, Calendar } from 'lucide-react';

const CustomerDashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user) return;
      try {
        // Busca na coleção "pedidos" onde o email bate com o usuário logado
        const q = query(
          collection(db, 'pedidos'),
          where('emailCliente', '==', user.email)
        );
        
        const querySnapshot = await getDocs(q);
        const listaPedidos = [];
        querySnapshot.forEach((doc) => {
          listaPedidos.push({ id: doc.id, ...doc.data() });
        });

        // Ordena por data mais recente de forma manual ou via query se tiver índice
        listaPedidos.sort((a, b) => b.data?.seconds - a.data?.seconds);

        setPedidos(listaPedidos);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user]);

  const handleLogout = () => {
    signOut(auth);
  };

  const getStatusStyle = (status) => {
    if (status?.includes('APROVADO')) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (status?.includes('RECUSADO') || status?.includes('CANCELADO')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black text-white">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-6 mb-8">
        <div>
          <p className="text-neutral-500 text-[10px] font-black tracking-widest uppercase">LOGADO COMO</p>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">{user?.email}</h2>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-neutral-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors border border-neutral-800 px-4 py-2 rounded">
          <LogOut size={14} /> Sair
        </button>
      </div>

      <h3 className="text-xl font-black text-white italic tracking-widest uppercase mb-6 flex items-center gap-2">
        <Package size={20} className="text-purple-500" /> Meus Pedidos
      </h3>

      {pedidos.length === 0 ? (
        <div className="bg-neutral-950 border border-neutral-800 p-12 rounded-lg text-center opacity-60">
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">Você ainda não realizou nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4 transition-all hover:border-neutral-700">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black tracking-wider text-purple-500">{pedido.pedidoId || pedido.id}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-full ${getStatusStyle(pedido.status)}`}>
                    {pedido.status}
                  </span>
                </div>
                <p className="text-gray-300 text-xs font-medium"><span className="text-neutral-500 uppercase font-bold text-[10px] tracking-wider">Itens:</span> {pedido.itens}</p>
                {pedido.endereco && (
                  <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wide">📦 Envio: {pedido.endereco.split('|')[0]}</p>
                )}
              </div>

              <div className="flex md:flex-col justify-between items-end shrink-0 border-t md:border-t-0 border-neutral-900 pt-3 md:pt-0">
                <div className="flex items-center gap-1 text-neutral-500 text-[10px] font-bold tracking-widest uppercase">
                  <Calendar size={12} />
                  {pedido.data ? new Date(pedido.data.seconds * 1000).toLocaleDateString('pt-BR') : 'Recente'}
                </div>
                <span className="text-lg font-black text-white">
                  R$ {pedido.valorTotal?.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;