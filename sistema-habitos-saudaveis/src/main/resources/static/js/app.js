// js/app.js - CÓDIGO COMPLETO PARA FRONTEND DE HÁBITOS

// ===================================
// VARIÁVEIS GLOBAIS E CONFIGURAÇÃO
// ===================================
const API_BASE_URL = 'http://localhost:8080';
const appContent = document.getElementById('app-content');
const sidebarContent = document.getElementById('sidebar');

// ===================================
// 1. SIMULAÇÃO DE API (GET, POST, DELETE)
// ===================================
// Funções para interagir com o Spring Boot (e simular login)
const api = {
    habitos: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/habitos`);
            if (!response.ok) throw new Error('Erro ao buscar hábitos. O servidor Spring Boot está rodando?');
            return response.json();
        },
        create: async (habito) => {
            const response = await fetch(`${API_BASE_URL}/habitos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habito)
            });
            if (!response.ok) throw new Error('Erro ao criar hábito');
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
    // Simulação de Login/Cadastro (o backend precisa implementar endpoints reais)
    usuarios: {
        login: async (credentials) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Credenciais de teste:
                    if (credentials.email === "teste@email.com" && credentials.password === "123") {
                        resolve({ id: 1, nome: 'Usuário Teste' });
                    } else {
                        reject(new Error('Credenciais inválidas.'));
                    }
                }, 300);
            });
        },
        register: async (usuario) => {
             return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (usuario.nome && usuario.email && usuario.password) {
                        // Simulação de sucesso
                        resolve({ id: Math.floor(Math.random() * 100) + 2, nome: usuario.nome });
                    } else {
                        reject(new Error('Dados incompletos.'));
                    }
                }, 300);
            });
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
        case '/login':
            renderLogin();
            break;
        case '/register':
            renderRegister();
            break;
        case '/habitos':
            await renderHabitosPage();
            break;
        case '/evolucao':
            appContent.innerHTML = '<h2>Evolução (Em breve!)</h2><p>Gráficos de progresso virão aqui.</p>';
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

// Escuta mudanças na hash da URL para navegar
window.addEventListener('hashchange', () => {
    navigateTo(window.location.hash.substring(1));
});

// Navegação inicial (executado quando a página carrega)
window.addEventListener('load', () => {
    if (window.location.hash === '') {
        window.location.hash = '/login';
    } else {
        navigateTo(window.location.hash.substring(1));
    }
});

// ===================================
// 3. COMPONENTE: SIDEBAR
// ===================================
const renderSidebar = () => {
    const userName = localStorage.getItem('userName') || 'Convidado';
    sidebarContent.innerHTML = `
        <h3>Bem-vindo, ${userName}!</h3>
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

// Função Auxiliar para Criar Label
const createLabel = (htmlFor, text) => {
    const label = document.createElement('label');
    label.htmlFor = htmlFor;
    label.textContent = text;
    return label;
};

const renderLogin = () => {
    appContent.innerHTML = authContainerHTML;
    document.getElementById('auth-title').textContent = 'LOGIN';
    document.getElementById('auth-button').textContent = 'ENTRAR';
    document.querySelector('.switch-link').innerHTML = `Não tem conta? <a href="#/register">Cadastre-se</a>`;

    const form = document.getElementById('auth-form');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const authButton = document.getElementById('auth-button');

    // Adiciona Labels para o Login:
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
            alert('Login falhou: ' + error.message);
        }
    };
};

const renderRegister = () => {
    appContent.innerHTML = authContainerHTML;
    document.getElementById('auth-title').textContent = 'CADASTRO';
    document.getElementById('auth-button').textContent = 'CADASTRAR';
    document.querySelector('.switch-link').innerHTML = `Já tem conta? <a href="#/login">Faça Login</a>`;

    const form = document.getElementById('auth-form');
    const emailInput = document.getElementById('auth-email');

    // CRIA E INSERE O CAMPO DE NOME (input)
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'auth-name';
    nameInput.name = 'name';
    nameInput.required = true;

    // CRIA E INSERE O LABEL DO NOME antes dos campos de Email/Senha
    form.insertBefore(createLabel('auth-name', 'Nome:'), emailInput);
    form.insertBefore(nameInput, emailInput);

    // CRIA E INSERE O LABEL DO EMAIL e SENHA (que são removidos ao recriar o authContainerHTML)
    const passwordInput = document.getElementById('auth-password');
    form.insertBefore(createLabel('auth-email', 'Email:'), emailInput);
    form.insertBefore(createLabel('auth-password', 'Senha:'), passwordInput);

    // Ajusta a ordem dos inputs (o input de email e password já existem, só precisam dos labels)

    form.onsubmit = async (event) => {
        event.preventDefault();
        const name = document.getElementById('auth-name').value;
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;

        try {
            await api.usuarios.register({ nome: name, email, password });
            alert('Cadastro realizado com sucesso! Faça login.');
            navigateTo('/login');
        } catch (error) {
            alert('Falha no cadastro: ' + error.message);
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
            <label for="habito-tipo">Tipo (Saúde, Estudo, etc.):</label>
            <input type="text" id="habito-tipo" name="tipo" required><br>
            <label for="habito-descricao">Descrição:</label>
            <input type="text" id="habito-descricao" name="descricao" required><br>
            <button type="submit">SALVAR HÁBITO</button>
        </form>
        <hr>
        <div id="habitos-lista">
            <p>Carregando hábitos...</p>
        </div>
    `;

    const habitosListaContainer = document.getElementById('habitos-lista');
    const formCriarHabito = document.getElementById('form-criar-habito');

    const loadHabitos = async () => {
        habitosListaContainer.innerHTML = '<p>Carregando hábitos...</p>';
        try {
            const habitos = await api.habitos.getAll();
            habitosListaContainer.innerHTML = '';

            if (habitos.length === 0) {
                habitosListaContainer.innerHTML = '<p>Nenhum hábito encontrado. Adicione um acima!</p>';
                return;
            }

            const ul = document.createElement('ul');
            habitos.forEach(habito => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span><strong>${habito.nome}</strong> (${habito.tipo}) - ${habito.descricao}</span>
                    <button data-id="${habito.id}">Excluir</button>
                `;
                ul.appendChild(li);
            });
            habitosListaContainer.appendChild(ul);

            ul.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const habitoId = event.target.dataset.id;
                    if (confirm(`Tem certeza que deseja excluir o hábito ID ${habitoId}?`)) {
                        try {
                            await api.habitos.delete(habitoId);
                            loadHabitos();
                        } catch (error) {
                            alert('Erro ao excluir hábito: ' + error.message);
                        }
                    }
                });
            });

        } catch (error) {
            habitosListaContainer.innerHTML = `<p style="color: red;">Erro ao carregar hábitos. Verifique se o Spring Boot está rodando em 8080.</p>`;
        }
    };

    formCriarHabito.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Faça login para adicionar hábitos.');
            navigateTo('/login');
            return;
        }

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
            alert('Erro ao criar hábito: ' + error.message);
        }
    });

    loadHabitos();
};