import React from 'react';
import { motion } from 'framer-motion';
// Importe a sua logo real aqui
import logoGroove from './assets/groove.png';

const MaintenanceView = () => {
  return (
    <div className="h-[100dvh] w-full bg-black flex flex-col items-center justify-between relative overflow-hidden font-sans">
      
      {/* --- CAMADA 1: TEXTURA DE RUÍDO SUTIL --- */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      {/* --- CAMADA 2: "RESPIRAÇÃO" DE LUZ NO FUNDO --- */}
      <motion.div 
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-purple-900/40 blur-[130px] md:blur-[180px] rounded-full pointer-events-none"
      />

      {/* Espaçamento superior dinâmico */}
      <div className="w-full flex-1" />

      {/* --- CONTEÚDO CENTRAL: O FOCO --- */}
      <div className="relative z-10 flex flex-col items-center w-full px-6">
        
        {/* Logo imponente aparecendo lentamente */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} 
          className="mb-12 md:mb-16"
        >
          <img 
            src={logoGroove} 
            alt="GROOVE Logo" 
            className="w-32 sm:w-48 md:w-64 h-auto drop-shadow-[0_0_40px_rgba(147,51,234,0.3)]"
          />
        </motion.div>

        {/* A Frase de Impacto */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full"
        >
          <h1 className="text-white font-black text-[1.75rem] sm:text-4xl md:text-5xl lg:text-7xl uppercase tracking-[0.05em] md:tracking-[0.1em] mb-6 leading-[1.1]">
            O silêncio forja <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-800">
              os campeões.
            </span>
          </h1>
          
          <p className="text-neutral-500 text-[10px] md:text-sm font-medium tracking-[0.2em] md:tracking-[0.3em] max-w-lg mx-auto uppercase leading-relaxed">
            Nossa maior coleção está sendo esculpida nos bastidores.
          </p>
        </motion.div>
      </div>

      {/* --- RODAPÉ E BOTÃO MINIMALISTA (AJUSTADO MAIS PARA BAIXO) --- */}
      {/* pb-6 em vez de pb-10 deixa ele mais próximo do limite inferior da tela */}
      <div className="w-full flex-1 flex flex-col items-center justify-end pb-6 z-10 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <a
            href="https://wa.me/5516988265500"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center px-10 py-4 border border-neutral-800 hover:border-purple-500 transition-colors duration-700 overflow-hidden"
          >
            <div className="absolute inset-0 bg-purple-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            
            <span className="relative z-10 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all duration-500">
              Acesso Restrito
            </span>
          </a>
        </motion.div>

        {/* Linha de assinatura da marca (margem mt-6 em vez de mt-12 para não empurrar o botão muito pra cima) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="mt-6 flex items-center gap-4 md:gap-6"
        >
          <span className="h-[1px] w-6 md:w-12 bg-neutral-800" />
          <span className="text-neutral-600 text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-black">
            Groove Nation
          </span>
          <span className="h-[1px] w-6 md:w-12 bg-neutral-800" />
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenanceView;