require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer"); // <-- O nosso carteiro
const https = require('https');

// Importação do Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');

admin.initializeApp();
const db = admin.firestore();

// =====================================
// CONFIGURAÇÕES GERAIS (.env)
// =====================================


const mpClient = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-5158390033405118-052020-6e7f438dd3a74840a8371d9c8ef8fb3b-3239789766', 
  options: { timeout: 5000 } 
});

// Configuração do servidor de e-mail (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// =====================================
// FUNÇÃO: CRIAR PAGAMENTO MERCADO PAGO
// =====================================
// =====================================
// FUNÇÃO: CRIAR PAGAMENTO MERCADO PAGO
// =====================================
exports.criarPreferenciaMercadoPago = functions.https.onCall(async (data, context) => {
  try {
    // 1. O Pulo do Gato: Pega os dados, não importa como o Firebase tenha "embrulhado"
    const payload = data.data ? data.data : data;
    
    const { total, items, orderId, customer } = payload;

    // 2. Força o total a virar um número absoluto (evita erro se vier como texto)
    const precoFinal = Number(total);

    // 3. Trava de segurança com raio-X
    if (isNaN(precoFinal) || precoFinal <= 0) {
      throw new Error(`Valor zerado ou em formato errado. O que chegou foi: ${total}`);
    }

    const preference = new Preference(mpClient);

    const response = await preference.create({
      body: {
        items: [
          {
            id: orderId || "GN-000",
            title: 'Pedido Groove Nation',
            description: items || "Roupas",
            quantity: 1,
            unit_price: precoFinal,
            currency_id: 'BRL'
          }
        ],
        payer: {
          name: customer?.nome || "Cliente Groove",
          email: 'contato@groovenation.com.br',
        },
        back_urls: {
          success: "https://groovenation.com.br", 
          failure: "https://groovenation.com.br",
          pending: "https://groovenation.com.br"
        },
        auto_return: "approved",
        external_reference: orderId
      }
    });

    return { initPoint: response.init_point };
  } catch (error) {
    let erroDetalhado = error.message;
    if (error.cause) erroDetalhado += " | Motivo: " + JSON.stringify(error.cause); 
    
    console.error("Erro interno do servidor:", erroDetalhado);
    throw new functions.https.HttpsError('internal', `Motivo do bloqueio: ${erroDetalhado}`);
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

const axios = require('axios');

// =====================================
// FUNÇÃO 2: MELHOR ENVIO (BLINDAGEM TOTAL)
// =====================================
exports.calcularFrete = functions.https.onCall((data, context) => {
  const payload = data.cepDestino ? data : (data.data || {});
  const cepDestino = payload.cepDestino;
  const itens = payload.itens || [];

  if (!cepDestino) {
    throw new functions.https.HttpsError('invalid-argument', 'O CEP de destino é obrigatório.');
  }

  const deparaProdutos = itens.map((item) => ({
    id: item.id || 'gn-item',
    width: 11,
    height: 2 * (item.quantity || 1),
    length: 16,
    weight: 0.3 * (item.quantity || 1), 
    insurance_value: (item.price || 0) * (item.quantity || 1),
    quantity: item.quantity || 1
  }));

  const requestBody = JSON.stringify({
    from: { postal_code: '11310000' },
    to: { postal_code: cepDestino.replace(/\D/g, '') },
    products: deparaProdutos
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'sandbox.melhorenvio.com.br',
      path: '/api/v2/me/shipment/calculate',
      method: 'POST',
      headers: {
        'Accept': 'application/json', // 👈 ISTO OBRIGA ELES A RESPONDEREM CERTO
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiJkYTU3ZjY5MDNmYmI5YTI3YTkyNDJhMWFjZWY3MzVjODFiNjdhYmM1MTY0ZGFiMzdlNjU3NjBlNGEwMjAwZGNjMDZhMWNjODE5YTA5NDFlMiIsImlhdCI6MTc3OTA2Mjg3My42NTk1NTgsIm5iZiI6MTc3OTA2Mjg3My42NTk1NiwiZXhwIjoxODEwNTk4ODczLjY1MDU5Niwic3ViIjoiYTFjZGY2MTktMGNiMy00MTU4LWI4MTMtZDA0YWE1ZjY0MDg5Iiwic2NvcGVzIjpbImNhcnQtcmVhZCIsImNhcnQtd3JpdGUiLCJjb21wYW5pZXMtcmVhZCIsImNvbXBhbmllcy13cml0ZSIsImNvdXBvbnMtcmVhZCIsImNvdXBvbnMtd3JpdGUiLCJub3RpZmljYXRpb25zLXJlYWQiLCJvcmRlcnMtcmVhZCIsInByb2R1Y3RzLXJlYWQiLCJwcm9kdWN0cy1kZXN0cm95IiwicHJvZHVjdHMtd3JpdGUiLCJwdXJjaGFzZXMtcmVhZCIsInNoaXBwaW5nLWNhbGN1bGF0ZSIsInNoaXBwaW5nLWNhbmNlbCIsInNoaXBwaW5nLWNoZWNrb3V0Iiwic2hpcHBpbmctY29tcGFuaWVzIiwic2hpcHBpbmctZ2VuZXJhdGUiLCJzaGlwcGluZy1wcmV2aWV3Iiwic2hpcHBpbmctcHJpbnQiLCJzaGlwcGluZy1zaGFyZSIsInNoaXBwaW5nLXRyYWNraW5nIiwiZWNvbW1lcmNlLXNoaXBwaW5nIiwidHJhbnNhY3Rpb25zLXJlYWQiLCJ1c2Vycy1yZWFkIiwidXNlcnMtd3JpdGUiLCJ3ZWJob29rcy1yZWFkIiwid2ViaG9va3Mtd3JpdGUiLCJ3ZWJob29rcy1kZWxldGUiLCJ0ZGVhbGVyLXdlYmhvb2siXX0.TLLCI5jw4WLqbsaDNwH9XYmlODmFTH8s9B3a9cnPm_ylaKkN8rDhf2l5gId5fyMtV01zVUI_cBIyI3f79b94VKWHmErhce0zc06WSHYXOgKoZiGoreUbYomgR_8DTy8p3y4SB095aC3VcPERo0UYziy8NNdaHuUh-qG5X7WjrpGQAsdHZZ5Qjehm8HGgL8w1RbcliVYMWE2i1_RkyoPh732U4gRK5-QTYuoI3P1TZJJ4pHRjKk8OX2Md6SRxNkpo7FKTo58BKEl1w3aIh50SDGe44ip1JnUPb0eLpx067wDTM6g8n5IXHDsVNPNatep8UHikCfD_F6kcqw_bOuxagSdZKV4uTwdqNOWnu7Aem4AQCdHNSCIQ2v1Hllk3hxQDhVLbfRtj8QnzY2U43hbIfIwMads332PqZyTLqX0hf_LyXyFvoAb8U-tFrtoPMinOIYXLJxAa3d2yT04HVPUtVs7P-KbwadwyOrRiwZewvo0O33swgHym7Ih-PYYsYxV444rchvjKFxsa3RKa6TQsshWE8k46smxG2ypgMm9KXY8siJwCAwXgTHDWa9bbegR8phO6D0R2Zu5SvY9zToiNjduuMyAEHXD6yxo5U8gjtFVnSuNzD_IL4jqUJaNzqXxTYS1Ss3GVSbvv2Y7Gb1bNK-NFzU_xW54h5XPOH9w50HI',      
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
        'User-Agent': 'GrooveNation App (contato@groovenation.com.br)'
      }
    }, (res) => {
      let body = '';
      
      res.on('data', (chunk) => { body += chunk; });
      
      res.on('end', () => {
        try {
          // Tenta ler a resposta
          const responseData = JSON.parse(body);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const fretesValidos = responseData.filter(frete => !frete.error);
            resolve({ fretes: fretesValidos });
          } else {
            console.error('Erro retornado pelo Melhor Envio:', responseData);
            resolve({ fretes: [] }); // Retorna vazio em vez de dar erro vermelho
          }
        } catch (e) {
          // Se eles não mandarem JSON (ex: página HTML de erro), a gente captura aqui!
          console.error('Resposta bizarra do Melhor Envio (Não é JSON):', body);
          resolve({ fretes: [] }); // Retorna vazio em vez de crashar o site
        }
      });
    });

    req.on('error', (e) => {
      console.error('Falha de rede:', e);
      reject(new functions.https.HttpsError('internal', 'Erro de rede.'));
    });

    req.write(requestBody);
    req.end();
  });
});