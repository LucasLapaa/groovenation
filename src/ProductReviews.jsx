import React, { useState } from 'react';
import { Star, Camera, MessageSquare, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductReviews = () => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock de avaliações (Prova Social inicial)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Marcos V.",
      date: "Há 2 dias",
      rating: 5,
      text: "Tecido absurdo! Caimento perfeito pra quem treina pesado. A estética old school é real, virou minha farda de treino.",
      photo: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop",
      verified: true
    },
    {
      id: 2,
      name: "Rafael T.",
      date: "Há 1 semana",
      rating: 5,
      text: "Comprei a oversized dark e a qualidade superou as expectativas. Pode amassar no treino que a peça aguenta.",
      photo: null,
      verified: true
    }
  ]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simula o tempo de envio para o banco de dados
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        name: "Você",
        date: "Agora mesmo",
        rating: rating,
        text: comment,
        photo: photoPreview,
        verified: true
      };
      
      setReviews([newReview, ...reviews]);
      setComment('');
      setPhotoPreview(null);
      setRating(5);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 border-t border-neutral-800 mt-12">
      
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare className="text-purple-500" size={28} />
        <h2 className="text-3xl font-black text-white italic tracking-widest uppercase">
          Avaliações da Tropa
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* LADO ESQUERDO: FORMULÁRIO DE AVALIAÇÃO */}
        <div className="md:col-span-1 bg-neutral-900/50 p-6 rounded-lg border border-neutral-800 h-fit">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Deixe seu Review</h3>
          
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="bg-green-500/10 border border-green-500/30 p-6 rounded text-center flex flex-col items-center gap-2"
              >
                <CheckCircle2 className="text-green-500" size={32} />
                <p className="text-green-500 font-bold uppercase tracking-widest text-xs">Avaliação enviada!</p>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmitReview} className="flex flex-col gap-4"
              >
                
                {/* SELETOR DE ESTRELAS */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Nota</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-all focus:outline-none"
                      >
                        <Star 
                          size={24} 
                          className={(hoverRating || rating) >= star ? "fill-yellow-500 text-yellow-500" : "text-neutral-700"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* CAMPO DE TEXTO */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Comentário</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Como ficou o caimento da peça?"
                    className="w-full bg-black border border-neutral-800 rounded p-3 text-sm text-white focus:border-purple-500 outline-none transition-colors resize-none h-24"
                    required
                  />
                </div>

                {/* UPLOAD DE FOTO */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Foto do Shape (Opcional)</label>
                  
                  {!photoPreview ? (
                    <label className="w-full border border-dashed border-neutral-700 hover:border-purple-500 bg-black p-4 rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                      <Camera size={20} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Adicionar Imagem</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  ) : (
                    <div className="relative w-full h-32 rounded border border-neutral-700 overflow-hidden group">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setPhotoPreview(null)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="text-white text-xs uppercase tracking-widest font-bold">Remover</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* BOTÃO ENVIAR */}
                <button 
                  type="submit" 
                  disabled={isSubmitting || !comment.trim()}
                  className="w-full bg-white hover:bg-gray-200 disabled:opacity-50 text-black transition-all font-black py-3 rounded tracking-widest uppercase text-xs mt-2"
                >
                  {isSubmitting ? 'Enviando...' : 'Publicar Avaliação'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* LADO DIREITO: LISTA DE AVALIAÇÕES */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {reviews.map((review) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={review.id} 
              className="bg-black p-6 rounded-lg border border-neutral-800 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white uppercase tracking-widest">{review.name}</span>
                    {review.verified && (
                      <span className="bg-green-500/10 text-green-500 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border border-green-500/20">
                        Compra Verificada
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 text-[10px] uppercase tracking-widest">{review.date}</span>
                </div>
                
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className={review.rating >= star ? "fill-yellow-500 text-yellow-500" : "text-neutral-800"} />
                  ))}
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {review.text}
              </p>

              {review.photo && (
                <div className="mt-2">
                  <div className="w-24 h-24 rounded border border-neutral-700 overflow-hidden cursor-pointer hover:border-purple-500 transition-colors">
                    <img src={review.photo} alt="Review do cliente" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default ProductReviews;