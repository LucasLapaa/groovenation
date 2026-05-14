require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer"); // <-- O nosso novo carteiro

admin.initializeApp();
const db = admin.firestore();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Configuração do servidor de e-mail (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// 1. FUNÇÃO: CRIA O PAGAMENTO
// ==========================================
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  try {
    const valorRecebido = data.total || (data.data && data.data.total);
    const itensRecebidos = data.items || (data.data && data.data.items);
    
    // 👇 Essa linha pega exatamente o botão que o cliente clicou no carrinho
    const metodoEscolhido = data.method || (data.data && data.data.method) || ["card"]; 
    
    if (!valorRecebido || isNaN(valorRecebido)) throw new Error("Valor do carrinho inválido.");

    const amount = Math.round(parseFloat(valorRecebido) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "brl",
      // 👇 E injeta a escolha aqui para o Stripe saber o que mostrar!
      payment_method_types: metodoEscolhido, 
      metadata: {
        produtos: itensRecebidos || "Itens não especificados",
        loja: "Groove Nation Official"
      }
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// ==========================================
// 2. FUNÇÃO: WEBHOOK (Avisa da venda e envia e-mail)
// ==========================================
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Erro de Assinatura:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const valorEmReais = (paymentIntent.amount / 100).toFixed(2).replace('.', ',');
    const itensComprados = paymentIntent.metadata.produtos;

    console.log("💰 Pagamento Confirmado:", paymentIntent.id);

    // 1. Salva no Banco de Dados
    await db.collection("pedidos").doc(paymentIntent.id).set({
      pedidoId: paymentIntent.id,
      valorTotal: paymentIntent.amount / 100,
      status: "PAGO",
      itens: itensComprados,
      email: paymentIntent.receipt_email || "Email não informado",
      data: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Dispara o E-mail de Notificação
    const mailOptions = {
      from: `"Groove Nation" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Manda para você mesmo
      subject: `🔥 NOVA VENDA: R$ ${valorEmReais} na Groove Nation!`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #171717; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #a855f7;">Opa! Caiu uma venda! 💸</h2>
          <p style="font-size: 16px;">O pagamento foi aprovado com sucesso no Stripe.</p>
          <hr style="border: 1px solid #333;" />
          <h3>📦 Detalhes do Pedido:</h3>
          <ul>
            <li style="margin-bottom: 10px;"><strong>Valor:</strong> R$ ${valorEmReais}</li>
            <li style="margin-bottom: 10px;"><strong>Itens:</strong> ${itensComprados}</li>
            <li style="margin-bottom: 10px;"><strong>ID do Pedido:</strong> ${paymentIntent.id}</li>
          </ul>
          <hr style="border: 1px solid #333;" />
          <p style="color: #999; font-size: 12px;">Acesse o painel do Stripe ou seu Firestore para ver o endereço de entrega.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("📧 E-mail de alerta enviado com sucesso!");
    } catch (emailError) {
      console.error("⚠️ Erro ao enviar e-mail:", emailError);
    }
  }

  res.json({ received: true });
});