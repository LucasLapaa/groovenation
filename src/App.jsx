import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
// IMPORTANTE: Importar o EmailJS
import emailjs from '@emailjs/browser';
import { Menu, X, MessageCircle, Instagram, Facebook, Clock, ArrowUp, ShieldCheck, RefreshCw, Layers, Printer, Mail, CheckCircle, Loader2, Zap, Lock, ChevronDown, Terminal } from 'lucide-react';

// Importando a logo
import logoGroove from './assets/groove.png';

// --- COMPONENTE EASTER EGG (SECRET MODAL) ---
const SecretModal = ({ onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md font-mono p-4"
  >
    <motion.div 
      initial={{ scale: 0.8, rotateX: 90 }} animate={{ scale: 1, rotateX: 0 }}
      className="max-w-md w-full bg-neutral-950 border-2 border-green-500 rounded-xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.3)]"
    >
      {/* Efeito de Scanline (Linhas de TV antiga) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none background-size-[100%_2px,3px_100%]"></div>
      
      <div className="relative z-10 text-center">
        <div className="flex justify-center mb-4">
          <Terminal className="text-green-500 w-16 h-16 animate-pulse" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-green-500 mb-2 tracking-tighter">
          SYSTEM UNLOCKED
        </h2>
        <p className="text-green-400/80 text-sm mb-8 typing-effect">
          Você encontrou a área secreta da Groove.
        </p>

        <div className="bg-green-900/10 border border-green-500/30 p-6 rounded-lg mb-8 dashed-border">
          <p className="text-green-600 text-xs uppercase tracking-[0.2em] mb-2">Cupom de Fundador</p>
          <p className="text-3xl font-bold text-white tracking-widest select-all cursor-text">
            SECRETGROOVE
          </p>
          <p className="text-[10px] text-green-500/60 mt-2">15% OFF em toda a loja</p>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-4 rounded transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
        >
          RESGATAR E FECHAR
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// --- COMPONENTE FAIXA INFINITA ---
const Marquee = () => {
  return (
    <div className="w-full overflow-hidden bg-neutral-900 border-y border-purple-500/20 py-4 relative z-20">
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-neutral-950 to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-neutral-950 to-transparent z-10"></div>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
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

// --- COMPONENTE CONTAGEM REGRESSIVA ---
const CountdownTimer = () => {
  const targetDate = new Date(2026, 2, 20).getTime(); 
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;
    if (difference > 0) {
      return {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / 1000 / 60) % 60),
        seg: Math.floor((difference / 1000) % 60),
      };
    }
    return { dias: 0, horas: 0, min: 0, seg: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

// --- COMPONENTE FAQ ---
const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const questions = [
    { question: "Quando será o lançamento oficial?", answer: "O drop oficial da coleção Groove 2026 acontecerá no dia 20 de Março. Cadastre-se na Lista VIP para receber o link de compra 1 hora antes de todo mundo." },
    { question: "Quais são as formas de pagamento?", answer: "Aceitamos PIX (com desconto especial), Cartão de Crédito em até 12x e Boleto Bancário. Todas as transações são criptografadas e seguras." },
    { question: "Vocês enviam para todo o Brasil?", answer: "Sim! Enviamos para todos os estados do Brasil via Correios ou Transportadoras parceiras, com código de rastreio enviado direto no seu e-mail." },
    { question: "Como sei qual é o meu tamanho?", answer: "Nossa modelagem é Oversized (mais larga). Em cada página de produto teremos uma tabela de medidas detalhada. Na dúvida, chame nosso suporte no WhatsApp!" },
    { question: "Posso trocar se não servir?", answer: "Com certeza. A primeira troca é por nossa conta. Você tem até 7 dias após o recebimento para solicitar a troca ou devolução sem burocracia." }
  ];

  return (
    <section className="py-24 bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">DÚVIDAS FREQUENTES</h2>
          <p className="text-gray-400">Tudo o que você precisa saber antes de entrar no modo Groove.</p>
        </div>
        <div className="space-y-4">
          {questions.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="border border-neutral-800 rounded-2xl bg-neutral-950/50 overflow-hidden hover:border-purple-500/30 transition-colors">
              <button onClick={() => setActiveIndex(activeIndex === index ? null : index)} className="w-full p-6 flex justify-between items-center text-left focus:outline-none">
                <span className={`font-bold text-lg ${activeIndex === index ? 'text-purple-400' : 'text-white'}`}>{item.question}</span>
                <motion.div animate={{ rotate: activeIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="text-gray-500" /></motion.div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-neutral-800/50 pt-4">{item.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- COMPONENTE PÁGINA SPOILERS ---
const SpoilersView = () => {
  const products = [
    { id: 1, name: "Oversized Chaos", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop" },
    { id: 2, name: "Urban Hoodie V2", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, name: "Night Vision Tee", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2000&auto=format&fit=crop" },
  ];

  return (
    <div className="pt-40 pb-20 min-h-screen bg-neutral-950 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-purple-500 font-bold tracking-[0.3em] text-sm uppercase">Acesso Restrito</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black text-white mt-4 tracking-tighter">SPOILER ROOM</motion.h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Uma prévia secreta do que estamos produzindo. Passe o mouse para desbloquear a visão.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-purple-500/50 transition-all">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-all duration-700 filter blur-xl grayscale group-hover:blur-0 group-hover:grayscale-0 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-transparent/20 group-hover:opacity-0">
                <Lock className="text-purple-500 w-16 h-16 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white tracking-widest">BLOQUEADO</h3>
                <p className="text-xs text-gray-400 mt-2">Passe o mouse para revelar</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-green-400 text-sm font-bold">Em Produção</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE HOME VIEW ---
const HomeView = ({ handleGlitterMove, sparkles, sectionRef, dynamicBackground, onOpenVip }) => {
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
      <FAQ />
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
  const [vipEmail, setVipEmail] = useState("");
  const [vipStatus, setVipStatus] = useState("idle"); 
  const [sparkles, setSparkles] = useState([]);

  // --- LOGICA DO EASTER EGG ---
  const [logoClicks, setLogoClicks] = useState(0);
  const [isSecretOpen, setIsSecretOpen] = useState(false);

  // Reset clicks se ficar 1s sem clicar
  useEffect(() => {
    let timer;
    if (logoClicks > 0) {
      timer = setTimeout(() => setLogoClicks(0), 1000);
    }
    if (logoClicks >= 5) {
      setIsSecretOpen(true);
      setLogoClicks(0);
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [logoClicks]);

  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1);
    handleNavClick('home'); // Também volta pra home
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 'home') setIsVipModalOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 200) setShowBackToTop(true);
      else setShowBackToTop(false);
      if (window.scrollY > lastScrollY && window.scrollY > 100) setShowNavbar(false);
      else setShowNavbar(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (!vipEmail) return;
    setVipStatus("sending");
    const templateParams = {
      user_email: vipEmail,
      message: "Novo cadastro na Lista VIP Groove", 
    };
    emailjs.send('service_shrwdbs', 'template_rdvdxrc', templateParams, 'ogHLmzkXsUuKWny8b')
    .then(() => setVipStatus("success"), () => setVipStatus("error"));
  };

  const closeVipModal = () => {
    setIsVipModalOpen(false);
    setTimeout(() => { setVipStatus("idle"); setVipEmail(""); }, 300);
  };

  const handleGlitterMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newSparkle = {
      id: Date.now() + Math.random(),
      x, y,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? '#a855f7' : '#d946ef'
    };
    setSparkles(prev => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 800);
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* --- EASTER EGG MODAL --- */}
      <AnimatePresence>
        {isSecretOpen && <SecretModal onClose={() => setIsSecretOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isVipModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeVipModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-neutral-900 border border-purple-500/30 p-8 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[50px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-600/20 blur-[50px] rounded-full pointer-events-none"></div>
              <button onClick={closeVipModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
              {vipStatus === "success" ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"><CheckCircle size={40} /></motion.div>
                  <h3 className="text-2xl font-bold mb-2">E-mail enviado!</h3>
                  <p className="text-gray-300">Confira sua caixa de entrada em <span className="text-purple-400">{vipEmail}</span>.</p>
                  <button onClick={closeVipModal} className="mt-8 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-xl font-bold transition-colors">Fechar</button>
                </div>
              ) : vipStatus === "error" ? (
                 <div className="text-center py-8">
                  <h3 className="text-2xl font-bold mb-2 text-red-500">Ops! Algo deu errado.</h3>
                  <button onClick={() => setVipStatus("idle")} className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-xl font-bold transition-colors">Tentar Novamente</button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Lista VIP Groove</h3>
                    <p className="text-gray-400 text-sm mt-2">Receba acesso antecipado e um e-mail de boas-vindas.</p>
                  </div>
                  <form onSubmit={handleVipSubmit} className="space-y-4">
                    <input type="email" required placeholder="Seu melhor e-mail" value={vipEmail} onChange={(e) => setVipEmail(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-4 text-white outline-none transition-all placeholder:text-gray-600" />
                    <button type="submit" disabled={vipStatus === "sending"} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-70 flex items-center justify-center gap-2">
                      {vipStatus === "sending" ? <><Loader2 className="animate-spin" size={20} /> Enviando...</> : "Entrar na Lista"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className={`fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32">
            <motion.div 
              onClick={handleLogoClick} // AQUI ESTÁ O GATILHO DO EASTER EGG
              initial={{ opacity: 0, scale: 0.5, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} 
              className="flex-shrink-0 cursor-pointer"
            >
              <img src={logoGroove} alt="Groove" className="h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:drop-shadow-[0_0_25px_rgba(236,72,153,0.8)] transition-all duration-300" />
            </motion.div>

            <div className="hidden md:flex space-x-8 items-center">
              <button onClick={() => handleNavClick('home')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide relative group">
                Início<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
              </button>
              <button onClick={() => handleNavClick('spoilers')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide relative group">
                Coleções<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
              </button>
              <a href="#contato" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide relative group">
                Contato<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
              </a>
              <button onClick={() => setIsVipModalOpen(true)} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-purple-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]">Entrar na Lista VIP</button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-purple-400 transition-colors">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-neutral-950 border-b border-neutral-900 overflow-hidden">
              <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col items-center">
                <button onClick={() => handleNavClick('home')} className="text-lg font-medium text-gray-300 hover:text-white">Início</button>
                <button onClick={() => handleNavClick('spoilers')} className="text-lg font-medium text-gray-300 hover:text-white">Coleções</button>
                <button onClick={() => { setIsMenuOpen(false); setIsVipModalOpen(true); }} className="w-full bg-white text-black px-6 py-3 rounded-xl font-bold mt-4">Entrar na Lista VIP</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {currentPage === 'home' ? (
        <HomeView 
          handleGlitterMove={handleGlitterMove} 
          sparkles={sparkles} 
          sectionRef={sectionRef} 
          dynamicBackground={dynamicBackground} 
          onOpenVip={() => setIsVipModalOpen(true)}
        />
      ) : (
        <SpoilersView />
      )}

      <footer className="bg-black py-16 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left mb-16">
            <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start md:text-left">
              <img src={logoGroove} alt="Groove Footer" className="h-12 w-auto mb-4 opacity-70 grayscale hover:grayscale-0 transition-all" />
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white uppercase tracking-widest text-sm">Ajuda</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Meus Pedidos</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Trocas e Devoluções</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white uppercase tracking-widest text-sm">Social</h4>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors"><Facebook size={24} /></a>
              </div>
            </div>
          </div>
          <div className="text-center mt-16">
              <h3 className="text-xl font-bold text-white mb-4 tracking-wide">ENTRE NO MODO GROOVE</h3>
              <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">Na Groove, cada movimento importa. É sobre sentir o ritmo do seu corpo, evoluir no seu tempo e treinar com confiança — dentro ou fora da academia. 💥</p>
          </div>
          <div className="border-t border-neutral-900 mt-16 pt-8 text-center text-gray-700 text-xs">© 2026 GROOVE. Todos os direitos reservados.</div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} onClick={scrollToTop} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg transition-colors border border-purple-400/30">
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
        <a href="https://wa.me/seunumero" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform flex items-center gap-2 group">
          <MessageCircle size={28} fill="white" className="text-white" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">Fale Conosco</span>
        </a>
      </div>

    </div>
  );
};

export default App;