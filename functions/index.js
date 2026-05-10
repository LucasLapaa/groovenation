const functions = require("firebase-functions");
// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config(); 

// Puxa a chave da variável de ambiente STRIPE_SECRET_KEY
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  try {
    // Tenta pegar o total tanto de data.total quanto de data.data.total
    const valorRecebido = data.total || (data.data && data.data.total);
    
    console.log("Valor bruto recebido na Function:", valorRecebido);

    if (!valorRecebido || isNaN(valorRecebido)) {
      throw new functions.https.HttpsError(
        "invalid-argument", 
        `O valor recebido não é um número válido. Recebido: ${JSON.stringify(data)}`
      );
    }

    // Stripe exige inteiros em centavos (ex: 10.50 vira 1050)
    const amount = Math.round(parseFloat(valorRecebido) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "brl",
      payment_method_types: ["card", "pix", "boleto"],
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Erro Stripe:", error.message);
    throw new functions.https.HttpsError("internal", error.message);
  }
});