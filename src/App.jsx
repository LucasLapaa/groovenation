import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Menu, X, MessageCircle, Instagram, Facebook, Clock, ArrowUp, ShieldCheck, RefreshCw, Layers, Printer, Mail, CheckCircle, Loader2, Zap, Lock, ChevronDown, Terminal, Ruler, Ticket, Barcode, Cookie, CreditCard, Truck, MapPin, Camera, ShoppingBag, Trash2, Plus, Minus, FileText, Server, UserCheck, Globe } from 'lucide-react';

// Importando a logo
import logoGroove from './assets/groove.png';

// --- NOVA PÁGINA: POLÍTICA DE PRIVACIDADE ---
const PrivacyView = () => {
  const sections = [
    {
      title: "1. COLETA DE DADOS",
      icon: <DatabaseIcon />,
      content: "Na Groove Nation, coletamos apenas o essencial para que seu drop chegue até você. Isso inclui: Nome, CPF (para emissão de nota fiscal), Endereço de entrega, E-mail e Telefone. Não armazenamos dados completos do seu cartão de crédito; isso fica com o gateway de pagamento criptografado."
    },
    {
      title: "2. COMO USAMOS SUAS INFORMAÇÕES",
      icon: <Server />,
      content: "Seus dados têm um único propósito: garantir que você receba seu pedido e fique por dentro dos lançamentos. Usamos seu e-mail para enviar o rastreio e, se você permitir, novidades sobre drops exclusivos. Nunca vendemos seus dados para terceiros."
    },
    {
      title: "3. COOKIES & TECNOLOGIA",
      icon: <Cookie />,
      content: "Utilizamos cookies para melhorar sua experiência de navegação, lembrar seu carrinho e entender como você interage com nosso site. Você pode gerenciar suas preferências de cookies a qualquer momento nas configurações do seu navegador."
    },
    {
      title: "4. SEGURANÇA",
      icon: <Lock />,
      content: "Levamos a segurança a sério. Nosso site utiliza criptografia SSL (aquele cadeado na barra de endereço) para proteger todas as transações. Seus dados trafegam em ambiente seguro e monitorado 24/7."
    },
    {
      title: "5. SEUS DIREITOS (LGPD)",
      icon: <UserCheck />,
      content: "Você é dono dos seus dados. A qualquer momento, você pode solicitar a visualização, correção ou exclusão das suas informações do nosso banco de dados. Basta entrar em contato com nosso suporte."
    }
  ];

  return (
    <div className="pt-40 pb-20 min-h-screen bg-neutral-950 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block p-3 bg-purple-500/10 rounded-full mb-4">
            <ShieldCheck className="text-purple-500 w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            POLÍTICA DE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">PRIVACIDADE</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Transparência total. Aqui explicamos como cuidamos dos seus dados enquanto você cuida do seu estilo.</p>
          <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">Última atualização: Março 2026</p>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-neutral-800 rounded-lg text-purple-400">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">{section.title}</h3>
              </div>
              <p className="text-gray-400 leading-relaxed pl-0 md:pl-14">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contato Legal */}
        <div className="mt-16 p-8 bg-purple-900/10 border border-purple-500/20 rounded-2xl text-center">
          <h3 className="text-white font-bold text-lg mb-2">Ficou com alguma dúvida?</h3>
          <p className="text-gray-400 mb-6 text-sm">Nosso time de Data Protection está à disposição.</p>
          <a href="mailto:privacy@groovenation.com" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition-colors">
            <Mail size={18} /> privacy@groovenation.com
          </a>
        </div>

      </div>
    </div>
  );
};

// Ícone auxiliar
const DatabaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5"/></svg>
);

// --- COMPONENTE CARRINHO DE COMPRAS ---
const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const freeShippingThreshold = 250;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 right-0 h-full w-full max-w-md z-[101] bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingBag className="text-purple-500" /> SEU CARRINHO</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X /></button>
            </div>
            <div className="p-6 bg-neutral-900 border-b border-neutral-800">
              <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide"><span className="text-gray-400">Meta de Frete Grátis</span><span className="text-white">R$ {freeShippingThreshold},00</span></div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-3"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`} /></div>
              <p className="text-center text-sm">{progress === 100 ? (<span className="text-green-400 font-bold flex items-center justify-center gap-1"><Truck size={14}/> PARABÉNS! VOCÊ GANHOU FRETE GRÁTIS</span>) : (<span className="text-gray-400">Faltam <span className="text-white font-bold">R$ {remaining.toFixed(2).replace('.', ',')}</span> para frete grátis.</span>)}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50"><ShoppingBag size={64} className="mb-4 text-gray-600" /><p className="text-lg font-bold text-white">Seu carrinho está vazio.</p><p className="text-sm text-gray-500">Bora encher de estilo?</p></div>
              ) : (
                cartItems.map((item) => (
                  <motion.div layout key={item.id} className="flex gap-4 bg-neutral-800/30 p-4 rounded-xl border border-neutral-800">
                    <img src={item.img} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div><h3 className="font-bold text-white text-sm">{item.name}</h3><p className="text-xs text-gray-400">Tamanho: G (Exemplo)</p></div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3 bg-neutral-900 rounded-lg p-1 border border-neutral-700">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-purple-400 text-gray-400"><Minus size={14} /></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-purple-400 text-gray-400"><Plus size={14} /></button>
                        </div>
                        <div className="text-right"><p className="text-purple-400 font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p></div>
                      </div>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="text-gray-500 hover:text-red-500 self-start"><Trash2 size={16} /></button>
                  </motion.div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 bg-neutral-950 border-t border-neutral-800">
                <div className="flex justify-between items-center mb-4"><span className="text-gray-400">Subtotal</span><span className="text-2xl font-black text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                <button className="w-full bg-white hover:bg-gray-200 text-black font-black py-4 rounded-xl tracking-widest transition-colors flex items-center justify-center gap-2">FINALIZAR COMPRA <Lock size={16} /></button>
                <p className="text-center text-[10px] text-gray-500 mt-3 uppercase tracking-widest">Checkout Seguro & Criptografado</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- COMPONENTE ROADMAP ---
const Roadmap = () => {
  const steps = [
    { date: "JAN 2026", title: "Conceito & Design", status: "done", desc: "Definição da identidade visual e modelagem exclusiva." },
    { date: "FEV 2026", title: "Prototipagem", status: "done", desc: "Testes de tecido, caimento e estamparia DTF." },
    { date: "MAR 2026", title: "Produção Final", status: "current", desc: "Confecção das peças em alta escala com controle de qualidade." },
    { date: "20 MAR", title: "DROP OFICIAL", status: "locked", desc: "Lançamento do site e abertura das vendas para o público." },
  ];

  return (
    <section className="py-24 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">BASTIDORES</h2>
          <p className="text-gray-400">Acompanhe a jornada até o lançamento.</p>
        </div>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-800 transform md:-translate-x-1/2"></div>
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} className={`relative flex items-center mb-12 md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="hidden md:block w-5/12"></div>
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-neutral-950 z-10 flex items-center justify-center">
                {step.status === 'done' ? (<div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center"><CheckCircle size={14} className="text-black" /></div>) : step.status === 'current' ? (<div className="w-full h-full bg-purple-500 rounded-full animate-pulse"></div>) : (<div className="w-full h-full bg-neutral-700 rounded-full"></div>)}
              </div>
              <div className="ml-12 md:ml-0 w-full md:w-5/12 p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-purple-500/30 transition-colors">
                <span className={`text-xs font-bold tracking-widest ${step.status === 'done' ? 'text-green-500' : step.status === 'current' ? 'text-purple-500' : 'text-gray-500'}`}>{step.date}</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- COMPONENTE LOOKBOOK ---
const Lookbook = () => {
  const images = [
    { src: "", size: "col-span-1 md:col-span-2 row-span-2" }, 
    { src: "", size: "col-span-1 row-span-1" },
    { src: "", size: "col-span-1 row-span-1" },
    { src: "", size: "col-span-1 md:col-span-2 row-span-1" }, 
  ];
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div><h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Look<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Book</span></h2></div>
          <div className="hidden md:flex items-center gap-2 text-gray-400"><Camera size={20} /><span className="text-xs uppercase tracking-widest">Basics & Oversized</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`relative group overflow-hidden rounded-xl bg-neutral-900 ${img.size}`}>
              <img src={img.src} alt="Lookbook Oversized" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"><p className="text-white font-bold tracking-wider">ESSENTIALS</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- OUTROS COMPONENTES ---
const TopAnnouncementBar = ({ show }) => {
  const messages = [{ text: "FRETE GRÁTIS ACIMA DE R$ 250,00 🇧🇷", icon: <Truck size={14} /> }, { text: "PARCELE EM ATÉ 12X NO CARTÃO", icon: <CreditCard size={14} /> }, { text: "5% DE DESCONTO NO PIX", icon: <Zap size={14} /> }, { text: "PRIMEIRA TROCA GRÁTIS", icon: <RefreshCw size={14} /> }];
  const [current, setCurrent] = useState(0);
  useEffect(() => { const timer = setInterval(() => setCurrent((prev) => (prev + 1) % messages.length), 3500); return () => clearInterval(timer); }, []);
  return (
    <div className={`fixed top-0 left-0 w-full h-10 bg-purple-600 z-[60] flex items-center justify-center transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
      <AnimatePresence mode='wait'><motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 text-white text-xs md:text-sm font-bold tracking-wider uppercase">{messages[current].icon}{messages[current].text}</motion.div></AnimatePresence>
    </div>
  );
};

const CookieConsent = ({ onVisibilityChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { const consent = localStorage.getItem('groove_cookie_consent'); if (!consent) { setTimeout(() => { setIsVisible(true); onVisibilityChange(true); }, 2000); } }, []);
  const handleAccept = () => { localStorage.setItem('groove_cookie_consent', 'true'); setIsVisible(false); onVisibilityChange(false); };
  const handleDecline = () => { setIsVisible(false); onVisibilityChange(false); };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-0 left-0 w-full z-[80] p-4">
          <div className="max-w-7xl mx-auto bg-neutral-900/95 backdrop-blur-md border-t border-purple-500/30 p-6 rounded-t-2xl shadow-2xl md:flex md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4 mb-4 md:mb-0"><div className="bg-purple-500/20 p-3 rounded-full hidden md:block"><Cookie className="text-purple-400" size={24} /></div><div><h4 className="text-white font-bold mb-1">Privacidade & Dados</h4><p className="text-gray-400 text-sm leading-relaxed">Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa Política.</p></div></div>
            <div className="flex gap-4"><button onClick={handleDecline} className="flex-1 md:flex-none px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">Recusar</button><button onClick={handleAccept} className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/20">Aceitar</button></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LiveHypeCounter = ({ isCookieOpen }) => {
  const [viewers, setViewers] = useState(124); 
  useEffect(() => { const interval = setInterval(() => { const change = Math.floor(Math.random() * 9) - 3; setViewers(prev => { const newValue = prev + change; return newValue < 80 ? 85 : newValue > 150 ? 145 : newValue; }); }, 3000); return () => clearInterval(interval); }, []);
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2 }} className={`fixed left-6 z-40 hidden md:flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg transition-all duration-500 ease-in-out ${isCookieOpen ? 'bottom-40' : 'bottom-6'}`}>
      <div className="relative flex items-center justify-center"><span className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span><span className="relative w-2 h-2 bg-red-500 rounded-full"></span></div>
      <span className="text-xs font-mono text-gray-300"><span className="font-bold text-white">{viewers}</span> pessoas online</span>
    </motion.div>
  );
};

const VipTicket = ({ email, onClose }) => {
  const memberId = '#' + Math.abs(email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)).toString().slice(0, 4).padEnd(4, '0');
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0, rotateX: -90 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative w-full max-w-sm bg-neutral-900 border-2 border-dashed border-purple-500/50 rounded-3xl p-6 overflow-hidden mx-auto my-6">
      <div className="absolute -left-3 top-1/2 w-6 h-6 bg-black rounded-full"></div><div className="absolute -right-3 top-1/2 w-6 h-6 bg-black rounded-full"></div>
      <div className="flex justify-between items-start mb-6"><div><span className="inline-block px-3 py-1 bg-purple-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full mb-2">Acesso Confirmado</span><h3 className="text-2xl font-black text-white italic">GROOVE VIP</h3></div><Ticket className="text-purple-500 opacity-50" size={40} /></div>
      <div className="space-y-4 border-t border-dashed border-white/10 pt-4"><div><p className="text-xs text-gray-500 uppercase tracking-wider">Membro</p><p className="text-white font-mono truncate">{email}</p></div><div className="flex justify-between"><div><p className="text-xs text-gray-500 uppercase tracking-wider">ID</p><p className="text-purple-400 font-black font-mono text-xl">{memberId}</p></div><div><p className="text-xs text-gray-500 uppercase tracking-wider text-right">Data</p><p className="text-white font-mono text-right">20.03.26</p></div></div></div>
      <div className="mt-6 pt-4 border-t border-white/10 opacity-50 flex justify-center"><Barcode className="w-full h-12 text-white" /></div><div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] pointer-events-none"></div><p className="text-center text-[10px] text-gray-500 mt-4">Tire um print e compartilhe nos stories.</p>
      <button onClick={onClose} className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-3 rounded-xl transition-colors uppercase tracking-widest">Fechar Ticket</button>
    </motion.div>
  );
};

const KineticTypography = () => {
  const { scrollYProgress } = useScroll();
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]); 
  const x2 = useTransform(scrollYProgress, [0, 1], ["-25%", "0%"]); 
  return (
    <section className="py-20 bg-neutral-950 overflow-hidden relative border-y border-neutral-900 flex flex-col gap-4 select-none pointer-events-none">
       <motion.div style={{ x: x1 }} className="whitespace-nowrap"><span className="text-5xl md:text-8xl leading-none font-black text-neutral-800/40 uppercase tracking-tighter">SOMOS A GROOVE SOMOS A GROOVE SOMOS A GROOVE</span></motion.div>
       <motion.div style={{ x: x2 }} className="whitespace-nowrap"><span className="text-5xl md:text-8xl leading-none font-black text-neutral-800/40 uppercase tracking-tighter">FUTURO DO STREETWEAR FUTURO DO STREETWEAR</span></motion.div>
    </section>
  );
};

const SizeGuideModal = ({ onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 md:p-10 max-w-2xl w-full relative shadow-[0_0_50px_rgba(168,85,247,0.15)]">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
      <div className="text-center mb-8"><h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2"><Ruler className="text-purple-500" /> GUIA DE MEDIDAS</h3><p className="text-gray-400 text-sm mt-2">Modelagem <span className="text-purple-400 font-bold">OVERSIZED</span>. Compare com uma peça sua.</p></div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-64 bg-neutral-800/50 rounded-xl flex items-center justify-center border border-neutral-700">
           <div className="relative w-40 h-48 border-2 border-gray-600 rounded-t-3xl rounded-b-lg"><div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 border-b-2 border-gray-600 rounded-b-full bg-neutral-900"></div><div className="absolute -right-4 top-0 bottom-0 border-r-2 border-dashed border-purple-500 flex items-center"><span className="rotate-90 text-xs text-purple-400 font-bold whitespace-nowrap -mr-8">ALTURA</span></div><div className="absolute bottom-4 left-0 right-0 border-b-2 border-dashed border-purple-500 flex justify-center"><span className="text-xs text-purple-400 font-bold -mb-5">LARGURA</span></div></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead className="text-xs text-gray-500 uppercase bg-neutral-950/50"><tr><th className="px-4 py-3 rounded-l-lg">Tam</th><th className="px-4 py-3">Largura</th><th className="px-4 py-3 rounded-r-lg">Altura</th></tr></thead>
            <tbody className="divide-y divide-neutral-800">
              <tr className="hover:bg-purple-500/10 transition-colors"><td className="px-4 py-3 font-bold text-white">P</td><td className="px-4 py-3">55 cm</td><td className="px-4 py-3">75 cm</td></tr>
              <tr className="hover:bg-purple-500/10 transition-colors"><td className="px-4 py-3 font-bold text-white">M</td><td className="px-4 py-3">58 cm</td><td className="px-4 py-3">77 cm</td></tr>
              <tr className="hover:bg-purple-500/10 transition-colors"><td className="px-4 py-3 font-bold text-white">G</td><td className="px-4 py-3">61 cm</td><td className="px-4 py-3">79 cm</td></tr>
              <tr className="hover:bg-purple-500/10 transition-colors"><td className="px-4 py-3 font-bold text-white">GG</td><td className="px-4 py-3">64 cm</td><td className="px-4 py-3">81 cm</td></tr>
              <tr className="hover:bg-purple-500/10 transition-colors"><td className="px-4 py-3 font-bold text-white">XG</td><td className="px-4 py-3">67 cm</td><td className="px-4 py-3">83 cm</td></tr>
            </tbody>
          </table>
          <p className="text-[10px] text-gray-500 mt-4 text-center">*Margem de variação de +/- 2cm.</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const SecretModal = ({ onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md font-mono p-4">
    <motion.div initial={{ scale: 0.8, rotateX: 90 }} animate={{ scale: 1, rotateX: 0 }} className="max-w-md w-full bg-neutral-950 border-2 border-green-500 rounded-xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.3)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none background-size-[100%_2px,3px_100%]"></div>
      <div className="relative z-10 text-center">
        <div className="flex justify-center mb-4"><Terminal className="text-green-500 w-16 h-16 animate-pulse" /></div>
        <h2 className="text-3xl md:text-4xl font-black text-green-500 mb-2 tracking-tighter">SYSTEM UNLOCKED</h2>
        <p className="text-green-400/80 text-sm mb-8 typing-effect">Você encontrou a área secreta da Groove.</p>
        <div className="bg-green-900/10 border border-green-500/30 p-6 rounded-lg mb-8 dashed-border"><p className="text-green-600 text-xs uppercase tracking-[0.2em] mb-2">Cupom de Fundador</p><p className="text-3xl font-bold text-white tracking-widest select-all cursor-text">SECRETGROOVE</p><p className="text-[10px] text-green-500/60 mt-2">15% OFF em toda a loja</p></div>
        <button onClick={onClose} className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-4 rounded transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]">RESGATAR E FECHAR</button>
      </div>
    </motion.div>
  </motion.div>
);

const Marquee = () => {
  return (
    <div className="w-full overflow-hidden bg-neutral-900 border-y border-purple-500/20 py-4 relative z-20">
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-neutral-950 to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-neutral-950 to-transparent z-10"></div>
      <motion.div className="flex whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-xl md:text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600 uppercase mx-8">GROOVE NATION</span>
            <Zap className="text-purple-500 w-6 h-6 md:w-8 md:h-8" />
            <span className="text-xl md:text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600 uppercase mx-8">STREETWEAR</span>
            <Zap className="text-purple-500 w-6 h-6 md:w-8 md:h-8" />
            <span className="text-xl md:text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600 uppercase mx-8">ALGODÃO PREMIUM</span>
            <Zap className="text-purple-500 w-6 h-6 md:w-8 md:h-8" />
            <span className="text-xl md:text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600 uppercase mx-8">LIMITED DROP</span>
            <Zap className="text-purple-500 w-6 h-6 md:w-8 md:h-8" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const CountdownTimer = () => {
  const targetDate = new Date(2026, 2, 20).getTime(); 
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;
    if (difference > 0) return { dias: Math.floor(difference / (1000 * 60 * 60 * 24)), horas: Math.floor((difference / (1000 * 60 * 60)) % 24), min: Math.floor((difference / 1000 / 60) % 60), seg: Math.floor((difference / 1000) % 60) };
    return { dias: 0, horas: 0, min: 0, seg: 0 };
  }
  useEffect(() => { const timer = setInterval(() => { setTimeLeft(calculateTimeLeft()); }, 1000); return () => clearInterval(timer); }, []);
  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2">
      <div className="w-20 h-24 md:w-24 md:h-32 bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_#a855f7]"></div>
        <span className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter">{value < 10 ? `0${value}` : value}</span>
      </div>
      <span className="text-xs md:text-sm font-bold text-gray-400 mt-3 tracking-[0.2em] uppercase">{label}</span>
    </div>
  );
  return (
    <div className="flex flex-wrap justify-center mt-10 mb-12">
      <TimeBox value={timeLeft.dias} label="Dias" />
      <TimeBox value={timeLeft.horas} label="Horas" />
      <TimeBox value={timeLeft.min} label="Min" />
      <TimeBox value={timeLeft.seg} label="Seg" />
    </div>
  );
};

const FAQ = ({ onOpenSizeGuide }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const questions = [
    { question: "Quando será o lançamento oficial?", answer: "O drop oficial da coleção Groove 2026 acontecerá no dia 20 de Março. Cadastre-se na Lista VIP para receber o link de compra 1 hora antes de todo mundo." },
    { question: "Quais são as formas de pagamento?", answer: "Aceitamos PIX (com desconto especial), Cartão de Crédito em até 12x e Boleto Bancário. Todas as transações são criptografadas e seguras." },
    { question: "Vocês enviam para todo o Brasil?", answer: "Sim! Enviamos para todos os estados do Brasil via Correios ou Transportadoras parceiras, com código de rastreio enviado direto no seu e-mail." },
    { question: "Como sei qual é o meu tamanho?", answer: "Nossa modelagem é Oversized. Recomendamos comparar as medidas com uma peça que você já tem. Clique no botão 'Guia de Medidas' acima para ver a tabela detalhada." },
    { question: "Posso trocar se não servir?", answer: "Com certeza. A primeira troca é por nossa conta. Você tem até 7 dias após o recebimento para solicitar a troca ou devolução sem burocracia." }
  ];
  return (
    <section className="py-24 bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">DÚVIDAS FREQUENTES</h2><p className="text-gray-400 mb-8">Tudo o que você precisa saber antes de entrar no modo Groove.</p><button onClick={onOpenSizeGuide} className="flex items-center justify-center gap-2 mx-auto bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl border border-neutral-700 hover:border-purple-500 transition-all group"><Ruler size={20} className="text-purple-500 group-hover:scale-110 transition-transform" />Ver Guia de Medidas</button></div>
        <div className="space-y-4">
          {questions.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="border border-neutral-800 rounded-2xl bg-neutral-950/50 overflow-hidden hover:border-purple-500/30 transition-colors">
              <button onClick={() => setActiveIndex(activeIndex === index ? null : index)} className="w-full p-6 flex justify-between items-center text-left focus:outline-none"><span className={`font-bold text-lg ${activeIndex === index ? 'text-purple-400' : 'text-white'}`}>{item.question}</span><motion.div animate={{ rotate: activeIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="text-gray-500" /></motion.div></button>
              <AnimatePresence>{activeIndex === index && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}><div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-neutral-800/50 pt-4">{item.answer}</div></motion.div>)}</AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SpoilersView = ({ onAddToCart }) => {
  const products = [ 
    { id: 1, name: "Oversized", price: 139.90, img: "" }, 
    { id: 2, name: "Oversized", price: 289.90, img: "" }, 
    { id: 3, name: "Oversized", price: 119.90, img: "" }, 
  ];
  return (
    <div className="pt-40 pb-20 min-h-screen bg-neutral-950 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16"><motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-purple-500 font-bold tracking-[0.3em] text-sm uppercase">Acesso Restrito</motion.span><motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black text-white mt-4 tracking-tighter">SPOILER ROOM</motion.h1><p className="text-gray-400 mt-4 max-w-2xl mx-auto">Uma prévia secreta do que estamos produzindo. Passe o mouse para desbloquear a visão.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-purple-500/50 transition-all">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-all duration-700 filter blur-xl grayscale group-hover:blur-0 group-hover:grayscale-0 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-transparent/20 group-hover:opacity-0"><Lock className="text-purple-500 w-16 h-16 mb-4 animate-bounce" /><h3 className="text-2xl font-bold text-white tracking-widest">BLOQUEADO</h3><p className="text-xs text-gray-400 mt-2">Passe o mouse para revelar</p></div>
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-end mb-4">
                  <div><h3 className="text-2xl font-bold text-white">{product.name}</h3><div className="flex items-center gap-2 mt-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-green-400 text-sm font-bold">Em Estoque</span></div></div>
                  <span className="text-xl font-bold text-purple-400">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button onClick={() => onAddToCart(product)} className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-colors">PRÉ-VENDA AGORA</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeView = ({ handleGlitterMove, sparkles, sectionRef, dynamicBackground, onOpenVip, onOpenSizeGuide }) => {
  const fadeInUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };

  return (
    <>
      <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden pt-28 bg-neutral-950">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-purple-900/40 via-neutral-950/0 to-transparent blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-neutral-950/0 to-transparent blur-[120px]"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.08] blur-sm scale-150 animate-pulse duration-[4s]" style={{ backgroundImage: `url(${logoGroove})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950"></div>
        </div>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span variants={fadeInUp} className="inline-block py-1 px-4 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold tracking-[0.2em] mb-6 border border-purple-500/30 uppercase shadow-[0_0_20px_rgba(168,85,247,0.2)]">Coleção Groove 2026</motion.span>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl">SUA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-white animate-pulse">VIBE.</span></motion.h1>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed text-shadow-sm">Não vestimos corpos, vestimos atitude. Descubra o streetwear que acompanha o seu ritmo.</motion.p>
        </motion.div>
      </section>
      <Marquee />
      <section id="sobre" className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">PADRÃO GROOVE</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Muito mais do que roupa: é identidade, estilo e confiança.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-neutral-800/50 p-8 rounded-3xl border border-neutral-700 hover:border-purple-500/50 transition-colors">
              <Layers className="text-purple-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Qualidade Premium</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2"><span className="text-purple-500 font-bold">•</span>Algodão Premium 100% de alta gramatura.</li>
                <li className="flex items-start gap-2"><span className="text-purple-500 font-bold">•</span>Gola 2x1 em Ribana Canelada.</li>
                <li className="flex items-start gap-2"><span className="text-purple-500 font-bold">•</span>Tecnologia de pré-encolhimento.</li>
                <li className="flex items-start gap-2"><span className="text-purple-500 font-bold">•</span>Estampa em DTF de alta definição.</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-neutral-800/50 p-8 rounded-3xl border border-neutral-700 hover:border-purple-500/50 transition-colors">
              <Printer className="text-blue-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Feito Sob Demanda</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">Trabalhamos com o modelo exclusivo <strong>Print on Demand</strong>. Produzimos sua peça imediatamente após o seu pedido.</p>
              <div className="bg-neutral-900 p-4 rounded-xl flex items-center gap-4 border border-neutral-700">
                <Clock className="text-gray-400" />
                <div><p className="text-sm text-gray-400">Tempo de produção</p><p className="text-white font-bold">3 a 5 dias úteis + Envio</p></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-neutral-800/50 p-8 rounded-3xl border border-neutral-700 hover:border-purple-500/50 transition-colors">
              <RefreshCw className="text-green-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Troca Simplificada</h3>
              <p className="text-gray-300 mb-4">Não serviu? Fique tranquilo(a).</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Solicite em até 7 dias.</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="font-bold text-white">A primeira troca é por nossa conta.</span></li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-purple-900/40 to-neutral-800/50 p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-purple-600/20 blur-[60px] rounded-full group-hover:bg-purple-600/30 transition-all"></div>
              <ShieldCheck className="text-purple-300 mb-6 relative z-10" size={40} />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Satisfação Garantida</h3>
              <p className="text-gray-300 mb-6 relative z-10 leading-relaxed">Se algo não sair como esperado, nosso time de suporte resolve rápido. Você no controle.</p>
              <button className="relative z-10 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">Falar com Suporte</button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* ROADMAP */}
      <Roadmap />

      <KineticTypography />

      {/* LOOKBOOK */}
      <Lookbook />

      <motion.section id="colecoes" ref={sectionRef} className="py-32 relative overflow-hidden flex items-center justify-center" style={{ background: dynamicBackground, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-center mb-6"><div className="p-4 bg-white/5 rounded-full animate-pulse border border-white/10"><Clock className="text-white w-12 h-12" /></div></div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">LANÇAMENTO <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">IMINENTE</span></h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">Estamos nos bastidores preparando uma coleção que une o estilo <span className="font-bold text-white">minimalista</span> ao seu dia a dia <span className="font-bold text-white">intenso</span>.</p>
            <CountdownTimer />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block"><div onClick={onOpenVip} className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm md:text-base tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-lg shadow-purple-900/50 cursor-pointer">Aguarde. Vale a pena.</div></motion.div>
          </motion.div>
        </div>
      </motion.section>
      <FAQ onOpenSizeGuide={onOpenSizeGuide} />
      <section id="contato" onMouseMove={handleGlitterMove} className="py-32 relative overflow-hidden flex items-center justify-center group">
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {sparkles.map((sparkle) => (
              <motion.div key={sparkle.id} initial={{ opacity: 1, scale: 0 }} animate={{ opacity: 0, scale: 1.5, y: 20 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ position: 'absolute', left: sparkle.x, top: sparkle.y, width: sparkle.size, height: sparkle.size, backgroundColor: sparkle.color, borderRadius: '50%', boxShadow: `0 0 10px ${sparkle.color}, 0 0 20px ${sparkle.color}` }} />
            ))}
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop" alt="Background Contato" className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-neutral-900/80 to-fuchsia-900/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-30 pointer-events-auto">
          <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="inline-block">
            <div className="bg-white/10 p-6 rounded-full backdrop-blur-md border border-white/20 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)]"><MessageCircle className="text-white drop-shadow-md" size={48} /></div>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">PRECISA DE UM <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">HELP?</span></h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 font-light max-w-2xl mx-auto leading-relaxed">Nosso time de estilo está online agora para te ajudar com tamanhos, trocas ou dúvidas.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,211,102,0.3)] border border-green-400/30 group"><MessageCircle size={24} className="group-hover:animate-bounce" />Chamar no WhatsApp</button>
            <button className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all backdrop-blur-md border border-white/20 hover:border-white/40"><Mail size={24} />Enviar E-mail</button>
          </div>
        </div>
      </section>
    </>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start center", "end start"] });
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ["40%", "140%"]);
  const dynamicBackground = useMotionTemplate`linear-gradient(135deg, #050505 ${gradientPosition}, #9333ea ${gradientPosition}, #000000 100%)`;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [vipEmail, setVipEmail] = useState("");
  const [vipStatus, setVipStatus] = useState("idle"); 
  const [sparkles, setSparkles] = useState([]);
  const [isCookieBannerOpen, setIsCookieBannerOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isSecretOpen, setIsSecretOpen] = useState(false);

  // --- LÓGICA DO CARRINHO ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => { let timer; if (logoClicks > 0) { timer = setTimeout(() => setLogoClicks(0), 1000); } if (logoClicks >= 5) { setIsSecretOpen(true); setLogoClicks(0); clearTimeout(timer); } return () => clearTimeout(timer); }, [logoClicks]);
  const handleLogoClick = () => { setLogoClicks(prev => prev + 1); handleNavClick('home'); };
  useEffect(() => { const timer = setTimeout(() => { if (currentPage === 'home') setIsVipModalOpen(true); }, 4000); return () => clearTimeout(timer); }, [currentPage]);
  useEffect(() => { const controlNavbar = () => { if (window.scrollY > 200) setShowBackToTop(true); else setShowBackToTop(false); if (window.scrollY > lastScrollY && window.scrollY > 100) setShowNavbar(false); else setShowNavbar(true); setLastScrollY(window.scrollY); }; window.addEventListener('scroll', controlNavbar); return () => window.removeEventListener('scroll', controlNavbar); }, [lastScrollY]);
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleVipSubmit = (e) => { e.preventDefault(); if (!vipEmail) return; setVipStatus("sending"); const templateParams = { user_email: vipEmail, message: "Novo cadastro na Lista VIP Groove", }; emailjs.send('service_shrwdbs', 'template_rdvdxrc', templateParams, 'ogHLmzkXsUuKWny8b').then(() => setVipStatus("success"), () => setVipStatus("error")); };
  const closeVipModal = () => { setIsVipModalOpen(false); setTimeout(() => { setVipStatus("idle"); setVipEmail(""); }, 300); };
  const handleGlitterMove = (e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const newSparkle = { id: Date.now() + Math.random(), x, y, size: Math.random() * 4 + 2, color: Math.random() > 0.5 ? '#a855f7' : '#d946ef' }; setSparkles(prev => [...prev, newSparkle]); setTimeout(() => { setSparkles(prev => prev.filter(s => s.id !== newSparkle.id)); }, 800); };
  
  // NAVEGAÇÃO ENTRE PÁGINAS
  const handleNavClick = (page) => { 
    setCurrentPage(page); 
    setIsMenuOpen(false); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500 selection:text-white pt-10">
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        onUpdateQuantity={updateQuantity} 
        onRemoveItem={removeFromCart} 
      />

      <AnimatePresence>{isSecretOpen && <SecretModal onClose={() => setIsSecretOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{isSizeGuideOpen && <SizeGuideModal onClose={() => setIsSizeGuideOpen(false)} />}</AnimatePresence>
      <CookieConsent onVisibilityChange={setIsCookieBannerOpen} />
      <AnimatePresence>{isVipModalOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center px-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeVipModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" /><motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-neutral-900 border border-purple-500/30 p-8 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden"><div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[50px] rounded-full pointer-events-none"></div><div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-600/20 blur-[50px] rounded-full pointer-events-none"></div><button onClick={closeVipModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>{vipStatus === "success" ? (<VipTicket email={vipEmail} onClose={closeVipModal} />) : vipStatus === "error" ? (<div className="text-center py-8"><h3 className="text-2xl font-bold mb-2 text-red-500">Ops! Algo deu errado.</h3><button onClick={() => setVipStatus("idle")} className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-xl font-bold transition-colors">Tentar Novamente</button></div>) : (<><div className="text-center mb-8"><Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" /><h3 className="text-2xl font-bold">Lista VIP Groove</h3><p className="text-gray-400 text-sm mt-2">Receba acesso antecipado e um e-mail de boas-vindas.</p></div><form onSubmit={handleVipSubmit} className="space-y-4"><input type="email" required placeholder="Seu melhor e-mail" value={vipEmail} onChange={(e) => setVipEmail(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-4 text-white outline-none transition-all placeholder:text-gray-600" /><button type="submit" disabled={vipStatus === "sending"} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-70 flex items-center justify-center gap-2">{vipStatus === "sending" ? <><Loader2 className="animate-spin" size={20} /> Enviando...</> : "Entrar na Lista"}</button></form></>)}</motion.div></div>)}</AnimatePresence>
      <LiveHypeCounter isCookieOpen={isCookieBannerOpen} />
      <TopAnnouncementBar show={showNavbar} />
      <nav className={`fixed top-10 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-[140%]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <motion.div onClick={handleLogoClick} initial={{ opacity: 0, scale: 0.5, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="flex-shrink-0 cursor-pointer"><img src={logoGroove} alt="Groove" className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:drop-shadow-[0_0_25px_rgba(236,72,153,0.8)] transition-all duration-300" /></motion.div>
            <div className="hidden md:flex space-x-8 items-center"><button onClick={() => handleNavClick('home')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide relative group">Início<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span></button><button onClick={() => handleNavClick('spoilers')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide relative group">Coleções<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span></button><a href="#contato" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide relative group">Contato<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span></a><button onClick={() => setIsVipModalOpen(true)} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-purple-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]">Entrar na Lista VIP</button>
            <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}><ShoppingBag className="text-white hover:text-purple-500 transition-colors" /><AnimatePresence>{cartItems.length > 0 && (<motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</motion.span>)}</AnimatePresence></div></div>
            <div className="md:hidden flex items-center gap-4"><div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}><ShoppingBag className="text-white" />{cartItems.length > 0 && (<span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>)}</div><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-purple-400 transition-colors">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button></div>
          </div>
        </div>
        <AnimatePresence>{isMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-neutral-950 border-b border-neutral-900 overflow-hidden"><div className="px-4 pt-2 pb-6 space-y-4 flex flex-col items-center"><button onClick={() => handleNavClick('home')} className="text-lg font-medium text-gray-300 hover:text-white">Início</button><button onClick={() => handleNavClick('spoilers')} className="text-lg font-medium text-gray-300 hover:text-white">Coleções</button><button onClick={() => { setIsMenuOpen(false); setIsVipModalOpen(true); }} className="w-full bg-white text-black px-6 py-3 rounded-xl font-bold mt-4">Entrar na Lista VIP</button></div></motion.div>)}</AnimatePresence>
      </nav>
      
      {/* RENDERIZAÇÃO CONDICIONAL DAS PÁGINAS */}
      {currentPage === 'home' ? (
        <HomeView handleGlitterMove={handleGlitterMove} sparkles={sparkles} sectionRef={sectionRef} dynamicBackground={dynamicBackground} onOpenVip={() => setIsVipModalOpen(true)} onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />
      ) : currentPage === 'spoilers' ? (
        <SpoilersView onAddToCart={addToCart} />
      ) : currentPage === 'privacy' ? (
        <PrivacyView />
      ) : null}

      <footer className="bg-black py-16 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left mb-16"><div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start md:text-left"><img src={logoGroove} alt="Groove Footer" className="h-12 w-auto mb-4 opacity-70 grayscale hover:grayscale-0 transition-all" /></div><div><h4 className="font-bold mb-4 text-white uppercase tracking-widest text-sm">Ajuda</h4><ul className="space-y-2 text-gray-500 text-sm"><li><a href="#" className="hover:text-purple-400 transition-colors">Meus Pedidos</a></li><li><a href="#" className="hover:text-purple-400 transition-colors">Trocas e Devoluções</a></li><li><button onClick={() => handleNavClick('privacy')} className="hover:text-purple-400 transition-colors">Política de Privacidade</button></li></ul></div><div><h4 className="font-bold mb-4 text-white uppercase tracking-widest text-sm">Social</h4><div className="flex space-x-4 justify-center md:justify-start"><a href="#" className="text-gray-500 hover:text-pink-500 transition-colors"><Instagram size={24} /></a><a href="#" className="text-gray-500 hover:text-blue-500 transition-colors"><Facebook size={24} /></a></div></div></div>
          <div className="text-center mt-16"><h3 className="text-xl font-bold text-white mb-4 tracking-wide">ENTRE NO MODO GROOVE</h3><p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">Na Groove, cada movimento importa. É sobre sentir o ritmo do seu corpo, evoluir no seu tempo e treinar com confiança — dentro ou fora da academia. 💥</p></div><div className="border-t border-neutral-900 mt-16 pt-8 text-center text-gray-700 text-xs">© 2026 GROOVE. Todos os direitos reservados.</div>
        </div>
      </footer>
      <div className={`fixed right-6 z-50 flex flex-col gap-4 items-end transition-all duration-500 ease-in-out ${isCookieBannerOpen ? 'bottom-64 md:bottom-40' : 'bottom-6'}`}>
        <AnimatePresence>{showBackToTop && (<motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} onClick={scrollToTop} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg transition-colors border border-purple-400/30"><ArrowUp size={24} /></motion.button>)}</AnimatePresence>
        <a href="https://wa.me/seunumero" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform flex items-center gap-2 group"><MessageCircle size={28} fill="white" className="text-white" /><span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">Fale Conosco</span></a>
      </div>
    </div>
  );
};

export default App;