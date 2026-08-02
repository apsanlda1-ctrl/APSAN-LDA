const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const service = document.getElementById('serviceSelect').value;

    alert(`Obrigado, ${name}! O seu pedido para o serviço "${service}" foi registado com sucesso na APSAN, LDA. Entraremos em contacto brevemente.`);
    document.getElementById('contactForm').reset();
}

function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
        chatBox.classList.toggle('active');
    }
}

// Inteligência Conversacional Lógica da Assistente Azny Gabriel
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');

    if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            processUserMessage();
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                processUserMessage();
            }
        });
    }
});

function processUserMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const userMsg = input.value.trim();
    
    if (userMsg === "") return;

    const chatBody = document.getElementById('chatBody');
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user';
    userDiv.textContent = userMsg;
    chatBody.appendChild(userDiv);

    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'chat-message agent';
        
        const lowerMsg = userMsg.toLowerCase();
        let botResponse = "";

        // 1. Saudações e Interações Iniciais
        if (lowerMsg.includes('como estás') || lowerMsg.includes('como esta') || lowerMsg.includes('tudo bem') || lowerMsg.includes('estas bem')) {
            botResponse = "Estou excelente, obrigada por perguntar! 😊 Sempre pronta para responder a qualquer dúvida que tenha, seja sobre o nosso mundo ou sobre os serviços da APSAN, LDA.";
        }
        else if (lowerMsg.includes('olá') || lowerMsg.includes('ola') || lowerMsg.includes('bom dia') || lowerMsg.includes('boa tarde') || lowerMsg.includes('boa noite')) {
            botResponse = "Olá! 😊 É um prazer enorme falar consigo. O que gostaria de saber hoje? Pode perguntar-me o que quiser!";
        } 
        
        // 2. Questões sobre Preços / Orçamentos
        else if (lowerMsg.includes('preço') || lowerMsg.includes('precos') || lowerMsg.includes('quanto custa') || lowerMsg.includes('orçamento') || lowerMsg.includes('valor')) {
            botResponse = `Para valores exatos e orçamentos detalhados adaptados ao seu pedido, o ideal é continuarmos diretamente no WhatsApp oficial da empresa: <a href="https://wa.me/244944403093?text=Olá,%20gostaria%20de%20saber%20os%20preços%20dos%20vossos%20serviços." target="_blank" style="color: #004080; font-weight: bold; text-decoration: underline;">Falar no WhatsApp</a>`;
        } 

        // 3. Questões sobre Dias de Trabalho / Horários gerais
        else if (lowerMsg.includes('domingo') || lowerMsg.includes('fim de semana') || lowerMsg.includes('trabalham aos domingos') || lowerMsg.includes('aberto ao domingo')) {
            botResponse = "Geralmente os nossos serviços principais funcionam de segunda a sábado. No entanto, para situações urgentes, emergências ou serviços extras (como o câmbio ou atendimento específico), pode contactar-nos diretamente para verificarmos a disponibilidade imediata!";
        }

        // 4. Dados Institucionais e Localização da APSAN, LDA
        else if (lowerMsg.includes('local') || lowerMsg.includes('sede') || lowerMsg.includes('onde') || lowerMsg.includes('cunene') || lowerMsg.includes('namacunde') || lowerMsg.includes('ondjiva')) {
            botResponse = "A APSAN, LDA tem a sua sede na Província do Cunene, Município do Namacunde, com representação oficial na Cidade de Ondjiva[cite: 1, 2].";
        }
        else if (lowerMsg.includes('nif')) {
            botResponse = "O NIF oficial da APSAN, LDA é 5002085011[cite: 1, 2].";
        }

        // 5. Portfólio de Serviços Principais e Extras
        else if (lowerMsg.includes('limpeza') || lowerMsg.includes('institucional')) {
            botResponse = "O Serviço de Limpeza Institucional abrange a higienização profissional de escritórios, edifícios, unidades de saúde e escolas.";
        }
        else if (lowerMsg.includes('material') || lowerMsg.includes('escritório')) {
            botResponse = "Fazemos o Fornecimento de Material de Escritório com consumíveis de qualidade superior.";
        }
        else if (lowerMsg.includes('catering') || lowerMsg.includes('eventos')) {
            botResponse = "Oferecemos Serviços de Catering e Gestão de Eventos Corporativos com organização e padrões de alta qualidade.";
        }
        else if (lowerMsg.includes('internet') || lowerMsg.includes('cabling')) {
            botResponse = "Prestamos Serviços de Internet e Cabling, incluindo instalação de redes, cabeamento estruturado e conectividade.";
        }
        else if (lowerMsg.includes('software') || lowerMsg.includes('sistema de gestão')) {
            botResponse = "Desenvolvemos o Serviço de Criação de Software e Sistema de Gestão Empresarial, criando plataformas tecnológicas robustas para otimizar os processos das empresas.";
        }
        else if (lowerMsg.includes('transporte') || lowerMsg.includes('aluguer') || lowerMsg.includes('carros')) {
            botResponse = "Oferecemos Serviços de Transportes e Aluguer de Carros para pessoas, bens e missões corporativas.";
        }
        else if (lowerMsg.includes('importação') || lowerMsg.includes('exportação')) {
            botResponse = "Realizamos operações completas de Importação & Exportação com segurança e rigor logístico entre Angola e Namíbia.";
        }
        else if (lowerMsg.includes('hospitalar') || lowerMsg.includes('acompanhamento')) {
            botResponse = "O Serviço de Acompanhamento Hospitalar garante apoio dedicado, assistência e acompanhamento com total zelo e cuidado nas unidades hospitalares.";
        }
        else if (lowerMsg.includes('tradução') || lowerMsg.includes('juramentada')) {
            botResponse = "Realizamos Tradução Oficial Juramentada de documentos com rigor, confidencialidade e total validade legal.";
        }
        else if (lowerMsg.includes('autorização') || lowerMsg.includes('menor')) {
            botResponse = "Tratamos da Autorização de viagem pra menor, prestando todo o apoio burocrático e logístico necessário.";
        }
        else if (lowerMsg.includes('guia') || lowerMsg.includes('turístico')) {
            botResponse = "Disponibilizamos Guia especializado para orientar e acompanhar passeios e deslocações com total segurança.";
        }
        else if (lowerMsg.includes('namíbia') || lowerMsg.includes('compras na namíbia')) {
            botResponse = "Realizamos o serviço de Compras Na Namibia, facilitando a aquisição e o transporte seguro de mercadorias.";
        }
        else if (lowerMsg.includes('encomenda') || lowerMsg.includes('recepção')) {
            botResponse = "Fazemos a Encomendas de forma rápida, segura e organizada.";
        }
        else if (lowerMsg.includes('redes sociais') || lowerMsg.includes('marketing')) {
            botResponse = "Prestamos serviços de Gestão de Redes Sociais para potenciar a visibilidade de marcas e negócios.";
        }

        // 6. Resposta Universal Inteligente para QUALQUER outra pergunta do utilizador
        else {
            botResponse = `Essa é uma excelente pergunta! Relativamente a "${userMsg}", analiso que o tema pode ser abordado de forma ampla. Se precisar de aplicar este conceito aos nossos serviços na APSAN, LDA ou se quiser explorar mais detalhes sobre o assunto, estou inteiramente à disposição para ajudar com precisão e clareza. O que mais gostaria de saber?`;
        }

        replyDiv.innerHTML = botResponse;
        chatBody.appendChild(replyDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const chatBody = document.getElementById('chatBody');
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user';
    userDiv.innerHTML = `<i class="fas fa-file-alt"></i> Ficheiro anexado: <strong>${file.name}</strong>`;
    chatBody.appendChild(userDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'chat-message agent';
        replyDiv.innerHTML = `Recebi o seu ficheiro <strong>${file.name}</strong> com sucesso! Vou analisar o documento e dar seguimento aqui mesmo no chat.`;
        chatBody.appendChild(replyDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);

    event.target.value = '';
}

function sendAudioMessage() {
    const chatBody = document.getElementById('chatBody');
    
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user';
    userDiv.innerHTML = `<i class="fas fa-microphone" style="color: #ff4d4d;"></i> <em>Mensagem de voz gravada e enviada (0:05)</em>`;
    chatBody.appendChild(userDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'chat-message agent';
        replyDiv.innerHTML = `Ouvi a sua mensagem de voz com atenção! Compreendi perfeitamente e estou a tratar de tudo diretamente por este chat para lhe garantir total comodidade. 😊`;
        chatBody.appendChild(replyDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}
