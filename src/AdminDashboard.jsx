import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, Tag, Ticket, Settings, LogOut, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase'; // Certifique-se de que o caminho aponta para o seu firebase.js
import './AdminDashboard.css';
import logoImg from './assets/groove.png';

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('pedidos');

  // Estado para armazenar os pedidos REAIS do banco de dados
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const [products, setProducts] = useState([]);
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

  // 1. useEffect PARA BUSCAR OS PEDIDOS DO FIREBASE
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "pedidos"), orderBy("data", "desc"));
        const querySnapshot = await getDocs(q);
        
        const listaPedidos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setOrders(listaPedidos);
      } catch (error) {
        console.error("Erro ao buscar os pedidos do Firebase:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []); // Executa apenas uma vez ao abrir o painel

  // 2. useEffect PARA OS OUTROS DADOS LOCAIS (Produtos, Cupons, Configs)
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('groove_products')) || [
      { id: 'GN-P01', name: "Camiseta Oversized V1", price: 139.90, stock: 150 },
      { id: 'GN-P02', name: "Moletom Dark Essentials", price: 289.90, stock: 45 },
    ]);

    setCoupons(JSON.parse(localStorage.getItem('groove_coupons')) || [
      { id: 1, code: 'SECRETGROOVE', discount: 15, validUntil: '2026-12-31' }
    ]);

    const savedSettings = JSON.parse(localStorage.getItem('groove_settings'));
    if (savedSettings) setSettings(savedSettings);
  }, []);

  useEffect(() => { if (products.length > 0) localStorage.setItem('groove_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { if (coupons.length > 0) localStorage.setItem('groove_coupons', JSON.stringify(coupons)); }, [coupons]);

  // Função para formatar a data do Firebase (Timestamp)
  const formatarData = (timestamp) => {
    if (!timestamp) return 'Pendente';
    // Se a data já for uma string (caso haja lixo no banco antigo), retorna ela mesma
    if (typeof timestamp === 'string') return timestamp;
    
    // Se for do Firebase
    const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    }).format(data);
  };

  // Gerar a lista de clientes únicos baseada nos e-mails dos pedidos reais
  const uniqueCustomers = Array.from(new Set(orders.map(o => o.email))).map(email => orders.find(o => o.email === email));

  // Funções de Gerenciamento do Admin (Mantidas Exatamente Iguais)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProduct = {
      id: editingProduct ? editingProduct.id : `GN-P0${products.length + 1}`,
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
    };
    if (editingProduct) setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    else setProducts([...products, newProduct]);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if(window.confirm('Tem certeza que deseja excluir este produto?')) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      localStorage.setItem('groove_products', JSON.stringify(newProducts));
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
  };

  const handleDeleteCoupon = (id) => {
    if(window.confirm('Tem certeza que deseja excluir este cupom?')) {
      const newCoupons = coupons.filter(c => c.id !== id);
      setCoupons(newCoupons);
      localStorage.setItem('groove_coupons', JSON.stringify(newCoupons));
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
    alert('✅ Configurações salvas e aplicadas na loja!');
  };

  // Calcula o total ganho somando a propriedade valorTotal dos pedidos reais
  const totalGanhos = orders.reduce((acc, order) => acc + (order.valorTotal || 0), 0);

  return (
    <div className="admin-container">
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

      <main className="main-content">
        
        {activeTab === 'pedidos' && (
          <div className="tab-fade-in">
            <header className="dashboard-header">
              <h2>Visão Geral de Pedidos</h2>
              <div className="header-stats">
                <div className="stat-box"><span className="stat-label">Total Ganhos</span><span className="stat-value text-purple">R$ {totalGanhos.toFixed(2).replace('.', ',')}</span></div>
                <div className="stat-box"><span className="stat-label">Pedidos Pagos</span><span className="stat-value highlight">{orders.filter(o => o.status === 'PAGO').length}</span></div>
              </div>
            </header>
            <section className="table-section">
              <table className="data-table">
                <thead><tr><th>ID Pedido</th><th>E-mail do Cliente</th><th>Itens Comprados</th><th>Data</th><th>Status</th><th>Valor</th></tr></thead>
                <tbody>
                  {isLoadingOrders ? (
                    <tr><td colSpan="6" className="empty-state">Carregando pedidos em tempo real...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="6" className="empty-state"><AlertCircle className="mx-auto mb-2 opacity-50"/>Nenhum pedido realizado ainda.</td></tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id}>
                        <td className="fw-bold" style={{fontSize: '10px'}}>{o.pedidoId}</td>
                        <td className="text-white">{o.email}</td>
                        <td className="truncate-cell text-gray">{o.itens}</td>
                        <td>{formatarData(o.data)}</td>
                        <td><span className={`status-badge status-${(o.status || '').toLowerCase()}`}>{o.status}</span></td>
                        <td className="text-green-400 font-bold">R$ {o.valorTotal ? o.valorTotal.toFixed(2).replace('.', ',') : '0,00'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeTab === 'clientes' && (
          <div className="tab-fade-in">
            <header className="dashboard-header"><h2>Base de Clientes VIP</h2></header>
            <section className="table-section">
              <table className="data-table">
                <thead><tr><th>E-mail</th><th>Última Compra</th><th>Valor Gasto</th></tr></thead>
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

        {/* ... (O RESTANTE DAS SUAS ABAS DE PRODUTOS, CUPONS E CONFIGURAÇÕES PERMANECEM EXATAMENTE IGUAIS) ... */}
        {activeTab === 'produtos' && (
          <div className="tab-fade-in">
            <header className="dashboard-header">
              <h2>Catálogo e Estoque</h2>
              <button className="action-btn flex items-center gap-2" onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}><Plus size={18} /> Novo Produto</button>
            </header>
            <section className="table-section">
              <table className="data-table">
                <thead><tr><th>ID</th><th>Produto</th><th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>
                  {products.length === 0 ? (<tr><td colSpan="6" className="empty-state">Sem produtos.</td></tr>) : (
                    products.map((p) => (
                      <tr key={p.id}>
                        <td className="text-gray">{p.id}</td><td className="fw-bold text-white">{p.name}</td><td>R$ {p.price.toFixed(2)}</td><td className={p.stock < 10 ? 'text-red font-bold' : ''}>{p.stock} un.</td>
                        <td><span className={`status-badge status-${p.stock > 0 ? 'entregue' : 'esgotado'}`}>{p.stock > 0 ? 'Em Estoque' : 'Esgotado'}</span></td>
                        <td><div className="action-icons"><button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="icon-btn edit"><Edit2 size={16}/></button><button onClick={() => handleDeleteProduct(p.id)} className="icon-btn delete"><Trash2 size={16}/></button></div></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}

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

      {/* Modais */}
      {isProductModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <button className="close-modal" onClick={() => setIsProductModalOpen(false)}><X /></button>
            <h3 className="modal-title">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="input-group"><label>Nome da Peça</label><input name="name" type="text" defaultValue={editingProduct?.name} required /></div>
              <div className="settings-grid" style={{marginTop: '20px', marginBottom: '10px'}}>
                <div className="input-group"><label>Preço (R$)</label><input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required /></div>
                <div className="input-group"><label>Estoque Inicial</label><input name="stock" type="number" defaultValue={editingProduct?.stock || 0} required /></div>
              </div>
              <button type="submit" className="action-btn w-full mt-4">{editingProduct ? 'Salvar Alterações' : 'Criar Produto'}</button>
            </form>
          </div>
        </div>
      )}

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