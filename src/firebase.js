import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// ⚠️ ATENÇÃO: Você precisa colar as chaves do seu projeto aqui!
// Você encontra isso no painel do Firebase > Engrenagem (Configurações do projeto) > Geral > Seus aplicativos
const firebaseConfig = {
 apiKey: "AIzaSyDh1wky8GaSK1Z13DT1kWHefAB7csf0orM",
  authDomain: "groovenation-448d9.firebaseapp.com",
  projectId: "groovenation-448d9",
  storageBucket: "groovenation-448d9.firebasestorage.app",
  messagingSenderId: "484839992777",
  appId: "1:484839992777:web:381f55649bbfc05a8f4c18"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o banco de dados (que o Dashboard vai usar)
export const db = getFirestore(app);

// Exporta as funções (que o Checkout de pagamento vai usar)
export const functions = getFunctions(app);