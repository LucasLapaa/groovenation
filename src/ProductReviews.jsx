import React, { useState, useEffect } from 'react';
import { Star, Send, User } from 'lucide-react';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; // Confirme se o caminho do seu firebase.js está correto
import toast from 'react-hot-toast';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. BUSCAR AVALIAÇÕES NO FIREBASE EM TEMPO REAL
  // 1. BUSCAR AVALIAÇÕES NO FIREBASE EM TEMPO REAL
  useEffect(() => {
    if (!productId) return;

    // Removemos temporariamente o orderBy para testar se é falta de índice
    const q = query(
      collection(db, 'avaliacoes'),
      where('productId', '==', productId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Ordenamos manualmente via JavaScript para evitar erros de índice do Firebase
      const sortedReviews = fetchedReviews.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date();
        const dateB = b.createdAt?.toDate() || new Date();
        return dateB - dateA; // Mais recentes primeiro
      });

      setReviews(sortedReviews);
    }, (error) => {
      console.error("Erro no Snapshot de avaliações:", error);
    });

    return () => unsubscribe();
  }, [productId]);
  // 2. SALVAR NOVA AVALIAÇÃO NO FIREBASE
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      toast.error('Preencha seu nome e o comentário!');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'avaliacoes'), {
        productId: productId,
        name: newReview.name,
        comment: newReview.comment,
        rating: newReview.rating,
        createdAt: serverTimestamp(),
      });

      toast.success('Avaliação enviada com sucesso!');
      setNewReview({ name: '', comment: '', rating: 5 }); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      toast.error('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para formatar a data do Firebase
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Agora mesmo';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
        Avaliações da Galera <span className="text-purple-500 text-sm">({reviews.length})</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* LADO ESQUERDO: LISTA DE AVALIAÇÕES */}
        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm italic border border-neutral-800 border-dashed p-6 rounded-lg text-center">
              Seja o primeiro a avaliar esta peça.
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                      <User size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold uppercase tracking-widest">{review.name}</p>
                      <p className="text-gray-500 text-[10px]">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? "text-purple-500 fill-purple-500" : "text-neutral-700"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* LADO DIREITO: FORMULÁRIO DE AVALIAÇÃO */}
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-lg h-fit sticky top-24">
          <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">Deixe sua avaliação</h4>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Selecionador de Estrelas */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Nota:</span>
              <div className="flex gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`transition-colors ${star <= newReview.rating ? "text-purple-500 fill-purple-500" : "text-neutral-700 hover:text-purple-400"}`} 
                  />
                ))}
              </div>
            </div>

            <div>
              <input 
                type="text" 
                placeholder="SEU NOME" 
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded px-4 py-3 text-xs uppercase tracking-widest focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
            
            <div>
              <textarea 
                placeholder="O QUE ACHOU DA PEÇA? O CAIMENTO É BOM?" 
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="4"
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : (
                <>Publicar Avaliação <Send size={14} /></>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}