const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

// Base de dados em memória para armazenar mensagens
let messageDatabase = [];
let sentMessages = [];
let botConfig = {
  autoReplyEnabled: true,
  autoReplyMessage: "Olá! 👋 Obrigado pela sua mensagem. Estou em atendimento automático no momento. Em breve responderei sua mensagem com mais detalhes. Tenha um ótimo dia! 😊",
  soundNotificationEnabled: true,
  ownerPhone: process.env.OWNER_PHONE || "5511913274243"
};

// Rota principal - serve o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== WEBHOOK - Receber Mensagens ====================
// Funciona tanto com Twilio quanto em modo simulado

app.post('/webhook/messages', (req, res) => {
  try {
    let phoneNumber = req.body.From || req.body.phone || req.body.phoneNumber;
    let messageText = req.body.Body || req.body.message || req.body.text || '';

    // Se vier do Twilio, remove o prefixo 'whatsapp:'
    if (phoneNumber && phoneNumber.includes('whatsapp:')) {
      phoneNumber = phoneNumber.replace('whatsapp:', '');
    }

    if (!phoneNumber || !messageText) {
      return res.status(400).json({ error: 'Telefone e mensagem são obrigatórios' });
    }

    // Criar objeto de mensagem
    const newMessage = {
      id: Date.now(),
      from: phoneNumber,
      message: messageText,
      timestamp: new Date().toLocaleString('pt-BR'),
      media: req.body.MediaUrl0 || null,
      replied: false
    };

    // Adicionar ao banco de dados
    messageDatabase.push(newMessage);
    console.log(`📨 Mensagem recebida de ${phoneNumber}: ${messageText}`);

    // Enviar resposta automática se habilitada
    if (botConfig.autoReplyEnabled) {
      const replyMessage = botConfig.autoReplyMessage;
      
      sentMessages.push({
        id: Date.now() + 1,
        to: phoneNumber,
        message: replyMessage,
        timestamp: new Date().toLocaleString('pt-BR'),
        status: 'enviado'
      });

      newMessage.replied = true;
      console.log(`✅ Resposta automática enviada para ${phoneNumber}`);
    }

    // Responder ao Twilio (se for Twilio)
    if (req.headers['x-twilio-signature']) {
      res.status(200).send('<Response></Response>');
    } else {
      res.json({ success: true, message: 'Mensagem recebida com sucesso!' });
    }
  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

// ==================== API - MENSAGENS ====================

// GET - Obter todas as mensagens recebidas
app.get('/api/messages', (req, res) => {
  res.json(messageDatabase);
});

// DELETE - Limpar todas as mensagens
app.delete('/api/messages', (req, res) => {
  messageDatabase = [];
  res.json({ success: true, message: 'Mensagens limpas' });
});

// DELETE - Deletar mensagem específica
app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  messageDatabase = messageDatabase.filter(msg => msg.id !== parseInt(id));
  res.json({ success: true });
});

// ==================== API - CONFIGURAÇÃO ====================

// GET - Obter configurações do bot
app.get('/api/config', (req, res) => {
  res.json(botConfig);
});

// POST - Atualizar configurações do bot
app.post('/api/config', (req, res) => {
  const { autoReplyEnabled, autoReplyMessage, ownerPhone } = req.body;
  
  if (typeof autoReplyEnabled === 'boolean') botConfig.autoReplyEnabled = autoReplyEnabled;
  if (autoReplyMessage) botConfig.autoReplyMessage = autoReplyMessage;
  if (ownerPhone) botConfig.ownerPhone = ownerPhone;
  
  console.log('⚙️ Configurações atualizadas:', botConfig);
  res.json({ success: true, config: botConfig });
});

// ==================== API - ENVIAR RESPOSTAS ====================

// POST - Enviar resposta manual para um contato
app.post('/api/send-reply', (req, res) => {
  const { phoneNumber, message } = req.body;
  
  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Telefone e mensagem são obrigatórios' });
  }

  try {
    // Registrar a mensagem enviada
    sentMessages.push({
      id: Date.now(),
      to: phoneNumber,
      message: message,
      timestamp: new Date().toLocaleString('pt-BR'),
      status: 'enviado'
    });

    console.log(`💬 Mensagem enviada para ${phoneNumber}: ${message}`);
    res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obter mensagens enviadas
app.get('/api/sent-messages', (req, res) => {
  res.json(sentMessages);
});

// ==================== API - TESTE ====================

// POST - Simular receber uma mensagem (para teste!)
app.post('/api/test-message', (req, res) => {
  const { phoneNumber, message } = req.body;
  
  const defaultPhone = '5511987654321';
  const defaultMessage = 'Olá! Essa é uma mensagem de teste! 🤖';

  const phone = phoneNumber || defaultPhone;
  const msg = message || defaultMessage;

  // Simular recebimento
  const testMessage = {
    id: Date.now(),
    from: phone,
    message: msg,
    timestamp: new Date().toLocaleString('pt-BR'),
    media: null,
    replied: false
  };

  messageDatabase.push(testMessage);
  console.log(`🧪 Mensagem de teste recebida de ${phone}: ${msg}`);

  // Resposta automática
  if (botConfig.autoReplyEnabled) {
    sentMessages.push({
      id: Date.now() + 1,
      to: phone,
      message: botConfig.autoReplyMessage,
      timestamp: new Date().toLocaleString('pt-BR'),
      status: 'enviado'
    });
    testMessage.replied = true;
  }

  res.json({ 
    success: true, 
    message: 'Mensagem de teste recebida!',
    data: testMessage
  });
});

// ==================== API - STATUS ====================

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    messagesCount: messageDatabase.length,
    repliesCount: sentMessages.length,
    botEnabled: botConfig.autoReplyEnabled,
    mode: 'local'
  });
});

// ==================== API - INFORMAÇÕES ====================

app.get('/api/info', (req, res) => {
  res.json({
    name: 'WhatsApp Auto-Reply Bot',
    version: '1.0.0',
    mode: 'LOCAL (sem Twilio)',
    status: 'Pronto para usar',
    features: [
      'Resposta automática para mensagens',
      'Notificações em tempo real',
      'Dashboard web',
      'Modo de teste',
      'Sem dependência externa'
    ]
  });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║   🤖 WhatsApp Bot - Servidor Ativo (LOCAL)          ║
╚═══════════════════════════════════════════════════════╝

📱 Servidor rodando em: http://localhost:${PORT}
📊 Dashboard: http://localhost:${PORT}
🧪 API de Teste: POST http://localhost:${PORT}/api/test-message

✨ Modo: SEM TWILIO (Local)
✅ O bot está pronto para usar!

📝 COMO TESTAR:
1. Abra: http://localhost:${PORT}
2. Vá em "Configurações"
3. Clique em "🧪 Testar Webhook"
4. Ou use o endpoint:
   curl -X POST http://localhost:${PORT}/api/test-message \\
   -H "Content-Type: application/json" \\
   -d '{"phoneNumber":"5511913274243","message":"Olá!"}'

⚠️ PARA CONECTAR COM TWILIO:
Se quiser usar Twilio depois, configure o webhook:
http://seu-ip:${PORT}/webhook/messages

Pressione Ctrl+C para parar o servidor
  `);
});
