// WhatsApp Bot Dashboard - Frontend JavaScript

const API_BASE = 'http://localhost:3000';
let config = {};
let messages = [];

// ==================== Initialized ====================
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadConfiguration();
    updateDashboard();
    checkServerStatus();
    
    // Auto-refresh a cada 3 segundos
    setInterval(updateDashboard, 3000);
    setInterval(checkServerStatus, 5000);
});

// ==================== Event Listeners ====================
function initEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Buttons
    document.getElementById('refreshBtn')?.addEventListener('click', updateDashboard);
    document.getElementById('clearBtn')?.addEventListener('click', confirmClearMessages);
    document.getElementById('saveSettingsBtn')?.addEventListener('click', saveConfiguration);
    document.getElementById('testSoundBtn')?.addEventListener('click', playNotificationSound);
    document.getElementById('testWebhookBtn')?.addEventListener('click', testWebhook);

    // Modal
    document.getElementById('confirmYes')?.addEventListener('click', handleConfirmYes);
    document.getElementById('confirmNo')?.addEventListener('click', closeConfirmModal);

    // Settings toggles
    document.getElementById('autoReplyToggle')?.addEventListener('change', (e) => {
        console.log('Auto reply:', e.target.checked);
    });

    document.getElementById('soundToggle')?.addEventListener('change', (e) => {
        console.log('Sound notification:', e.target.checked);
    });
}

// ==================== Navigation ====================
function handleNavigation(e) {
    const section = e.target.dataset.section;
    
    // Atualizar nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    e.target.classList.add('active');

    // Atualizar sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section)?.classList.add('active');

    // Scroll para o topo
    document.querySelector('.content').scrollTop = 0;
}

// ==================== Dashboard ====================
async function updateDashboard() {
    try {
        const response = await fetch(`${API_BASE}/api/messages`);
        messages = await response.json();

        // Atualizar counts
        const replied = messages.filter(m => m.replied).length;
        document.getElementById('statMessages').textContent = messages.length;
        document.getElementById('statReplied').textContent = replied;
        document.getElementById('messageCount').textContent = messages.length;

        // Atualizar hora
        const now = new Date();
        document.getElementById('lastCheckTime').textContent = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Atualizar lista de mensagens recentes (últimas 5)
        const recentList = document.getElementById('recentMessagesList');
        const recent = messages.slice(-5).reverse();

        if (recent.length === 0) {
            recentList.innerHTML = '<p class="empty-state">Nenhuma mensagem ainda...</p>';
        } else {
            recentList.innerHTML = recent.map(msg => createMessageElement(msg)).join('');
        }

        // Atualizar lista completa se stiver na aba de mensagens
        if (document.querySelector('.nav-item[data-section="messages"].active')) {
            updateMessagesList();
        }

    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
}

function updateMessagesList() {
    const list = document.getElementById('messagesList');
    
    if (messages.length === 0) {
        list.innerHTML = '<p class="empty-state">Nenhuma mensagem para exibir</p>';
        return;
    }

    list.innerHTML = messages.map(msg => createMessageElement(msg)).join('');

    // Add delete listeners
    document.querySelectorAll('.delete-msg-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteMessage(btn.dataset.id));
    });

    // Add reply listeners
    document.querySelectorAll('.reply-msg-btn').forEach(btn => {
        btn.addEventListener('click', () => showReplyModal(btn.dataset.phone));
    });
}

function createMessageElement(msg) {
    const initial = msg.from.slice(-2).toUpperCase();
    const statusBadge = msg.replied ? '<span class="message-badge">✅ Respondida</span>' : '';

    return `
        <div class="message-item">
            <div class="message-avatar">${initial}</div>
            <div class="message-content">
                <div class="message-header">
                    <div class="message-from">📱 ${msg.from}</div>
                    <div class="message-time">${msg.timestamp}</div>
                </div>
                <div class="message-text">${escapeHtml(msg.message)}</div>
                ${statusBadge}
                <div class="message-actions">
                    <button class="btn btn-secondary reply-msg-btn" data-phone="${msg.from}">💬 Responder</button>
                    <button class="btn btn-danger delete-msg-btn" data-id="${msg.id}">🗑️ Deletar</button>
                </div>
            </div>
        </div>
    `;
}

// ==================== Mensagens ====================
function confirmClearMessages() {
    showConfirmModal(
        'Limpar Mensagens',
        'Tem certeza que deseja limpar todas as mensagens? Esta ação não pode ser desfeita.',
        'clear-messages'
    );
}

async function deleteMessage(id) {
    try {
        const response = await fetch(`${API_BASE}/api/messages/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Mensagem deletada com sucesso', 'success');
            updateDashboard();
        }
    } catch (error) {
        showToast('Erro ao deletar mensagem', 'error');
        console.error('Erro:', error);
    }
}

async function clearAllMessages() {
    try {
        const response = await fetch(`${API_BASE}/api/messages`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Todas as mensagens foram limpas', 'success');
            updateDashboard();
        }
    } catch (error) {
        showToast('Erro ao limpar mensagens', 'error');
        console.error('Erro:', error);
    }
}

function showReplyModal(phoneNumber) {
    const message = prompt('Digite sua resposta:');
    if (message) {
        sendReply(phoneNumber, message);
    }
}

async function sendReply(phoneNumber, message) {
    try {
        const response = await fetch(`${API_BASE}/api/send-reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                message: message
            })
        });

        if (response.ok) {
            showToast('Resposta enviada com sucesso!', 'success');
            updateDashboard();
        } else {
            showToast('Erro ao enviar resposta', 'error');
        }
    } catch (error) {
        showToast('Erro na conexão', 'error');
        console.error('Erro:', error);
    }
}

// ==================== Configurações ====================
async function loadConfiguration() {
    try {
        const response = await fetch(`${API_BASE}/api/config`);
        config = await response.json();

        // Atualizar formulário
        document.getElementById('autoReplyToggle').checked = config.autoReplyEnabled;
        document.getElementById('autoReplyText').value = config.autoReplyMessage;
        document.getElementById('ownerPhone').value = config.ownerPhone || '';
        document.getElementById('soundToggle').checked = config.soundNotificationEnabled ?? true;

        document.getElementById('botStatusValue').textContent = config.autoReplyEnabled ? '✅ Ativo' : '❌ Desativado';

    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

async function saveConfiguration() {
    const newConfig = {
        autoReplyEnabled: document.getElementById('autoReplyToggle').checked,
        autoReplyMessage: document.getElementById('autoReplyText').value,
        ownerPhone: document.getElementById('ownerPhone').value
    };

    try {
        const response = await fetch(`${API_BASE}/api/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newConfig)
        });

        if (response.ok) {
            config = newConfig;
            showToast('Configurações salvas com sucesso!', 'success');
            updateDashboard();
        } else {
            showToast('Erro ao salvar configurações', 'error');
        }
    } catch (error) {
        showToast('Erro na conexão ao salvar', 'error');
        console.error('Erro:', error);
    }
}

async function testWebhook() {
    try {
        // Enviar uma mensagem de teste
        const response = await fetch(`${API_BASE}/api/test-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: '5511987654321',
                message: '🤖 Mensagem de teste do bot! Está funcionando perfeitamente!'
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('🧪 Mensagem de teste enviada com sucesso! Verifique a aba de mensagens', 'success');
            setTimeout(() => updateDashboard(), 500);
        } else {
            showToast('❌ Erro ao enviar mensagem de teste', 'error');
        }
        console.log('Resposta do webhook:', result);
    } catch (error) {
        showToast('❌ Erro ao conectar ao webhook', 'error');
        console.error('Erro:', error);
    }
}

// ==================== Notificações ====================
function playNotificationSound() {
    // Criar som de notificação usando Web Audio API
    const context = new (window.AudioContext || window.webkitAudioContext)();
    
    // Frequências para um som agradável
    const frequencies = [800, 1000, 1200];
    
    frequencies.forEach((freq, idx) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        
        osc.connect(gain);
        gain.connect(context.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        const start = context.currentTime + (idx * 0.1);
        const duration = 0.15;
        
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        
        osc.start(start);
        osc.stop(start + duration);
    });

    showToast('🔔 Som de notificação testado', 'info');
}

function playNotificationOnMessage() {
    if (!document.getElementById('soundToggle').checked) return;
    
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    
    osc.connect(gain);
    gain.connect(context.destination);
    
    osc.frequency.value = 1000;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.3, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.5);

    // Breve vibração se suportado
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
}

// ==================== Server Status ====================
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/status`);
        const status = await response.json();
        
        const badge = document.getElementById('statusBadge');
        const text = document.getElementById('statusText');
        const dot = badge?.querySelector('.status-dot');
        
        if (badge) {
            if (status.status === 'online') {
                badge.style.background = 'rgba(81, 207, 102, 0.2)';
                dot.style.background = 'var(--success)';
                text.textContent = '🟢 Online';
            } else {
                badge.style.background = 'rgba(255, 107, 107, 0.2)';
                dot.style.background = 'var(--danger)';
                text.textContent = '🔴 Offline';
            }
        }
    } catch (error) {
        const badge = document.getElementById('statusBadge');
        const text = document.getElementById('statusText');
        const dot = badge?.querySelector('.status-dot');
        
        if (badge) {
            badge.style.background = 'rgba(255, 107, 107, 0.2)';
            dot.style.background = 'var(--danger)';
            text.textContent = '🔴 Sem conexão';
        }
    }
}

// ==================== Modal ====================
function showConfirmModal(title, message, action) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').dataset.action = action;
    document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

function handleConfirmYes() {
    const action = document.getElementById('confirmModal').dataset.action;
    closeConfirmModal();

    if (action === 'clear-messages') {
        clearAllMessages();
    }
}

// ==================== Toast ====================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} active`;

    setTimeout(() => {
        toast.classList.remove('active');
    }, 4000);
}

// ==================== Utilities ====================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
