// js/app.js - CÓDIGO COMPLETO PARA FRONTEND DE HÁBITOS

// ===================================
// VARIÁVEIS GLOBAIS E CONFIGURAÇÃO
// ===================================
const API_BASE_URL = 'http://localhost:8080';
const appContent = document.getElementById('app-content');
const sidebarContent = document.getElementById('sidebar');

// ===================================
// 1. INTEGRAÇÃO COM A API
// ===================================
const api = {
    habitos: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/habitos`);
            if (!response.ok) throw new Error('Erro ao buscar hábitos.');
            return response.json();
        },
        create: async (habito) => {
            const response = await fetch(`${API_BASE_URL}/habitos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habito)
            });
            if (!response.ok) throw new Error('Erro ao criar hábito.');
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/habitos/${id}`, {
                method: 'DELETE'
            });
            if (response.status !== 204) throw new Error('Erro ao deletar hábito');
            return true;
        }
    },
    usuarios: {
        login: async (credentials) => {
            const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: credentials.email,
                    senha: credentials.password
                })
            });

            if (response.status === 401) {
                throw new Error('Email ou senha incorretos.');
            }
            if (!response.ok) {
                throw new Error('Erro ao conectar ao servidor.');
            }

            // Retorna o usuário logado vindo do Java
            return response.json();
        },

        register: async (usuarioCompleto) => {
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioCompleto)
            });

            if (!response.ok) throw new Error('Erro ao cadastrar usuário no banco.');
            return response.json();
        },

        // [NOVO] Busca o IMC calculado pelo Backend
        getIMC: async (id) => {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}/imc`);
            if (!response.ok) throw new Error('Erro ao buscar IMC.');
            return response.json();
        }
    },
    // [NOVO] Adicionamos o objeto para lidar com a Evolução
    evolucao: {
        get: async (usuarioId, dataInicio, dataFim) => {
            const url = `${API_BASE_URL}/evolucao?usuarioId=${usuarioId}&dataInicio=${dataInicio}&dataFim=${dataFim}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao gerar relatório.');
            return response.json();
        }
    }
};

// ===================================
// 2. ROTAS E NAVEGAÇÃO
// ===================================
const navigateTo = async (path) => {
    appContent.innerHTML = '';
    const isAuthenticated = localStorage.getItem('userId');

    if (!isAuthenticated && path !== '/login' && path !== '/register') {
        window.location.hash = '/login';
        return;
    }

    if (isAuthenticated) {
        // [MODIFICADO] Adicionado await para garantir que o IMC carregue antes de mostrar
        await renderSidebar();
    } else {
        sidebarContent.innerHTML = '';
    }

    switch (path) {
        case '/login': renderLogin(); break;
        case '/register': renderRegister(); break;
        case '/habitos': await renderHabitosPage(); break;
        // [MODIFICADO] Chama a nova função de renderização da página de evolução
        case '/evolucao':
            renderEvolucaoPage();
            break;
        case '/logout':
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            window.location.hash = '/login';
            break;
        default:
            window.location.hash = isAuthenticated ? '/habitos' : '/login';
            break;
    }
};

window.addEventListener('hashchange', () => navigateTo(window.location.hash.substring(1)));
window.addEventListener('load', () => {
    if (window.location.hash === '') window.location.hash = '/login';
    else navigateTo(window.location.hash.substring(1));
});

// ===================================
// 3. COMPONENTE: SIDEBAR (COM IMC)
// ===================================
const renderSidebar = async () => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'Usuário';

    // Elemento base da sidebar
    let imcHtml = '<p><small>Carregando IMC...</small></p>';

    try {
        if (userId) {
            // Busca o IMC no backend
            const imcValor = await api.usuarios.getIMC(userId);
            const imcFormatado = imcValor.toFixed(1); // Ex: 24.5

            // Lógica simples de classificação (apenas visual)
            let classificacao = '';
            let corClassificacao = '#ecf0f1'; // Cor padrão

            if (imcValor < 18.5) {
                classificacao = '(Abaixo do peso)';
                corClassificacao = '#f1c40f'; // Amarelo
            } else if (imcValor < 25) {
                classificacao = '(Peso normal)';
                corClassificacao = '#2ecc71'; // Verde
            } else if (imcValor < 30) {
                classificacao = '(Sobrepeso)';
                corClassificacao = '#e67e22'; // Laranja
            } else {
                classificacao = '(Obesidade)';
                corClassificacao = '#e74c3c'; // Vermelho
            }

            imcHtml = `
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
                    <small style="text-transform: uppercase; letter-spacing: 1px; font-size: 0.7em; opacity: 0.8;">Seu IMC</small><br>
                    <strong style="font-size: 1.8em; color: ${corClassificacao}; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${imcFormatado}</strong>
                    <br><small style="font-size: 0.85em; opacity: 0.9;">${classificacao}</small>
                </div>
            `;
        }
    } catch (error) {
        console.error(error);
        imcHtml = '<div style="margin-bottom: 15px;"><small>Erro ao carregar IMC</small></div>';
    }

    sidebarContent.innerHTML = `
        <h3>Olá, ${userName}!</h3>
        ${imcHtml}
        <nav>
            <ul>
                <li><a href="#/habitos">Meus Hábitos</a></li>
                <li><a href="#/evolucao">Evolução</a></li>
                <li><a href="#/logout">Sair</a></li>
            </ul>
        </nav>
    `;
};

// ===================================
// 4. COMPONENTE: AUTENTICAÇÃO
// ===================================
const authContainerHTML = `
    <div id="auth-container">
        <h2 id="auth-title">Login</h2>
        <form id="auth-form">
            <input type="email" id="auth-email" name="email" required><br>
            <input type="password" id="auth-password" name="password" required><br>
            <button type="submit" id="auth-button">Entrar</button>
        </form>
        <p class="switch-link"></p>
    </div>
`;

const createLabel = (htmlFor, text) => {
    const label = document.createElement('label');
    label.htmlFor = htmlFor;
    label.textContent = text;
    return label;
};

// LOGIN
const renderLogin = () => {
    appContent.innerHTML = authContainerHTML;
    document.getElementById('auth-title').textContent = 'LOGIN';
    document.getElementById('auth-button').textContent = 'ENTRAR';
    document.querySelector('.switch-link').innerHTML = `Não tem conta? <a href="#/register">Cadastre-se</a>`;

    const form = document.getElementById('auth-form');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');

    form.insertBefore(createLabel('auth-email', 'Email:'), emailInput);
    form.insertBefore(createLabel('auth-password', 'Senha:'), passwordInput);

    form.onsubmit = async (event) => {
        event.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const user = await api.usuarios.login({ email, password });

            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.nome);

            alert(`Bem-vindo, ${user.nome}!`);
            navigateTo('/habitos');
        } catch (error) {
            alert(error.message);
        }
    };
};

// TELA DE CADASTRO
const renderRegister = () => {
    appContent.innerHTML = authContainerHTML;
    document.getElementById('auth-title').textContent = 'CADASTRO';
    document.getElementById('auth-button').textContent = 'CADASTRAR';
    document.querySelector('.switch-link').innerHTML = `Já tem conta? <a href="#/login">Faça Login</a>`;

    const form = document.getElementById('auth-form');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');

    const nameInput = document.createElement('input');
    nameInput.type = 'text'; nameInput.id = 'auth-name'; nameInput.required = true;

    const idadeInput = document.createElement('input');
    idadeInput.type = 'number'; idadeInput.id = 'auth-idade'; idadeInput.required = true;

    const pesoInput = document.createElement('input');
    pesoInput.type = 'number'; pesoInput.id = 'auth-peso'; pesoInput.step = '0.1'; pesoInput.required = true;

    const alturaInput = document.createElement('input');
    alturaInput.type = 'number'; alturaInput.id = 'auth-altura'; alturaInput.step = '0.01'; alturaInput.required = true;

    form.insertBefore(createLabel('auth-name', 'Nome:'), emailInput);
    form.insertBefore(nameInput, emailInput);
    form.insertBefore(createLabel('auth-idade', 'Idade:'), emailInput);
    form.insertBefore(idadeInput, emailInput);
    form.insertBefore(createLabel('auth-peso', 'Peso (kg):'), emailInput);
    form.insertBefore(pesoInput, emailInput);
    form.insertBefore(createLabel('auth-altura', 'Altura (m):'), emailInput);
    form.insertBefore(alturaInput, emailInput);
    form.insertBefore(createLabel('auth-email', 'Email:'), emailInput);
    form.insertBefore(createLabel('auth-password', 'Senha:'), passwordInput);

    form.onsubmit = async (event) => {
        event.preventDefault();

        const novoUsuario = {
            nome: nameInput.value,
            idade: parseInt(idadeInput.value),
            peso: parseFloat(pesoInput.value),
            altura: parseFloat(alturaInput.value),
            email: emailInput.value,
            senha: passwordInput.value
        };

        try {
            await api.usuarios.register(novoUsuario);
            alert('Cadastro realizado! Faça login.');
            navigateTo('/login');
        } catch (error) {
            alert('Falha ao cadastrar: ' + error.message);
        }
    };
};

// ===================================
// 5. COMPONENTE: HÁBITOS
// ===================================
const renderHabitosPage = async () => {
    appContent.innerHTML = `
        <h2>MEUS HÁBITOS</h2>
        <form id="form-criar-habito">
            <h3>Adicionar Novo Hábito</h3>
            <label for="habito-nome">Nome do Hábito:</label>
            <input type="text" id="habito-nome" name="nome" required><br>
            <label for="habito-tipo">Tipo:</label>
            <input type="text" id="habito-tipo" name="tipo" required><br>
            <label for="habito-descricao">Descrição:</label>
            <input type="text" id="habito-descricao" name="descricao" required><br>
            <button type="submit">SALVAR HÁBITO</button>
        </form>
        <hr>
        <div id="habitos-lista"><p>Carregando...</p></div>
    `;

    const habitosListaContainer = document.getElementById('habitos-lista');
    const formCriarHabito = document.getElementById('form-criar-habito');

    const loadHabitos = async () => {
        habitosListaContainer.innerHTML = '<p>Carregando...</p>';
        try {
            const habitos = await api.habitos.getAll();
            habitosListaContainer.innerHTML = '';

            const userId = parseInt(localStorage.getItem('userId'));
            const meusHabitos = habitos.filter(h => h.usuario && h.usuario.id === userId);

            if (meusHabitos.length === 0) {
                habitosListaContainer.innerHTML = '<p>Nenhum hábito cadastrado.</p>';
                return;
            }

            const ul = document.createElement('ul');
            meusHabitos.forEach(habito => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span><strong>${habito.nome}</strong> (${habito.tipo}) - ${habito.descricao}</span>
                    <button data-id="${habito.id}">Excluir</button>
                `;
                ul.appendChild(li);
            });
            habitosListaContainer.appendChild(ul);

            ul.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', async (e) => {
                    if (confirm('Excluir este hábito?')) {
                        await api.habitos.delete(e.target.dataset.id);
                        loadHabitos();
                    }
                });
            });
        } catch (error) {
            habitosListaContainer.innerHTML = `<p style="color:red">Erro ao carregar.</p>`;
        }
    };

    formCriarHabito.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const novoHabito = {
            nome: document.getElementById('habito-nome').value,
            tipo: document.getElementById('habito-tipo').value,
            descricao: document.getElementById('habito-descricao').value,
            usuario: { id: parseInt(userId) }
        };

        try {
            await api.habitos.create(novoHabito);
            formCriarHabito.reset();
            loadHabitos();
        } catch (error) {
            alert('Erro ao criar: ' + error.message);
        }
    });

    loadHabitos();
};

// ===================================
// 6. COMPONENTE: PÁGINA DE EVOLUÇÃO (NOVO)
// ===================================
const renderEvolucaoPage = () => {
    // Define datas padrão (últimos 7 dias)
    const hoje = new Date().toISOString().split('T')[0];
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    appContent.innerHTML = `
        <h2>📊 Sua Evolução</h2>
        <p>Selecione um período para ver seu desempenho.</p>

        <form id="form-evolucao" style="display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap; background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
            <div>
                <label for="data-inicio">Data Início:</label>
                <input type="date" id="data-inicio" value="${seteDiasAtras}" required style="margin-bottom: 0;">
            </div>
            <div>
                <label for="data-fim">Data Fim:</label>
                <input type="date" id="data-fim" value="${hoje}" required style="margin-bottom: 0;">
            </div>
            <button type="submit" style="height: 42px;">Gerar Análise</button>
        </form>

        <hr style="margin: 30px 0; border-top: 1px solid #eee;">

        <div id="resultado-evolucao" style="display: none; animation: fadeIn 0.5s;">
            </div>
    `;

    const form = document.getElementById('form-evolucao');
    const resultadoDiv = document.getElementById('resultado-evolucao');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inicio = document.getElementById('data-inicio').value;
        const fim = document.getElementById('data-fim').value;
        const userId = localStorage.getItem('userId');

        resultadoDiv.innerHTML = '<p>Calculando...</p>';
        resultadoDiv.style.display = 'block';

        try {
            // 1. Chama o Backend
            const dados = await api.evolucao.get(userId, inicio, fim);

            // 2. Renderiza o Resultado
            resultadoDiv.innerHTML = `
                <div class="card-evolucao" style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h3 style="color: #2c3e50; margin-top: 0;">${dados.meta}</h3>
                    
                    <div style="display: flex; justify-content: space-around; margin-top: 30px; text-align: center; flex-wrap: wrap; gap: 20px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; min-width: 150px;">
                            <span style="font-size: 2.5em; color: #3498db; font-weight: bold; display: block;">${dados.totalRegistros}</span>
                            <small style="color: #7f8c8d; text-transform: uppercase; font-weight: bold;">Hábitos Realizados</small>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; min-width: 150px;">
                            <span style="font-size: 2.5em; color: #27ae60; font-weight: bold; display: block;">${dados.progresso}</span>
                            <small style="color: #7f8c8d; text-transform: uppercase; font-weight: bold;">Média Diária</small>
                        </div>
                    </div>

                    <div style="margin-top: 30px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Consistência (Baseado na média diária)</label>
                        <div style="background: #e0e0e0; border-radius: 15px; height: 25px; width: 100%; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);">
                            <div style="background: linear-gradient(90deg, #f1c40f, #2ecc71); 
                                        height: 100%; 
                                        width: ${Math.min(dados.progresso * 100, 100)}%;
                                        transition: width 1s ease-in-out;">
                            </div>
                        </div>
                        <small style="color: #95a5a6; display: block; margin-top: 5px;">Meta sugerida: pelo menos 1.0 hábito por dia para encher a barra.</small>
                    </div>
                </div>
            `;

        } catch (error) {
            resultadoDiv.innerHTML = `<p style="color: red; background: #fee; padding: 10px; border-radius: 5px;">Erro: ${error.message}</p>`;
        }
    });
};