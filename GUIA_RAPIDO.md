# ⚡ Guia Rápido - WhatsApp Auto-Reply Bot

## 🚀 Iniciar em 3 Passos

### 1️⃣ Primeira Vez? Instale as Dependências
**Clique 2x em:** `install.bat`

OU na PowerShell:
```powershell
npm install
```

### 2️⃣ Inicie o Servidor
**Clique 2x em:** `start-server.bat`

OU na PowerShell:
```powershell
npm start
```

### 3️⃣ Abra no Navegador
```
http://localhost:3000
```

## ✨ Pronto!

Seu bot está rodando! Agora:

- 🧪 Clique em **Configurações** → **🧪 Testar Webhook** para enviar uma mensagem teste
- ⚙️ Customize a mensagem de resposta
- 📱 Veja todas as mensagens na aba "Mensagens"

## 🎯 O Que Fazer Agora?

### Testar Localmente
1. Abra http://localhost:3000
2. Vá para **Configurações**
3. Clique em **🧪 Testar Webhook**
4. Veja a mensagem aparecer na aba **Mensagens**

### Personalizar Resposta
1. Vá para **Configurações**
2. Edite o campo "Mensagem de Resposta Automática"
3. Use **emojis** para deixar mais legal 😊
4. Clique em **💾 Salvar Configurações**

### Conectar com WhatsApp Real (Twilio)
Se quiser responder mensagens de verdade do seu WhatsApp:
1. Crie conta em: https://www.twilio.com
2. Copie suas credenciais
3. Crie arquivo `.env` com as credenciais
4. Configure o webhook no Twilio
5. Pronto! Seu bot responde mensagens reais!

Não tem Twilio? Sem problema! O bot funciona perfeitamente em modo local para testes! 

## 📱 Atalhos Úteis

| O que fazer | Como fazer |
|---|---|
| Parar o servidor | Pressione `Ctrl + C` no PowerShell |
| Mudar porta | Edite `.env`: `PORT=3001` |
| Editar resposta | Vá em **Configurações** no dashboard |
| Testar mensagem | Clique em **🧪 Testar Webhook** |
| Ver histórico | Abra a aba **Mensagens** |
| Ativar som | Marque em **Notificação Sonora** em Configurações |

## 🆘 Problema?

### "npm não é reconhecido"
👉 Instale Node.js: https://nodejs.org

### "Porta já em uso"
👉 Mude a porta:
```
Edite o arquivo .env:
PORT=3001
```

### "Servidor não inicia"
👉 Tente:
```powershell
cd "C:\Users\seu-usuario\OneDrive\Desktop\Nova IA\Robo para Responder Mensagens"
npm install
npm start
```

### "Não consigo acessar http://localhost:3000"
👉 Verifique:
- O servidor está rodando? (Veja no PowerShell)
- Digitou a URL correta?
- Firewall está bloqueando?

## 📞 Próximos Passos

✅ Teste o bot localmente  
✅ Customize a resposta automática  
✅ Integre com Twilio para usar de verdade  
✅ Deploy em um servidor online  

## 🎓 Aprenda Mais

- 📖 Veja `README.md` para documentação completa
- 🧪 Veja `TESTE-RAPIDO.md` para tutoriais
- 💡 Explore o `index.html` para entender a interface

---

**Sucesso! 🚀**

Seu bot está pronto para ajudar! Qualquer dúvida, consulte a documentação ou abra uma issue no GitHub.
