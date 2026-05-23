import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, Tag, Ticket, Settings, LogOut, Plus, Edit2, Trash2, X, AlertCircle, Eye, CheckCircle, XCircle, Truck, ArrowRight } from 'lucide-react';
import { collection, query, orderBy, doc, updateDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase'; 
import toast, { Toaster } from 'react-hot-toast'; // 👈 Importação do Toast
import './AdminDashboard.css';
import logoImg from './assets/groove.png';

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('pedidos');

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [inputsRastreio, setInputsRastreio] = useState({});

  const [coupons, setCoupons] = useState([]);
  const [settings, setSettings] = useState({
    adminEmail: 'contato@groovenation.com.br',
    storeName: 'Groove Nation',
    freeShippingThreshold: 250
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    const qOrders = query(collection(db, "pedidos"), orderBy("data", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const listaPedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(listaPedidos);
      setIsLoadingOrders(false);
    });

    const qProducts = query(collection(db, "produtos"), orderBy("dataCriacao", "desc"));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const listaProdutos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(listaProdutos);
      setIsLoadingProducts(false);
    });

    setCoupons(JSON.parse(localStorage.getItem('groove_coupons')) || [
      { id: 1, code: 'SECRETGROOVE', discount: 15, validUntil: '2026-12-31' }
    ]);
    const savedSettings = JSON.parse(localStorage.getItem('groove_settings'));
    if (savedSettings) setSettings(savedSettings);

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []); 

  useEffect(() => { if (coupons.length > 0) localStorage.setItem('groove_coupons', JSON.stringify(coupons)); }, [coupons]);

  // ==========================================
  // FUNÇÕES COM OS NOVOS TOASTS
  // ==========================================
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "pedidos", orderId);
      await updateDoc(orderRef, { status: newStatus });
      if(selectedOrder) setSelectedOrder({ ...selectedOrder, status: newStatus });
      toast.success(`Status atualizado para ${newStatus}!`); // 👈 Toast Bonito
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do pedido."); // 👈 Toast Bonito
    }
  };

  const handleSalvarRastreio = async (pedidoId) => {
    const codigo = inputsRastreio[pedidoId];
    if (!codigo) {
      toast.error("Digite um código de rastreio primeiro!"); // 👈 Toast Bonito
      return;
    }
    try {
      const pedidoRef = doc(db, 'pedidos', pedidoId);
      await updateDoc(pedidoRef, {
        codigoRastreio: codigo,
        status: 'ENVIADO 🚚'
      });
      toast.success("Rastreio salvo! Cliente notificado."); // 👈 Toast Bonito
      setInputsRastreio(prev => ({ ...prev, [pedidoId]: '' }));
      if (selectedOrder && selectedOrder.id === pedidoId) {
        setSelectedOrder({ ...selectedOrder, codigoRastreio: codigo, status: 'ENVIADO 🚚' });
      }
    } catch (error) {
      console.error("Erro ao salvar rastreio:", error);
      toast.error("Erro ao salvar o código de rastreio."); // 👈 Toast Bonito
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productId = editingProduct ? editingProduct.id : `GN-${Date.now()}`;
    const productData = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      category: formData.get('category'), 
      imgFront: formData.get('imgFront'),
      imgBack: formData.get('imgBack') || "",
      dataCriacao: editingProduct ? editingProduct.dataCriacao || new Date() : new Date()
    };
    
    try {
      await setDoc(doc(db, "produtos", productId), productData);
      setIsProductModalOpen(false);
      setEditingProduct(null);
      toast.success(editingProduct ? "Produto atualizado!" : "Produto criado com sucesso!"); // 👈 Toast Bonito
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Erro ao salvar produto na nuvem.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir este produto do servidor?')) {
      try {
        await deleteDoc(doc(db, "produtos", id));
        toast.success("Produto excluído!"); // 👈 Toast Bonito
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
        toast.error("Erro ao excluir produto.");
      }
    }
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCoupon = {
      id: editingCoupon ? editingCoupon.id : Date.now(),
      code: formData.get('code').toUpperCase(),
      discount: parseInt(formData.get('discount')),
      validUntil: formData.get('validUntil'),
    };
    if (editingCoupon) setCoupons(coupons.map(c => c.id === editingCoupon.id ? newCoupon : c));
    else setCoupons([...coupons, newCoupon]);
    setIsCouponModalOpen(false);
    setEditingCoupon(null);
    toast.success("Cupom salvo com sucesso!"); // 👈 Toast Bonito
  };

  const handleDeleteCoupon = (id) => {
    if(window.confirm('Tem certeza que deseja excluir este cupom?')) {
      const newCoupons = coupons.filter(c => c.id !== id);
      setCoupons(newCoupons);
      localStorage.setItem('groove_coupons', JSON.stringify(newCoupons));
      toast.success("Cupom excluído!"); // 👈 Toast Bonito
    }
  };

  const getCouponStatus = (dateString) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const validDate = new Date(dateString);
    validDate.setHours(0,0,0,0);
    return validDate >= today ? 'Ativo' : 'Expirado';
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSettings = {
      adminEmail: formData.get('adminEmail'),
      storeName: formData.get('storeName'),
      freeShippingThreshold: parseFloat(formData.get('freeShippingThreshold'))
    };
    setSettings(newSettings);
    localStorage.setItem('groove_settings', JSON.stringify(newSettings));
    toast.success('Configurações salvas e aplicadas na loja!'); // 👈 Toast Bonito
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return 'Pendente';
    if (typeof timestamp === 'string') return timestamp;
    const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    }).format(data);
  };

  const uniqueCustomers = Array.from(new Set(orders.map(o => o.email))).map(email => orders.find(o => o.email === email));
  const totalGanhos = orders.reduce((acc, order) => acc + (order.valorTotal || 0), 0);

  return (
    <div className="admin-container">
      {/* 👇 COMPONENTE DO TOASTER (Estilizado para a marca) 👇 */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#171717', // Fundo escuro (neutral-900)
            color: '#fff',         // Texto branco
            border: '1px solid #262626', // Borda sutil
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          },
          success: {
            iconTheme: {
              primary: '#a855f7', // Roxo do sucesso
              secondary: '#fff',
            },
          },
        }}
      />

      {/* SIDEBAR LATERAL */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logoImg} alt="Groove Nation" className="sidebar-logo" />
          <span className="admin-badge">Admin Panel</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-btn ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => setActiveTab('pedidos')}><ShoppingBag size={18} /> Pedidos</button>
          <button className={`nav-btn ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}><Users size={18} /> Clientes</button>
          <button className={`nav-btn ${activeTab === 'produtos' ? 'active' : ''}`} onClick={() => setActiveTab('produtos')}><Tag size={18} /> Produtos</button>
          <button className={`nav-btn ${activeTab === 'cupons' ? 'active' : ''}`} onClick={() => setActiveTab('cupons')}><Ticket size={18} /> Cupons</button>
          <button className={`nav-btn ${activeTab === 'configuracoes' ? 'active' : ''}`} onClick={() => setActiveTab('configuracoes')}><Settings size={18} /> Configurações</button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <span className="admin-name">Administrador</span>
            <span className="admin-email">{settings.adminEmail}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}><LogOut size={16} /> Sair do Sistema</button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">
        
        {/* ABA PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div className="tab-fade-in">
            <header className="dashboard-header">
              <h2>Gerenciamento de Vendas</h2>
              <div className="header-stats">
                <div className="stat-box"><span className="stat-label">Total Ganhos</span><span className="stat-value text-purple">R$ {totalGanhos.toFixed(2).replace('.', ',')}</span></div>
              </div>
            </header>
            <section className="table-section">
              <table className="data-table">
                <thead><tr><th>ID Pedido</th><th>Cliente</th><th>Data</th><th>Status</th><th>Valor</th><th>Ações</th></tr></thead>
                <tbody>
                  {isLoadingOrders ? (
                    <tr><td colSpan="6" className="empty-state">Sincronizando com banco de dados...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="6" className="empty-state"><AlertCircle className="mx-auto mb-2 opacity-50"/>Nenhum pedido realizado ainda.</td></tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id}>
                        <td className="fw-bold" style={{fontSize: '10px'}}>{o.pedidoId || o.id}</td>
                        <td className="text-white">{o.email || 'Cliente'}</td>
                        <td className="text-gray" style={{fontSize: '11px'}}>{formatarData(o.data)}</td>
                        <td><span className={`status-badge status-${(o.status || '').toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
                        <td className="text-green-400 font-bold">R$ {o.valorTotal ? o.valorTotal.toFixed(2).replace('.', ',') : '0,00'}</td>
                        <td>
                          <button 
                            onClick={() => { setSelectedOrder(o); setIsDetailsModalOpen(true); }}
                            className="icon-btn edit" title="Ver Detalhes do Pedido"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ABA CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="tab-fade-in">
            <header className="dashboard-header"><h2>Base de Clientes VIP</h2></header>
            <section className="table-section">
              <table className="data-table">
                <thead><tr><th>Nome/E-mail</th><th>Última Compra</th><th>Valor Gasto</th></tr></thead>
                <tbody>
                  {uniqueCustomers.length === 0 ? (<tr><td colSpan="3" className="empty-state">Sem clientes ainda.</td></tr>) : (
                    uniqueCustomers.map((c, i) => {
                      if (!c || !c.email) return null;
                      return (
                        <tr key={i}>
                          <td className="fw-bold text-white">{c.email}</td>
                          <td>{formatarData(c.data)}</td>
                          <td className="text-purple">R$ {c.valorTotal ? c.valorTotal.toFixed(2).replace('.', ',') : '0,00'}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ABA PRODUTOS */}
        {activeTab === 'produtos' && (
          <div className="tab-fade-in">
            <header className="dashboard-header">
              <h2>Estoque Global (Nuvem)</h2>
              <button className="action-btn flex items-center gap-2" onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}><Plus size={18} /> Novo Produto</button>
            </header>
            <section className="table-section">
              <table className="data-table">
                <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>
                  {isLoadingProducts ? (
                    <tr><td colSpan="6" className="empty-state">Carregando catálogo da nuvem...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="6" className="empty-state">Sem produtos na nuvem. Cadastre seu primeiro Drop!</td></tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id}>
                        <td className="fw-bold text-white">{p.name}</td>
                        <td className="text-purple uppercase text-[10px] tracking-widest font-bold">
                          {p.category === 'oversized' ? 'Oversized' : p.category === 'cropped' ? 'Cropped' : 'Últimos Drops'}
                        </td>
                        <td>R$ {p.price.toFixed(2)}</td>
                        <td className={p.stock < 10 ? 'text-red font-bold' : ''}>{p.stock} un.</td>
                        <td><span className={`status-badge status-${p.stock > 0 ? 'entregue' : 'esgotado'}`}>{p.stock > 0 ? 'Em Estoque' : 'Esgotado'}</span></td>
                        <td>
                          <div className="action-icons">
                            <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="icon-btn edit"><Edit2 size={16}/></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="icon-btn delete"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ABA CUPONS */}
        {activeTab === 'cupons' && (
          <div className="tab-fade-in">
            <header className="dashboard-header">
              <h2>Gerenciamento de Cupons</h2>
              <button className="action-btn flex items-center gap-2" onClick={() => { setEditingCoupon(null); setIsCouponModalOpen(true); }}><Plus size={18} /> Novo Cupom</button>
            </header>
            <section className="table-section">
              <table className="data-table">
                <thead><tr><th>Código</th><th>Desconto (%)</th><th>Validade</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>
                  {coupons.length === 0 ? (<tr><td colSpan="5" className="empty-state">Nenhum cupom ativo.</td></tr>) : (
                    coupons.map((c) => {
                      const status = getCouponStatus(c.validUntil);
                      return (
                        <tr key={c.id}>
                          <td className="fw-bold text-purple text-lg tracking-widest">{c.code}</td><td className="text-white font-bold">{c.discount}% OFF</td><td className="text-gray">{new Date(c.validUntil).toLocaleDateString('pt-BR')}</td>
                          <td><span className={`status-badge status-${status === 'Ativo' ? 'entregue' : 'esgotado'}`}>{status}</span></td>
                          <td><div className="action-icons"><button onClick={() => { setEditingCoupon(c); setIsCouponModalOpen(true); }} className="icon-btn edit"><Edit2 size={16}/></button><button onClick={() => handleDeleteCoupon(c.id)} className="icon-btn delete"><Trash2 size={16}/></button></div></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ABA CONFIGURAÇÕES */}
        {activeTab === 'configuracoes' && (
          <div className="tab-fade-in">
            <header className="dashboard-header"><h2>Configurações do Sistema</h2></header>
            <section className="table-section settings-section">
              <form onSubmit={handleSaveSettings} className="settings-form">
                <div className="settings-grid">
                  <div className="input-group">
                    <label>E-mail do Administrador</label>
                    <input name="adminEmail" type="email" defaultValue={settings.adminEmail} required />
                  </div>
                  <div className="input-group">
                    <label>Nova Senha</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="input-group">
                    <label>Nome da Loja</label>
                    <input name="storeName" type="text" defaultValue={settings.storeName} required />
                  </div>
                  <div className="input-group">
                    <label>Valor para Frete Grátis (R$)</label>
                    <input name="freeShippingThreshold" type="number" step="0.01" defaultValue={settings.freeShippingThreshold} required />
                  </div>
                </div>
                <div className="settings-footer"><button type="submit" className="action-btn">Salvar Configurações</button></div>
              </form>
            </section>
          </div>
        )}

      </main>

      {/* MODAL DE DETALHES DO PEDIDO */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '600px' }}>
            <button className="close-modal" onClick={() => setIsDetailsModalOpen(false)}><X /></button>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #262626', paddingBottom: '15px'}}>
              <h3 className="modal-title" style={{margin: 0}}>Pedido {selectedOrder.pedidoId || selectedOrder.id}</h3>
              <span className={`status-badge status-${(selectedOrder.status || '').toLowerCase().replace(' ', '-')}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="settings-grid" style={{marginTop: '0'}}>
              <div className="input-group" style={{backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #262626'}}>
                <label style={{color: '#9333ea', fontSize: '10px'}}>DADOS DO CLIENTE</label>
                <p className="text-white font-bold text-sm mt-1">{selectedOrder.email || 'Não informado'}</p>
                {selectedOrder.cpf && <p className="text-gray-400 text-xs mt-1">CPF: {selectedOrder.cpf}</p>}
                {selectedOrder.telefone && <p className="text-gray-400 text-xs mt-1">WhatsApp: {selectedOrder.telefone}</p>}
              </div>

              <div className="input-group" style={{backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #262626'}}>
                <label style={{color: '#9333ea', fontSize: '10px'}}>PRODUTOS</label>
                <p className="text-gray-200 text-xs italic mt-1">{selectedOrder.itens}</p>
                <p className="text-white font-bold text-sm mt-2">Total: R$ {selectedOrder.valorTotal?.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>

            <div className="input-group" style={{backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #262626', marginTop: '15px'}}>
              <label style={{color: '#9333ea', fontSize: '10px'}}>ENDEREÇO DE ENTREGA</label>
              <p className="text-gray-300 text-xs leading-relaxed mt-1">
                {selectedOrder.endereco || "Endereço não informado."}
              </p>
            </div>

            <div style={{marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #262626'}}>
              <p style={{color: '#737373', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px'}}>Atualizar Status Manualmente:</p>
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'APROVADO')}
                  style={{flex: 1, backgroundColor: '#16a34a', color: 'white', padding: '12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: 'none'}}
                >
                  <CheckCircle size={14}/> Aprovar
                </button>
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'RECUSADO')}
                  style={{flex: 1, backgroundColor: '#dc2626', color: 'white', padding: '12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: 'none'}}
                >
                  <XCircle size={14}/> Recusar
                </button>
              </div>
            </div>

            <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #262626'}}>
              <p style={{color: '#737373', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px'}}>Código de Rastreio (Correios):</p>
              <div style={{backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #262626', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {selectedOrder.codigoRastreio ? (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{color: '#22c55e', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Truck size={16} /> Enviado: {selectedOrder.codigoRastreio}
                    </span>
                  </div>
                ) : (
                  <div style={{display: 'flex', gap: '10px', width: '100%'}}>
                    <input 
                      type="text" 
                      placeholder="EX: BR123456789BR" 
                      value={inputsRastreio[selectedOrder.id] || ''}
                      onChange={(e) => setInputsRastreio({ ...inputsRastreio, [selectedOrder.id]: e.target.value.toUpperCase() })}
                      style={{flex: 1, backgroundColor: 'black', border: '1px solid #333', borderRadius: '6px', padding: '10px', color: 'white', fontSize: '12px', outline: 'none', textTransform: 'uppercase'}}
                    />
                    <button 
                      onClick={() => handleSalvarRastreio(selectedOrder.id)}
                      style={{backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '6px', padding: '0 15px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}
                    >
                      Salvar <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE CADASTRAR/EDITAR PRODUTO */}
      {isProductModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <button className="close-modal" onClick={() => setIsProductModalOpen(false)}><X /></button>
            <h3 className="modal-title">{editingProduct ? 'Editar Produto na Nuvem' : 'Novo Produto'}</h3>
            
            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="input-group">
                <label>Nome da Peça</label>
                <input name="name" type="text" defaultValue={editingProduct?.name} placeholder="Ex: T-Shirt Oversized Black" required />
              </div>
              
              <div className="input-group" style={{marginTop: '15px'}}>
                <label>Onde este produto vai aparecer?</label>
                <select name="category" defaultValue={editingProduct?.category || 'drops'} required style={{width: '100%', padding: '12px', backgroundColor: '#0a0a0a', border: '1px solid #262626', color: 'white', borderRadius: '6px', outline: 'none'}}>
                  <option value="drops">Vitrine Inicial (Últimos Drops)</option>
                  <option value="oversized">Página Oversized</option>
                  <option value="cropped">Página Cropped</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', width: '100%' }}>
                <div className="input-group" style={{ flex: 1, minWidth: 0 }}>
                  <label>Preço (R$)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div className="input-group" style={{ flex: 1, minWidth: 0 }}>
                  <label>Estoque Inicial</label>
                  <input name="stock" type="number" defaultValue={editingProduct?.stock || 0} required style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div className="input-group" style={{marginTop: '20px'}}>
                <label>Foto Frente (ex: /produtos/1.png)</label>
                <input name="imgFront" type="text" defaultValue={editingProduct?.imgFront} placeholder="/produtos/nome-da-foto.png" required />
              </div>

              <div className="input-group" style={{marginTop: '10px'}}>
                <label>Foto Verso (ex: /produtos/2.png)</label>
                <input name="imgBack" type="text" defaultValue={editingProduct?.imgBack} placeholder="/produtos/nome-da-foto-verso.png" />
              </div>

              <button type="submit" className="action-btn w-full mt-6">
                {editingProduct ? 'Salvar Alterações no Banco' : 'Criar Produto na Nuvem'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRAR/EDITAR CUPOM */}
      {isCouponModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal border-purple">
            <button className="close-modal" onClick={() => setIsCouponModalOpen(false)}><X /></button>
            <h3 className="modal-title flex items-center gap-2"><Ticket className="text-purple"/> {editingCoupon ? 'Editar Cupom' : 'Criar Cupom Cósmico'}</h3>
            <form onSubmit={handleSaveCoupon} className="modal-form">
              <div className="input-group"><label>Código do Cupom (Letras e Números)</label><input name="code" type="text" defaultValue={editingCoupon?.code} placeholder="Ex: DROPINVERNO" style={{textTransform: 'uppercase'}} required /></div>
              <div className="settings-grid" style={{marginTop: '20px', marginBottom: '10px'}}>
                <div className="input-group"><label>Desconto (%)</label><input name="discount" type="number" min="1" max="100" defaultValue={editingCoupon?.discount} placeholder="15" required /></div>
                <div className="input-group"><label>Válido Até</label><input name="validUntil" type="date" defaultValue={editingCoupon?.validUntil} required /></div>
              </div>
              <button type="submit" className="action-btn w-full mt-4 bg-purple-gradient">{editingCoupon ? 'Atualizar Cupom' : 'Gerar Cupom'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;