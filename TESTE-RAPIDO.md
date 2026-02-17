# 🧪 Teste Rápido - WhatsApp Auto-Reply Bot

## ✅ Teste em 3 Cliques

### 1️⃣ Instalar
Duplo-clique em `install.bat`

### 2️⃣ Iniciar
Duplo-clique em `start-server.bat`

### 3️⃣ Abrir
Vá para: http://localhost:3000

Pronto! ✨

---

## 🧪 Testando o Bot

### Teste 1: Via Dashboard (Mais Fácil)

1. Abra: http://localhost:3000
2. Vá em: **⚙️ Configurações**
3. Clique em: **🧪 Testar Webhook**
4. Verifique a aba **💬 Mensagens**
5. Você verá uma mensagem de teste com resposta automática! ✅

### Teste 2: Via Terminal (Para Avançados)

Abra PowerShell (mesmo diretório) e execute:

```powershell
# Enviar mensagem de teste
$body = @{
    phoneNumber = "5511987654321"
    message = "Olá, teste!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/test-message" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
```

### Teste 3: Personalizar a Resposta

1. Abra: http://localhost:3000
2. Vá em: **⚙️ Configurações**
3. Edite: **Mensagem de Resposta Automática**

Exemplo de resposta legal:
```
Oi! 👋

Obrigado pela sua mensagem! 
Estou em modo de resposta automática no momento.

Fico feliz em responder assim que possível.

Abs! 😊
```

4. Clique: **💾 Salvar Configurações**
5. Teste novamente com **🧪 Testar Webhook**

---

## 📊 Testando Cada Aba

### Dashboard
- ✅ Vê 3 mensagens de teste
- ✅ Vê 3 respostas automáticas
- ✅ Status do bot = Ativo
- ✅ Últimas mensagens (máximo 5)

### Mensagens
- ✅ Lista todas as mensagens recebidas
- ✅ Pode deletar mensagens com 🗑️
- ✅ Pode responder manualmente com 💬
- ✅ Mostra se foi respondida ✅

### Configurações
- ✅ Ativar/Desativar resposta automática
- ✅ Editar mensagem de resposta
- ✅ Ativar/Desativar som
- ✅ Ver número do proprietário
- ✅ Testar som: **🔔 Testar Som**
- ✅ Testar webhook: **🧪 Testar Webhook**

### Ajuda
- ✅ Guia de como usar
- ✅ Como testar
- ✅ Troubleshooting

---

## 🎯 Cenários de Teste

### Teste 1: Resposta Automática Funciona?
1. Clique: **🧪 Testar Webhook**
2. Vá em: **💬 Mensagens**
3. Procure por uma mensagem com ✅ **Respondida**

✅ **PASSOU**: Tem ✅ ao lado da mensagem

### Teste 2: Notificação Sonora?
1. Vá em: **⚙️ Configurações**
2. Clique: **🔔 Testar Som**
3. Você deve ouvir um **BIP BIP BIP**

✅ **PASSOU**: Ouve o som

### Teste 3: Dashboard Atualiza?
1. Vá em: **📊 Dashboard**  
2. Anote o número em: **Mensagens Recebidas**
3. Clique: **🧪 Testar Webhook** (em Configurações)
4. Volte ao **📊 Dashboard**
5. O número aumentou em 1? 

✅ **PASSOU**: Número aumentou

### Teste 4: Deletar Mensagens?
1. Vá em: **💬 Mensagens**
2. Procure a mensagem
3. Clique: **🗑️ Deletar**
4. Mensagem sumiu?

✅ **PASSOU**: Mensagem foi deletada

### Teste 5: Responder Manualmente?
1. Vá em: **💬 Mensagens**
2. Clique: **💬 Responder**
3. Digite: `Olá! Obrigado!`
4. Está em **Enviadas**?

✅ **PASSOU**: Mensagem foi "enviada"

---

## 🐛 Problemas no Teste?

### "Não vejo mensagens"
- [ ] O servidor está rodando? (Vê `🤖 WhatsApp Bot - Servidor Ativo` no terminal?)
- [ ] Navegador está em http://localhost:3000?
- [ ] Tentou clicar em **🧪 Testar Webhook**?

### "Não funciona a resposta automática"
- [ ] Vá em **Configurações**
- [ ] Verifique se **Resposta Automática** está ON (azul)
- [ ] Teste novamente com **🧪 Testar Webhook**

### "Não recebo som"
- [ ] Ative som do computador
- [ ] Vá em **Configurações** → **Notificação Sonora** (deve estar ON)
- [ ] Clique em **🔔 Testar Som**

### "Porta 3000 já em uso"
- [ ] Feche outro aplicativo usando a porta
- [ ] OU mude a porta em `.env`: `PORT=3001`
- [ ] Reinicie o servidor

---

## 📋 Checklist de Teste Completo

- [ ] Servidor inicia sem erros
- [ ] http://localhost:3000 abre no navegador
- [ ] Dashboard mostra 0 mensagens (no início)
- [ ] Teste Webhook funciona
- [ ] Mensagem aparece com resposta ✅
- [ ] Contador de mensagens aumenta
- [ ] Som funciona ao testar
- [ ] Pode deletar mensagens
- [ ] Pode responder manualmente
- [ ] Pode editar resposta automática
- [ ] Pode ativar/desativar resposta automática

**Se todos têm ✅, seu bot está funcionando perfeitamente! 🎉**

---

## 🚀 Próximo Passo

Depois de testar, você pode:

### 1. Conectar com Twilio
Para responder verdadeiras mensagens do WhatsApp:
- Crie conta em https://www.twilio.com
- Copie as credenciais
- Edite `.env` com credenciais
- Configure webhook no Twilio
- Pronto! Bot funciona de verdade! 

### 2. Deploy em Produção
Para que o bot rode 24/7 online:
- Railway, Render, Heroku, Vercel, etc.
- Configure variáveis de ambiente
- Deploy automático do GitHub

### 3. Customizar Mais
Veja `README.md` para:
- Mais detalhes de funcionamento
- APIs disponíveis
- Como customizar

---

## ✨ Você Conseguiu!

Se todos os testes passaram, **PARABÉNS!** 🎉

Seu bot está funcionando e pronto para:
- ✅ Testar localmente
- ✅ Integrar com Twilio
- ✅ Fazer deploy em produção

**Qualquer dúvida, consulte:**
- 📖 README.md
- 📱 GUIA_RAPIDO.md
- ❓ Aba "Ajuda" no Dashboard

---

Sucesso! 🚀
