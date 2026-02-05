
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react'; // Adicione useRef aqui
// IMPORTANTE: Importar o EmailJS
import emailjs from '@emailjs/browser';
import { Menu, X, MessageCircle, Instagram, Facebook, Clock, ArrowUp, ShieldCheck, RefreshCw, Layers, Printer, Mail, CheckCircle, Loader2 } from 'lucide-react';

// Importando a logo
import logoGroove from './assets/groove.png';

const App = () => {
  // --- LÓGICA DO SCROLL BACKGROUND ---
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end start"] // Começa quando a seção entra, termina quando sai
  });

  // Transforma o scroll (0 a 1) em porcentagem do gradiente (de 40% para 120%)
  // Isso faz o preto "empurrar" o roxo para fora
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ["40%", "140%"]);
  
  // Cria o template do background que muda sozinho
  const dynamicBackground = useMotionTemplate`linear-gradient(135deg, #050505 ${gradientPosition}, #9333ea ${gradientPosition}, #000000 100%)`;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // --- ESTADOS DO MODAL VIP ---
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipEmail, setVipEmail] = useState("");
  const [vipStatus, setVipStatus] = useState("idle"); // 'idle' | 'sending' | 'success' | 'error'

  // --- ESTADO DO GLITTER ---
  const [sparkles, setSparkles] = useState([]);

  // --- POPUP AUTOMÁTICO ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVipModalOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // --- LÓGICA DE SCROLL ---
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // --- FUNÇÃO DE ENVIAR EMAIL (REAL COM EMAILJS) ---
  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (!vipEmail) return;

    setVipStatus("sending");

    const templateParams = {
      user_email: vipEmail,
      message: "Novo cadastro na Lista VIP Groove (Via Popup Automático)", 
    };

    emailjs.send(
      'service_shrwdbs',   // SEU SERVICE ID
      'template_rdvdxrc',  // SEU TEMPLATE ID
      templateParams,
      'ogHLmzkXsUuKWny8b'  // SUA PUBLIC KEY
    )
    .then((response) => {
       console.log('SUCCESS!', response.status, response.text);
       setVipStatus("success");
    }, (err) => {
       console.log('FAILED...', err);
       setVipStatus("error");
    });
  };

  const closeVipModal = () => {
    setIsVipModalOpen(false);
    setTimeout(() => {
      setVipStatus("idle");
      setVipEmail("");
    }, 300);
  };

  // --- FUNÇÃO DO GLITTER MOUSE ---
  const handleGlitterMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSparkle = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? '#a855f7' : '#d946ef'
    };

    setSparkles(prev => [...prev, newSparkle]);

    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 800);
  };

  // Variantes de Animação
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* --- MODAL VIP --- */}
      <AnimatePresence>
        {isVipModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeVipModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-neutral-900 border border-purple-500/30 p-8 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[50px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-600/20 blur-[50px] rounded-full pointer-events-none"></div>

              <button onClick={closeVipModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              {vipStatus === "success" ? (
                <div className="text-center py-8">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
                  >
                    <CheckCircle size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">E-mail enviado!</h3>
                  <p className="text-gray-300">
                    Confira sua caixa de entrada em <span className="text-purple-400">{vipEmail}</span>.
                  </p>
                  <button onClick={closeVipModal} className="mt-8 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-xl font-bold transition-colors">
                    Fechar
                  </button>
                </div>
              ) : vipStatus === "error" ? (
                 <div className="text-center py-8">
                  <h3 className="text-2xl font-bold mb-2 text-red-500">Ops! Algo deu errado.</h3>
                  <p className="text-gray-300 mb-6">
                    Não conseguimos enviar o e-mail. Tente novamente mais tarde.
                  </p>
                  <button onClick={() => setVipStatus("idle")} className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-xl font-bold transition-colors">
                    Tentar Novamente
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Lista VIP Groove</h3>
                    <p className="text-gray-400 text-sm mt-2">
                      Receba acesso antecipado e um e-mail de boas-vindas agora mesmo.
                    </p>
                  </div>

                  <form onSubmit={handleVipSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="email" 
                        required
                        placeholder="Seu melhor e-mail" 
                        value={vipEmail}
                        onChange={(e) => setVipEmail(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-4 text-white outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={vipStatus === "sending"}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {vipStatus === "sending" ? (
                        <>
                          <Loader2 className="animate-spin" size={20} /> Enviando...
                        </>
                      ) : (
                        "Entrar na Lista"
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- NAVBAR --- */}
      <nav 
        className={`fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <img 
                src={logoGroove} 
                alt="Groove" 
                className="h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:drop-shadow-[0_0_25px_rgba(236,72,153,0.8)] transition-all duration-300"
              />
            </motion.div>

            <div className="hidden md:flex space-x-8 items-center">
              {['Início', 'Sobre', 'Coleções', 'Contato'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
                </a>
              ))}
              <button onClick={() => setIsVipModalOpen(true)} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-purple-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Entrar na Lista VIP
              </button>
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-neutral-950 border-b border-neutral-900 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col items-center">
                {['Início', 'Sobre', 'Coleções', 'Contato'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="text-lg font-medium text-gray-300 hover:text-white">
                    {item}
                  </a>
                ))}
                <button onClick={() => { setIsMenuOpen(false); setIsVipModalOpen(true); }} className="w-full bg-white text-black px-6 py-3 rounded-xl font-bold mt-4">
                  Entrar na Lista VIP
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden pt-28 bg-neutral-950">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-purple-900/40 via-neutral-950/0 to-transparent blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-neutral-950/0 to-transparent blur-[120px]"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.08] blur-sm scale-150 animate-pulse duration-[4s]" style={{ backgroundImage: `url(${logoGroove})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950"></div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span variants={fadeInUp} className="inline-block py-1 px-4 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold tracking-[0.2em] mb-6 border border-purple-500/30 uppercase shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            Coleção Groove 2026
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl">
            SUA <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-white animate-pulse">VIBE.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed text-shadow-sm">
            Não vestimos corpos, vestimos atitude. Descubra o streetwear que acompanha o seu ritmo.
          </motion.p>
        </motion.div>
      </section>

      {/* --- SEÇÃO SOBRE --- */}
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
                <div>
                  <p className="text-sm text-gray-400">Tempo de produção</p>
                  <p className="text-white font-bold">3 a 5 dias úteis + Envio</p>
                </div>
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

      {/* --- SEÇÃO LANÇAMENTO (COM EFEITO SCROLL QUE COBRE O ROXO) --- */}
      <motion.section
        id="colecoes"
        ref={sectionRef} // Conecta ao sensor de scroll
        className="py-32 relative overflow-hidden flex items-center justify-center"
        style={{
          background: dynamicBackground, // O fundo muda conforme o mouse desce
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
        }}
      >
        {/* Textura sutil */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/5 rounded-full animate-pulse border border-white/10">
                <Clock className="text-white w-12 h-12" />
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
              LANÇAMENTO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">IMINENTE</span>
            </h2>

            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
              Estamos nos bastidores preparando uma coleção que une o estilo <span className="font-bold text-white">minimalista</span> ao seu dia a dia <span className="font-bold text-white">intenso</span>.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <div className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm md:text-base tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-lg shadow-purple-900/50">
                  Aguarde. Vale a pena.
                </div>
            </motion.div>

          </motion.div>
        </div>
      </motion.section>

      {/* --- SEÇÃO CONTATO (COM GLITTER MOUSE) --- */}
      <section 
        id="contato" 
        onMouseMove={handleGlitterMove} 
        className="py-32 relative overflow-hidden flex items-center justify-center group"
      >
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  left: sparkle.x,
                  top: sparkle.y,
                  width: sparkle.size,
                  height: sparkle.size,
                  backgroundColor: sparkle.color,
                  borderRadius: '50%',
                  boxShadow: `0 0 10px ${sparkle.color}, 0 0 20px ${sparkle.color}`
                }}
              />
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
            <div className="bg-white/10 p-6 rounded-full backdrop-blur-md border border-white/20 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              <MessageCircle className="text-white drop-shadow-md" size={48} />
            </div>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
            PRECISA DE UM <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">HELP?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Nosso time de estilo está online agora para te ajudar com tamanhos, trocas ou dúvidas.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,211,102,0.3)] border border-green-400/30 group">
              <MessageCircle size={24} className="group-hover:animate-bounce" />
              Chamar no WhatsApp
            </button>
            <button className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all backdrop-blur-md border border-white/20 hover:border-white/40">
              <Mail size={24} />
              Enviar E-mail
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER (REORGANIZADO) --- */}
      <footer className="bg-black py-16 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid Superior: Logo e Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left mb-16">
            
            {/* COLUNA 1: LOGO (Esquerda no Desktop) */}
            <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start md:text-left">
              <img src={logoGroove} alt="Groove Footer" className="h-12 w-auto mb-4 opacity-70 grayscale hover:grayscale-0 transition-all" />
            </div>

            {/* COLUNA 2: Ajuda */}
            <div>
              <h4 className="font-bold mb-4 text-white uppercase tracking-widest text-sm">Ajuda</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Meus Pedidos</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Trocas e Devoluções</a></li>
              </ul>
            </div>
            {/* COLUNA 3: Social */}
            <div>
              <h4 className="font-bold mb-4 text-white uppercase tracking-widest text-sm">Social</h4>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors"><Facebook size={24} /></a>
              </div>
            </div>
          </div>

          {/* --- NOVA SEÇÃO CENTRALIZADA (Título e Frase) --- */}
          <div className="text-center mt-16">
              <h3 className="text-xl font-bold text-white mb-4 tracking-wide">ENTRE NO MODO GROOVE</h3>
              <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Na Groove, cada movimento importa. É sobre sentir o ritmo do seu corpo, evoluir no seu tempo e treinar com confiança — dentro ou fora da academia. 💥
              </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-neutral-900 mt-16 pt-8 text-center text-gray-700 text-xs">© 2026 GROOVE. Todos os direitos reservados.</div>
        </div>
      </footer>

      {/* --- FLUTUANTES --- */}
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