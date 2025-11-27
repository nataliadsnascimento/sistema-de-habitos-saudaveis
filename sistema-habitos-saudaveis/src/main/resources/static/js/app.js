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
        renderSidebar();
    } else {
        sidebarContent.innerHTML = '';
    }

    switch (path) {
        case '/login': renderLogin(); break;
        case '/register': renderRegister(); break;
        case '/habitos': await renderHabitosPage(); break;
        case '/evolucao':
            appContent.innerHTML = '<h2>Evolução</h2><p>Gráficos de progresso virão aqui.</p>';
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
// 3. COMPONENTE: SIDEBAR
// ===================================
const renderSidebar = () => {
    const userName = localStorage.getItem('userName') || 'Usuário';
    sidebarContent.innerHTML = `
        <h3>Olá, ${userName}!</h3>
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