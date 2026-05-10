import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Menu, X, MessageCircle, Instagram, Facebook, Clock, ArrowUp, ShieldCheck, RefreshCw, Layers, Printer, Mail, CheckCircle, Loader2, Zap, Lock, ChevronDown, Terminal, Ruler, Ticket, Barcode, Cookie, CreditCard, Truck, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Gift } from 'lucide-react';

// --- IMPORTAÇÕES DO STRIPE E FIREBASE ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

// --- IMPORTANDO COMPONENTES EXTERNOS ---
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import logoGroove from './assets/groove.png';
import MaintenanceView from './MaintenanceView';

// ==========================================
// CONFIGURAÇÕES DE PAGAMENTO (COLOQUE SUAS CHAVES AQUI)
// ==========================================
const stripePromise = loadStripe('pk_test_51TVeqq5YSi9SEmZUXV55DdlfX5DTsdTHdoNeWa4aipfzo7rNHJvhgSSX0wb2BckPZNsqlCPOfcBRioWVRBpq7rHr001OGwaFIJ');

const firebaseConfig = {
  apiKey: "AIzaSyDh1wky8GaSK1Z13DT1kWHefAB7csf0orM",
  authDomain: "groovenation-448d9.firebaseapp.com",
  projectId: "groovenation-448d9",
  storageBucket: "groovenation-448d9.firebasestorage.app",
  messagingSenderId: "484839992777",
  appId: "1:484839992777:web:381f55649bbfc05a8f4c18"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// ==========================================
// BANCO DE PRODUTOS PADRÃO (Para vitrine)
// ==========================================
const defaultProducts = [
  { id: 'GN-P01', name: "T-Shirt Oversized Iron", price: 139.90, stock: 150, img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop", tag: "NEW DROP" }, 
  { id: 'GN-P02', name: "Moletom Heavyweight", price: 289.90, stock: 45, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop", tag: "BEST SELLER" }, 
  { id: 'GN-P03', name: "Bermuda Tech Sweat", price: 119.90, stock: 20, img: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb1?q=80&w=1969&auto=format&fit=crop", tag: "" },
  { id: 'GN-P04', name: "Regata Ribana Old School", price: 89.90, stock: 0, img: "https://images.unsplash.com/photo-1507314961636-a128cc160537?q=80&w=1974&auto=format&fit=crop", tag: "SOLD OUT" },
];

// ==========================================
// COMPONENTE: FORMULÁRIO DO STRIPE (INTERNO)
// ==========================================
const CheckoutForm = ({ total, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}`, 
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 h-full">
      <div className="bg-white p-4 rounded-xl shadow-inner">
        <PaymentElement />
      </div>
      
      {errorMessage && <div className="text-red-500 text-xs font-bold text-center bg-red-500/10 p-2 rounded">{errorMessage}</div>}
      
      <div className="mt-auto flex flex-col gap-2 pt-4">
        <button disabled={isProcessing || !stripe || !elements} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded tracking-widest uppercase text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50">
          {isProcessing ? <Loader2 className="animate-spin" size={20} /> : `PAGAR R$ ${total.toFixed(2).replace('.', ',')}`}
          {!isProcessing && <Lock size={16} />}
        </button>
        <button type="button" onClick={onBack} disabled={isProcessing} className="w-full bg-transparent border border-neutral-700 text-gray-400 hover:text-white py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors">
          Voltar ao Carrinho
        </button>
      </div>
    </form>
  );
};

// ==========================================
// COMPONENTES MODAIS E GLOBAIS
// ==========================================
const PrivacyView = () => {
  return (
    <div className="pt-40 pb-20 min-h-screen bg-neutral-950 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">POLÍTICA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">PRIVACIDADE</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16">Transparência total. Aqui explicamos como cuidamos dos seus dados enquanto você cuida do seu estilo.</p>
      </div>
      <div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Coleta e Segurança</h3>
        <p className="text-gray-400">Levamos a segurança a sério. Nosso site utiliza criptografia SSL para proteger todas as transações. Seus dados trafegam em ambiente seguro e monitorado 24/7.</p>
      </div>
    </div>
  );
};

const TopAnnouncementBar = ({ show }) => {
  return (
    <div className={`fixed top-0 left-0 w-full h-10 bg-purple-600 z-[60] flex items-center justify-center transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center gap-2 text-white text-xs font-bold tracking-[0.2em] uppercase"><Truck size={14} /> FRETE GRÁTIS ACIMA DE R$ 250,00 🇧🇷</div>
    </div>
  );
};

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const freeShippingThreshold = 250;
  
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });
  
  // Estados para a tela de Pagamento
  const [clientSecret, setClientSecret] = useState(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountValue = 0;
  let isFreeShippingCoupon = false;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'frete') isFreeShippingCoupon = true;
    else discountValue = subtotal * (appliedCoupon.discount / 100);
  }

  const total = subtotal - discountValue;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - subtotal;

  const handleApplyCoupon = () => {
    if(!couponInput) return;
    const coupons = JSON.parse(localStorage.getItem('groove_coupons')) || [];
    const foundCoupon = coupons.find(c => c.code === couponInput.toUpperCase());
    if (!foundCoupon) {
      setCouponMessage({ text: 'Cupom inválido.', type: 'error' });
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(foundCoupon);
    setCouponMessage({ text: foundCoupon.type === 'frete' ? 'Frete Grátis Aplicado!' : `${foundCoupon.discount}% OFF Aplicado!`, type: 'success' });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMessage({ text: '', type: '' });
  };

  // Chama a Cloud Function do Firebase para iniciar o pagamento
 const startCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsInitializingPayment(true);
    
    try {
      const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
      
      // RECALCULO SEGURO: Somamos tudo direto dos itens do carrinho para evitar o NaN
      const calculatedSubtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
      
      let finalTotal = calculatedSubtotal;
      
      // Aplica desconto se houver cupom
      if (appliedCoupon && appliedCoupon.type === 'discount') {
        finalTotal = calculatedSubtotal * (1 - appliedCoupon.discount / 100);
      }

      // Garantimos que o número é válido e arredondamos para 2 casas decimais
      const totalParaEnvio = parseFloat(finalTotal.toFixed(2));

      if (isNaN(totalParaEnvio) || totalParaEnvio <= 0) {
        throw new Error("Valor do carrinho inválido");
      }

      console.log("Enviando para o Stripe:", totalParaEnvio);

      const result = await createPaymentIntent({ total: totalParaEnvio });
      setClientSecret(result.data.clientSecret);
      
    } catch (error) {
      console.error("Erro detalhado:", error);
      alert("Erro ao processar valor. Verifique os itens do carrinho.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md z-[101] bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col">
            
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-black">
              <h2 className="text-xl font-black text-white italic tracking-widest uppercase">{clientSecret ? 'CHECKOUT SEGURO' : 'CARRINHO'}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={28}/></button>
            </div>
            
            {/* SE O CLIENT SECRET EXISTIR, MOSTRA A TELA DO STRIPE. SE NÃO, MOSTRA O CARRINHO NORMAL */}
            {clientSecret ? (
              <div className="p-6 flex-1 flex flex-col bg-neutral-900">
                <div className="flex items-center justify-center gap-2 mb-4 text-purple-400">
                  <Lock size={16} />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">Ambiente Criptografado</span>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#9333ea' } } }}>
                  <CheckoutForm total={total} onBack={() => setClientSecret(null)} />
                </Elements>
              </div>
            ) : (
              <>
                <div className="p-6 bg-neutral-900/50 border-b border-neutral-800">
                  <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest"><span className="text-gray-400">Meta Frete Grátis</span><span className="text-white">R$ 250,00</span></div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-3"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${progress === 100 || isFreeShippingCoupon ? 'bg-green-500' : 'bg-purple-600'}`} /></div>
                  <p className="text-center text-xs font-bold uppercase tracking-widest">{(progress === 100 || isFreeShippingCoupon) ? (<span className="text-green-400">VOCÊ GANHOU FRETE GRÁTIS</span>) : (<span className="text-gray-400">Faltam <span className="text-white">R$ {remaining.toFixed(2).replace('.', ',')}</span></span>)}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50"><ShoppingBag size={48} className="mb-4 text-gray-600" /><p className="text-sm font-bold tracking-widest uppercase text-white">Carrinho Vazio</p></div>
                  ) : (
                    cartItems.map((item) => (
                      <motion.div layout key={item.id} className="flex gap-4 bg-neutral-900 p-3 rounded-lg border border-neutral-800">
                        <img src={item.img} alt={item.name} className="w-20 h-24 object-cover rounded bg-neutral-800" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div><h3 className="font-bold text-white text-xs uppercase tracking-wide">{item.name}</h3><p className="text-[10px] text-gray-500 uppercase mt-1">Tam: G</p></div>
                            <button onClick={() => onRemoveItem(item.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="flex items-center gap-3 bg-black rounded p-1 border border-neutral-800">
                              <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-purple-400 text-gray-400"><Minus size={12} /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-purple-400 text-gray-400"><Plus size={12} /></button>
                            </div>
                            <p className="text-white font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                {cartItems.length > 0 && (
                  <div className="p-6 bg-black border-t border-neutral-800 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <input type="text" placeholder="Cupom da Roleta / Desconto" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-4 py-2 text-xs font-bold text-white uppercase focus:border-purple-500 outline-none" />
                          <button onClick={handleApplyCoupon} className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-4 rounded text-xs border border-neutral-700 uppercase tracking-widest">Aplicar</button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center bg-purple-500/10 border border-purple-500/30 rounded p-3">
                          <span className="text-purple-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Ticket size={14}/> {appliedCoupon.code}</span>
                          <button onClick={removeCoupon} className="text-gray-400 hover:text-white"><X size={14}/></button>
                        </div>
                      )}
                      {couponMessage.text && <p className={`text-[10px] font-bold uppercase tracking-widest ${couponMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{couponMessage.text}</p>}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-800/50">
                      <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Subtotal</span><span className="text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                      {appliedCoupon && appliedCoupon.type === 'discount' && <div className="flex justify-between items-center text-sm"><span className="text-green-400">Desconto</span><span className="text-green-400">- R$ {discountValue.toFixed(2).replace('.', ',')}</span></div>}
                      {isFreeShippingCoupon && <div className="flex justify-between items-center text-sm"><span className="text-green-400">Frete</span><span className="text-green-400 font-bold uppercase">Grátis (Roleta)</span></div>}
                      <div className="flex justify-between items-center mt-2 pt-2"><span className="text-gray-400 uppercase tracking-widest text-xs font-bold">Total a Pagar</span><span className="text-2xl font-black text-white">R$ {total.toFixed(2).replace('.', ',')}</span></div>
                    </div>

                    <button onClick={startCheckout} disabled={isInitializingPayment} className="w-full bg-white hover:bg-purple-600 text-black hover:text-white transition-all font-black py-4 rounded tracking-widest uppercase text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-70">
                      {isInitializingPayment ? <Loader2 className="animate-spin" size={20} /> : 'FINALIZAR COMPRA'} <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// COMPONENTE: ROLETA DE DESCONTOS
// ==========================================
const SpinAndWin = () => {
  const prizes = [
    { label: '5% OFF', value: 5, type: 'discount', color: '#171717' },
    { label: '7% OFF', value: 7, type: 'discount', color: '#262626' },
    { label: '10% OFF', value: 10, type: 'discount', color: '#171717' },
    { label: '15% OFF', value: 15, type: 'discount', color: '#262626' },
    { label: '20% OFF', value: 20, type: 'discount', color: '#171717' },
    { label: 'FRETE GRÁTIS', value: 0, type: 'frete', color: '#9333ea' }, 
  ];

  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [prize, setPrize] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [copied, setCopied] = useState(false);

  const spin = () => {
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[randomIndex];
    const targetRotation = (360 * 5) - (randomIndex * 60 + 30);
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      setPrize(selectedPrize);
      const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `GROOVE${selectedPrize.type === 'discount' ? selectedPrize.value : 'FRETE'}-${randomString}`;
      setCouponCode(code);
      const existingCoupons = JSON.parse(localStorage.getItem('groove_coupons')) || [];
      existingCoupons.push({ code: code, discount: selectedPrize.value, type: selectedPrize.type });
      localStorage.setItem('groove_coupons', JSON.stringify(existingCoupons));
    }, 5000); 
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-neutral-950 border-t border-neutral-900 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-purple-900/10 blur-[150px] pointer-events-none z-0"></div>
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-400 text-xs font-bold tracking-widest uppercase mb-6"><Gift size={14} /> Exclusivo para você</div>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none">A Sorte <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-white">Forja os Audazes.</span></h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">Gire a roleta da Groove Nation e garanta até 20% de desconto ou Frete Grátis na sua próxima peça. Você só tem uma chance.</p>

          {!hasSpun ? (
            <button onClick={spin} disabled={isSpinning} className={`px-10 py-5 font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)] ${isSpinning ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-white hover:text-black hover:scale-105'}`}>{isSpinning ? 'Girando...' : 'Girar a Roleta'}</button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 border border-purple-500/50 p-6 rounded-lg max-w-sm mx-auto md:mx-0">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Seu prêmio forjado:</p>
              <p className="text-2xl font-black text-white italic tracking-widest uppercase mb-4">{prize.label}</p>
              <div className="flex items-center gap-2"><input type="text" readOnly value={couponCode} className="flex-1 bg-black border border-neutral-700 text-purple-400 font-bold text-center py-3 rounded text-sm tracking-widest focus:outline-none" /><button onClick={copyToClipboard} className="bg-white text-black font-bold uppercase tracking-widest text-xs px-4 py-3 rounded hover:bg-purple-600 hover:text-white transition-colors">{copied ? 'Copiado' : 'Copiar'}</button></div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-4">Cole este código no carrinho.</p>
            </motion.div>
          )}
        </div>

        <div className="relative w-72 h-72 md:w-96 md:h-96 shrink-0">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-purple-500 drop-shadow-[0_0_10px_rgba(147,51,234,0.8)]"></div>
          <motion.div animate={{ rotate: rotation }} transition={{ duration: 5, ease: [0.2, 0.8, 0.2, 1] }} className="w-full h-full rounded-full border-8 border-neutral-900 shadow-[0_0_40px_rgba(147,51,234,0.2)] relative overflow-hidden" style={{ background: `conic-gradient(from 0deg, ${prizes[0].color} 0 60deg, ${prizes[1].color} 60deg 120deg, ${prizes[2].color} 120deg 180deg, ${prizes[3].color} 180deg 240deg, ${prizes[4].color} 240deg 300deg, ${prizes[5].color} 300deg 360deg)` }}>
            {prizes.map((p, i) => (<div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 60 + 30}deg)` }}><div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 text-white font-black text-[10px] md:text-xs uppercase tracking-widest origin-bottom h-1/2">{p.label}</div></div>))}
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-neutral-950 rounded-full border-4 border-purple-600 z-10 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)]"><Zap size={20} className="text-white"/></div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// HOME VIEW E APP PRINCIPAL
// ==========================================
const HomeView = ({ onAddToCart }) => {
  const products = JSON.parse(localStorage.getItem('groove_products')) || defaultProducts;
  return (
    <div className="bg-neutral-950">
      <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1516826957135-700ede19c6ce?q=80&w=2070&auto=format&fit=crop" alt="Coleção Groove" className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/60" /></div>
        <div className="relative z-10 text-center px-4 w-full flex flex-col items-center mt-20">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-purple-400 font-bold tracking-[0.4em] text-xs md:text-sm uppercase mb-4 border border-purple-500/30 px-4 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">Nova Coleção • Inverno 26</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter uppercase italic text-white drop-shadow-2xl leading-[0.85] mb-8">FORJANDO <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-white">O SHAPE.</span></motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><a href="#vitrine" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 font-black uppercase tracking-[0.2em] text-sm hover:bg-purple-600 hover:text-white transition-all duration-300">Ver os Produtos <ArrowRight size={18} /></a></motion.div>
        </div>
      </section>

      <div className="w-full bg-purple-600 py-3 overflow-hidden whitespace-nowrap flex items-center border-y border-purple-400">
        <motion.div className="flex gap-10 items-center font-black uppercase tracking-widest text-xs" animate={{ x: [0, -1000] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
          {[...Array(10)].map((_, i) => (<React.Fragment key={i}><span className="text-white">NO PAIN NO GAIN</span><span className="text-black text-[8px]">✦</span><span className="text-white">GROOVE NATION</span><span className="text-black text-[8px]">✦</span></React.Fragment>))}
        </motion.div>
      </div>

      <section id="vitrine" className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-neutral-800 pb-6"><div><h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">Últimos Drops</h2><p className="text-neutral-500 tracking-[0.2em] text-xs mt-2 uppercase font-bold">Equipamento pesado para o dia a dia</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0,4).map((product) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group relative flex flex-col">
              <div className="relative aspect-[3/4] bg-neutral-900 mb-4 overflow-hidden rounded-sm cursor-pointer border border-neutral-800 group-hover:border-purple-500/50 transition-colors">
                {product.tag && (<div className="absolute top-3 left-3 z-20 bg-white text-black text-[9px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">{product.tag}</div>)}
                <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20"><button onClick={() => onAddToCart(product)} disabled={product.stock <= 0} className={`w-full font-black text-xs py-4 uppercase tracking-widest transition-colors ${product.stock > 0 ? 'bg-purple-600 text-white hover:bg-white hover:text-black' : 'bg-neutral-950/80 text-gray-500 backdrop-blur-md cursor-not-allowed'}`}>{product.stock > 0 ? 'Adicionar ao Carrinho' : 'Esgotado'}</button></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              </div>
              <div className="flex flex-col px-1"><h4 className="font-bold text-sm text-neutral-300 uppercase tracking-widest">{product.name}</h4><div className="flex items-center justify-between mt-2"><span className="font-black text-white text-lg">R$ {product.price.toFixed(2).replace('.', ',')}</span>{product.stock <= 5 && product.stock > 0 && <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider animate-pulse">Últimas Unidades</span>}</div></div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-black border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
          <div className="relative group overflow-hidden bg-neutral-900 rounded cursor-pointer"><img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 grayscale" /><div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors"><h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">T-Shirts</h3><span className="mt-4 px-6 py-2 border border-white text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors">COMPRAR</span></div></div>
          <div className="relative group overflow-hidden bg-neutral-900 rounded cursor-pointer"><img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 grayscale" /><div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors"><h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">Hoodies</h3><span className="mt-4 px-6 py-2 border border-white text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors">COMPRAR</span></div></div>
        </div>
      </section>

      <SpinAndWin />

      <section className="py-24 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12 uppercase italic tracking-tighter">Dúvidas Frequentes</h2>
          <div className="space-y-4 text-left">
            <div className="border border-neutral-800 rounded bg-neutral-900/50 p-6"><h3 className="font-bold text-white text-lg mb-2">Vocês enviam para todo o Brasil?</h3><p className="text-gray-400 text-sm leading-relaxed">Sim! Todos os nossos pedidos são preparados com cuidado e despachados da nossa central em <strong>São Vicente - Litoral de SP</strong> diretamente para a sua casa em qualquer lugar do Brasil, via Correios ou transportadora.</p></div>
            <div className="border border-neutral-800 rounded bg-neutral-900/50 p-6"><h3 className="font-bold text-white text-lg mb-2">Como sei meu tamanho?</h3><p className="text-gray-400 text-sm leading-relaxed">Nossa modelagem segue o padrão <em>Old School Bodybuilding</em>, focada no caimento Oversized. Recomendamos comprar o seu tamanho habitual para um caimento largo, ou um tamanho menor se preferir mais ajustado.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};

const App = () => {
  const isUnderMaintenance = false; 
  if (isUnderMaintenance) return <MaintenanceView />;

  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isAdminRoute, setIsAdminRoute] = useState(() => localStorage.getItem('groove_admin_route') === 'true');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('groove_admin_auth') === 'true');

  useEffect(() => { localStorage.setItem('groove_admin_route', isAdminRoute); }, [isAdminRoute]);
  useEffect(() => { localStorage.setItem('groove_admin_auth', isAuthenticated); }, [isAuthenticated]);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) setShowNavbar(false);
      else setShowNavbar(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) { const newQty = item.quantity + delta; return newQty > 0 ? { ...item, quantity: newQty } : item; }
      return item;
    }));
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(item => item.id !== id));

  const handleNavClick = (page) => {
    if (page === 'admin') setIsAdminRoute(true);
    else { setIsAdminRoute(false); setCurrentPage(page); }
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminRoute) {
    if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} onBack={() => setIsAdminRoute(false)} />;
    return <AdminDashboard onLogout={() => { setIsAuthenticated(false); setIsAdminRoute(false); }} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500 pt-10">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} />
      <TopAnnouncementBar show={showNavbar} />
      
      <nav className={`fixed top-10 w-full z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-[140%]'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div onClick={() => handleNavClick('home')} className="cursor-pointer"><img src={logoGroove} alt="Groove Nation" className="h-10 w-auto object-contain hover:opacity-80 transition-opacity" /></div>
            <div className="hidden md:flex space-x-10 items-center">
              <button onClick={() => handleNavClick('privacy')} className="text-xs font-bold tracking-[0.2em] uppercase text-gray-300 hover:text-white transition-colors">Políticas</button>
              <div className="relative cursor-pointer flex items-center gap-2 text-white hover:text-purple-400 transition-colors" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag size={20} /><span className="text-xs font-bold tracking-widest uppercase">Sacola</span>
                {cartItems.length > 0 && (<span className="absolute -top-1 -left-2 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>)}
              </div>
            </div>
            <div className="md:hidden flex items-center gap-6">
              <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag className="text-white" />
                {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>}
              </div>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white"><Menu size={24} /></button>
            </div>
          </div>
        </div>
      </nav>
      
      {currentPage === 'home' ? <HomeView onAddToCart={addToCart} /> : currentPage === 'privacy' ? <PrivacyView /> : null}

      <footer className="bg-black py-16 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-12">
            <div className="flex flex-col items-center md:items-start"><img src={logoGroove} alt="Groove" className="h-8 w-auto mb-6 opacity-50" /><p className="text-gray-500 text-sm leading-relaxed max-w-xs">Streetwear e Bodybuilding. O silêncio forja os campeões. Desenvolvido para aguentar o tranco.</p></div>
            <div><h4 className="font-bold mb-6 text-white uppercase tracking-[0.2em] text-xs">Suporte</h4><ul className="space-y-4 text-gray-500 text-sm"><li><button onClick={() => handleNavClick('privacy')} className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px] font-bold">Privacidade</button></li><li><a href="#" className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px] font-bold">Trocas e Devoluções</a></li></ul></div>
            <div><h4 className="font-bold mb-6 text-white uppercase tracking-[0.2em] text-xs">Conecte-se</h4><div className="flex space-x-6 justify-center md:justify-start"><a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram size={20} /></a><a href="#" className="text-gray-500 hover:text-white transition-colors"><Facebook size={20} /></a></div></div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-neutral-900/50 gap-8">
            <div className="flex flex-col items-center md:items-start gap-3"><span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Pagamento Seguro</span><div className="flex gap-2 flex-wrap justify-center"><div className="h-8 px-3 border border-neutral-800 rounded bg-neutral-900 flex items-center justify-center hover:border-purple-500 transition-colors cursor-default"><img src="https://cdn.simpleicons.org/pix/32BCAD" alt="Pix" className="h-4" /></div><div className="h-8 px-3 border border-neutral-800 rounded bg-neutral-900 flex items-center justify-center hover:border-purple-500 transition-colors cursor-default gap-1 text-white"><Barcode size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Boleto</span></div><div className="h-8 px-3 border border-neutral-800 rounded bg-neutral-900 flex items-center justify-center hover:border-purple-500 transition-colors cursor-default"><img src="https://cdn.simpleicons.org/visa/white" alt="Visa" className="h-3" /></div><div className="h-8 px-3 border border-neutral-800 rounded bg-neutral-900 flex items-center justify-center hover:border-purple-500 transition-colors cursor-default"><img src="https://cdn.simpleicons.org/mastercard" alt="Mastercard" className="h-4" /></div><div className="h-8 px-3 border border-neutral-800 rounded bg-neutral-900 flex items-center justify-center hover:border-purple-500 transition-colors cursor-default"><img src="https://cdn.simpleicons.org/americanexpress/white" alt="American Express" className="h-4" /></div></div></div>
            <div className="flex flex-col items-center md:items-end gap-3"><span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Segurança</span><div className="flex gap-3 flex-wrap justify-center"><div className="flex items-center gap-2 text-gray-400 bg-neutral-900 h-8 px-4 rounded border border-neutral-800 cursor-default"><ShieldCheck size={16} className="text-green-500" /><span className="text-[10px] font-bold uppercase tracking-widest">Site Seguro</span></div><div className="flex items-center gap-2 text-gray-400 bg-neutral-900 h-8 px-4 rounded border border-neutral-800 cursor-default"><Lock size={16} className="text-purple-500" /><span className="text-[10px] font-bold uppercase tracking-widest">SSL 256-Bit</span></div></div></div>
          </div>
          <div className="border-t border-neutral-900 pt-8 flex justify-between items-center text-gray-700 text-[10px] font-bold uppercase tracking-widest"><span>© 2026 GROOVE NATION.</span><button onClick={() => handleNavClick('admin')} className="hover:text-purple-500 transition-colors"><Lock size={14} /></button></div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50"><a href="https://wa.me/5516988265500" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform flex items-center justify-center"><MessageCircle size={28} fill="white" /></a></div>
    </div>
  );
};

export default App;