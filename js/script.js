/**
 * Google Rewards - Script Unificado (Quiz + VSL)
 * 
 * Este script gerencia a interatividade da aplicação de pesquisas remuneradas,
 * incluindo navegação entre páginas, sistema de perguntas, animações de saldo,
 * popups de recompensa, efeito de confete e transição para VSL.
 */

// ==================== CONFIGURAÇÃO INICIAL ====================

// Dados das perguntas da pesquisa
const surveyData = {
    initialBalance: 17,
    currentBalance: 17,
    currentQuestionIndex: 0,
    questions: [
        {
            text: "What is your preferred search engine?",
            options: [
                { text: "Google", emoji: "🔍" },
                { text: "Bing", emoji: "🔎" },
                { text: "DuckDuckGo", emoji: "🦆" }
            ],
            reward: 25
        },
        {
            text: "How do you feel about personalized online advertising?",
            options: [
                { text: "Useful and relevant", emoji: "💡" },
                { text: "Intrusive", emoji: "😤" },
                { text: "Indifferent", emoji: "🤷" }
            ],
            reward: 37
        },
        {
            text: "Which Google service do you use most frequently?",
            options: [
                { text: "Gmail", emoji: "📧" },
                { text: "YouTube", emoji: "📺" },
                { text: "Google Maps", emoji: "🗺️" }
            ],
            reward: 33
        },
        {
            text: "Do you usually click on ads when browsing the internet?",
            options: [
                { text: "Frequently", emoji: "🖱️" },
                { text: "Rarely", emoji: "🚫" },
                { text: "Never", emoji: "❌" }
            ],
            reward: 48
        },
        {
            text: "What is your main concern about online privacy?",
            options: [
                { text: "Personal data collection", emoji: "🔐" },
                { text: "Activity tracking", emoji: "👁️" },
                { text: "Payment security", emoji: "💳" }
            ],
            reward: 53
        }
    ]
};

// ==================== SELETORES DOM ====================

// Seções principais
const quizSection = document.getElementById('quizSection');
const vslSection = document.getElementById('vslSection');

// Páginas do Quiz
const welcomePage = document.getElementById('welcomePage');
const surveyPage = document.getElementById('surveyPage');
const completionPage = document.getElementById('completionPage');

// Elementos de balanço e progresso
const balanceElement = document.getElementById('balance');
const balanceIndicator = document.getElementById('balanceIndicator');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const questionValue = document.getElementById('questionValue');
const finalBalance = document.getElementById('finalBalance');

// Elementos da pesquisa
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');

// Popup de recompensa
const rewardPopup = document.getElementById('rewardPopup');
const rewardAmount = document.getElementById('rewardAmount');
const overlay = document.getElementById('overlay');

// Botões
const startButton = document.getElementById('startButton');
const withdrawButton = document.getElementById('withdrawButton');

// Ano atual para copyright
const currentYearElement = document.getElementById('currentYear');

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar dados
    initializeData();
    
    // Configurar ano atual no rodapé
    currentYearElement.textContent = new Date().getFullYear();
    
    // Adicionar event listeners
    startButton.addEventListener('click', startSurvey);
    withdrawButton.addEventListener('click', showVSL);
});

/**
 * Mostra a VSL e carrega o player
 */
function showVSL() {
    // Esconder toda a seção do quiz
    fadeOut(quizSection, () => {
        // Mostrar seção da VSL
        fadeIn(vslSection);
        
        // Atualizar o saldo no header
        updateBalanceDisplay(surveyData.currentBalance, false);
        
        // Carregar o player VSL AGORA
        loadVSLPlayer();
    });
}

/**
 * Inicializa os dados da aplicação com valores padrão
 */
function initializeData() {
    // Definir saldo inicial
    surveyData.currentBalance = surveyData.initialBalance;
    
    // Atualizar interface com o saldo atual
    updateBalanceDisplay(surveyData.currentBalance, false);
}

// ==================== NAVEGAÇÃO ENTRE PÁGINAS ====================

/**
 * Inicia a pesquisa, escondendo a página de boas-vindas e mostrando a primeira pergunta
 */
function startSurvey() {
    // Resetar índice da pergunta atual se estiver reiniciando
    surveyData.currentQuestionIndex = 0;
    
    // Alternar visualização de páginas com animação
    fadeOut(welcomePage, () => {
        fadeIn(surveyPage);
        showCurrentQuestion();
    });
}

/**
 * Mostra a página final com o saldo total
 */
function showCompletionPage() {
    fadeOut(surveyPage, () => {
        // Atualizar exibição do saldo final
        finalBalance.textContent = surveyData.currentBalance;
        
        // Mostrar página de conclusão
        fadeIn(completionPage);
    });
}

/**
 * CORREÇÃO: Carrega o script do player VSL e cria o elemento APENAS quando necessário
 */
function loadVSLPlayer() {
    // Previne carregamentos duplicados
    if (window.vslPlayerLoaded) {
        console.log('Player VSL já foi carregado anteriormente');
        return;
    }
    const playerContainer = document.getElementById('vslPlayerContainer');
    if (!playerContainer) {
        console.error('Container do player não encontrado!');
        return;
    }
    // Limpa qualquer conteúdo anterior
    playerContainer.innerHTML = '';
    // Insere o player VTurb conforme solicitado
    playerContainer.innerHTML = '<vturb-smartplayer id="vid-6a3b1de098c7a8a7e98fd649" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer>';
    var s = document.createElement("script");
    s.src = "https://scripts.converteai.net/f0ada385-6eec-4f29-9366-31cd3b1a8fb6/players/6a3b1de098c7a8a7e98fd649/v4/player.js";
    s.async = !0;
    document.head.appendChild(s);
    window.vslPlayerLoaded = true;
}

/**
 * Função para fazer fade out de um elemento
 */
function fadeOut(element, callback) {
    element.classList.add('hidden');
    if (callback) callback();
}

/**
 * Função para fazer fade in de um elemento
 */
function fadeIn(element) {
    element.classList.remove('hidden');
    element.classList.add('fade-in');
    
    // Remover a classe de animação após o término
    setTimeout(() => {
        element.classList.remove('fade-in');
    }, 500);
}

// ==================== SISTEMA DE PERGUNTAS ====================

/**
 * Exibe a pergunta atual e suas opções
 */
function showCurrentQuestion() {
    const currentQuestion = surveyData.questions[surveyData.currentQuestionIndex];
    
    // Atualizar texto da pergunta
    questionText.textContent = currentQuestion.text;
    
    // Atualizar valor da recompensa
    questionValue.textContent = `Vale: ${currentQuestion.reward} USD`;
    
    // Atualizar progresso
    const progress = ((surveyData.currentQuestionIndex + 1) / surveyData.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Pergunta ${surveyData.currentQuestionIndex + 1} de ${surveyData.questions.length}`;
    
    // Limpar opções anteriores
    optionsContainer.innerHTML = '';
    
    // Criar e adicionar novas opções
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'survey-option';
        optionElement.innerHTML = `
            <span class="survey-option-emoji">${option.emoji}</span>
            <span class="survey-option-text">${option.text}</span>
        `;
        
        // Adicionar event listener para seleção de opção
        optionElement.addEventListener('click', () => selectOption(index));
        
        // Adicionar ao container
        optionsContainer.appendChild(optionElement);
    });
}

/**
 * Processa a seleção de uma opção de resposta
 */
function selectOption(optionIndex) {
    const currentQuestion = surveyData.questions[surveyData.currentQuestionIndex];
    const reward = currentQuestion.reward;
    
    // Tocar som de resposta
    playAnswerSound();

    // Adicionar recompensa ao saldo
    addToBalance(reward);

    // Mostrar popup de recompensa
    showRewardPopup(reward);
    
    // Após um delay, passar para a próxima pergunta ou finalizar
    setTimeout(() => {
        hideRewardPopup();
        
        // Incrementar índice da pergunta
        surveyData.currentQuestionIndex++;
        
        // Verificar se ainda há perguntas
        if (surveyData.currentQuestionIndex < surveyData.questions.length) {
            showCurrentQuestion();
        } else {
            showCompletionPage();
        }
    }, 2000);
}

// ==================== GERENCIAMENTO DE SALDO ====================

/**
 * Adiciona um valor ao saldo atual e atualiza a exibição
 */
function addToBalance(amount) {
    // Atualizar saldo no objeto de dados
    surveyData.currentBalance += amount;
    
    // Atualizar interface
    updateBalanceDisplay(surveyData.currentBalance, true);
}

/**
 * Atualiza a exibição do saldo com animação
 */
function updateBalanceDisplay(newAmount, animate = false) {
    if (animate) {
        // Animação de contagem
        const startValue = parseInt(balanceElement.textContent);
        const endValue = newAmount;
        const duration = 1000; // ms
        const frameRate = 30; // frames por segundo
        const increment = Math.ceil((endValue - startValue) / (duration / (1000 / frameRate)));
        
        let currentValue = startValue;
        const counter = setInterval(() => {
            currentValue += increment;
            
            // Verificar se chegou ou ultrapassou o valor final
            if ((increment > 0 && currentValue >= endValue) || 
                (increment < 0 && currentValue <= endValue)) {
                clearInterval(counter);
                currentValue = endValue;
            }
            
            // Atualizar o texto
            balanceElement.textContent = currentValue;
        }, 1000 / frameRate);
        
        // Mostrar indicador de atualização
        balanceIndicator.classList.add('active');
        
        // Esconder indicador após um tempo
        setTimeout(() => {
            balanceIndicator.classList.remove('active');
        }, 2000);
    } else {
        // Atualização simples sem animação
        balanceElement.textContent = newAmount;
    }
}

// ==================== POPUP DE RECOMPENSA ====================

/**
 * Exibe o popup de recompensa com o valor ganho
 */
function showRewardPopup(amount) {
    // Atualizar texto do valor
    rewardAmount.textContent = `+${amount} USD`;
    
    // Mostrar overlay e popup
    overlay.classList.add('active');
    rewardPopup.classList.add('active');
    
    // Criar efeito de confete
    createConfetti();
}

/**
 * Esconde o popup de recompensa
 */
function hideRewardPopup() {
    overlay.classList.remove('active');
    rewardPopup.classList.remove('active');
}

// ==================== SOM DE RESPOSTA ====================

/**
 * Toca um som de "ding" ao responder uma pergunta usando Web Audio API
 */
function playAnswerSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
        // silencioso se o navegador bloquear
    }
}

// ==================== EFEITO DE CONFETE ====================

/**
 * Cria um efeito de confete no popup de recompensa
 */
function createConfetti() {
    const confettiContainer = document.getElementById('confettiCanvas');
    confettiContainer.innerHTML = '';
    
    // Cores para o confete
    const colors = ['#38B764', '#4BDE7C', '#4D7CFE', '#6D93FF', '#FBBC04'];
    
    // Criar 50 partículas de confete
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 4 + 2}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `-10px`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.borderRadius = '2px';
        
        // Adicionar à container
        confettiContainer.appendChild(confetti);
        
        // Animar queda
        const duration = Math.random() * 2000 + 1000;
        const delay = Math.random() * 500;
        
        confetti.animate([
            { transform: `translate(0, 0) rotate(${Math.random() * 360}deg)`, opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 200 + 200}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: duration,
            delay: delay,
            fill: 'forwards',
            easing: 'cubic-bezier(0.21, 0.98, 0.6, 0.99)'
        });
    }
}
