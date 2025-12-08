// VARIÁVEIS GLOBAIS E CONFIGURAÇÃO

const API_BASE_URL = 'http://localhost:8080';
const appContent = document.getElementById('app-content');
const sidebarContent = document.getElementById('sidebar');

// INTEGRAÇÃO COM A API
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
        update: async (id, habito) => {
            const response = await fetch(`${API_BASE_URL}/habitos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habito)
            });
            if (!response.ok) throw new Error('Erro ao atualizar hábito.');
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

    dietas: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/dietas`);
            if (!response.ok) throw new Error('Erro ao buscar dietas.');
            return response.json();
        },
        create: async (dieta) => {
            const response = await fetch(`${API_BASE_URL}/dietas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dieta)
            });
            if (!response.ok) throw new Error('Erro ao criar dieta.');
            return response.json();
        },
        update: async (id, dieta) => {
            const response = await fetch(`${API_BASE_URL}/dietas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dieta)
            });
            if (!response.ok) throw new Error('Erro ao atualizar dieta.');
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/dietas/${id}`, {
                method: 'DELETE'
            });
            if (response.status !== 204) throw new Error('Erro ao deletar dieta');
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

        getIMC: async (id) => {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}/imc`);
            if (!response.ok) throw new Error('Erro ao buscar IMC.');
            return response.json();
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
            if (!response.ok) throw new Error('Erro ao buscar dados do usuário.');
            return response.json();
        },

        update: async (id, dadosAtualizados) => {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            });
            if (!response.ok) throw new Error('Erro ao atualizar perfil.');
            return response.json();
        }
    },
    registros: {
        create: async (registro) => {
            const response = await fetch(`${API_BASE_URL}/registros`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registro)
            });
            if (!response.ok) throw new Error('Erro ao registrar hábito.');
            return response.json();
        }
    },
    evolucao: {
        get: async (usuarioId, dataInicio, dataFim) => {
            const url = `${API_BASE_URL}/evolucao?usuarioId=${usuarioId}&dataInicio=${dataInicio}&dataFim=${dataFim}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao gerar relatório.');
            return response.json();
        }
    }
};

// ROTAS E NAVEGAÇÃO
const navigateTo = async (path) => {
    appContent.innerHTML = '';
    const isAuthenticated = localStorage.getItem('userId');

    if (!isAuthenticated && path !== '/login' && path !== '/register') {
        window.location.hash = '/login';
        return;
    }

    if (isAuthenticated) {
        await renderSidebar();
    } else {
        sidebarContent.innerHTML = '';
    }

    switch (path) {
        case '/login': renderLogin(); break;
        case '/register': renderRegister(); break;
        case '/habitos': await renderHabitosPage(); break;
        case '/dietas': await renderDietasPage(); break;
        case '/evolucao': renderEvolucaoPage(); break;
        case '/perfil': await renderPerfilPage(); break;

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

// SIDEBAR
const renderSidebar = async () => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'Usuário';

    let imcHtml = '<p><small>Carregando IMC...</small></p>';

    try {
        if (userId) {
            const imcValor = await api.usuarios.getIMC(userId);
            const imcFormatado = imcValor.toFixed(1);

            let classificacao = '';
            let corClassificacao = '#ecf0f1';

            if (imcValor < 18.5) {
                classificacao = '(Abaixo do peso)';
                corClassificacao = '#f1c40f';
            } else if (imcValor < 25) {
                classificacao = '(Peso normal)';
                corClassificacao = '#2ecc71';
            } else if (imcValor < 30) {
                classificacao = '(Sobrepeso)';
                corClassificacao = '#e67e22';
            } else {
                classificacao = '(Obesidade)';
                corClassificacao = '#e74c3c';
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
                <li><a href="#/dietas">Minha Dieta</a></li>
                <li><a href="#/evolucao">Evolução</a></li>
                <li><a href="#/perfil">Meu Perfil</a></li>
                <li><a href="#/logout">Sair</a></li>
            </ul>
        </nav>
    `;
};

// AUTENTICAÇÃO E CADASTRO
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

// COMPONENTE: HÁBITOS
// COMPONENTE: HÁBITOS
const renderHabitosPage = async () => {
    let editandoId = null; // Variável para controlar se estamos editando

    appContent.innerHTML = `
        <h2>MEUS HÁBITOS</h2>
        <form id="form-criar-habito">
            <h3 id="titulo-form-habito">Adicionar Novo Hábito</h3>
            
            <label for="habito-nome">Nome do Hábito:</label>
            <input type="text" id="habito-nome" name="nome" placeholder="Ex: Beber água" required><br>
            
            <label for="habito-tipo">Tipo:</label>
            <input type="text" id="habito-tipo" name="tipo" placeholder="Ex: Saúde" required><br>
            
            <label for="habito-descricao">Descrição:</label>
            <input type="text" id="habito-descricao" name="descricao" placeholder="Ex: 2 litros por dia" required><br>
            
            <div style="display:flex; gap:10px;">
                <button type="submit" id="btn-salvar-habito">SALVAR HÁBITO</button>
                <button type="button" id="btn-cancelar-edicao-habito" style="display:none; background-color: #95a5a6;">CANCELAR</button>
            </div>
        </form>
        <hr>
        <div id="habitos-lista"><p>Carregando...</p></div>
    `;

    const habitosListaContainer = document.getElementById('habitos-lista');
    const formCriarHabito = document.getElementById('form-criar-habito');
    const btnSalvar = document.getElementById('btn-salvar-habito');
    const btnCancelar = document.getElementById('btn-cancelar-edicao-habito');
    const tituloForm = document.getElementById('titulo-form-habito');

    // Função para limpar edição
    const limparModoEdicao = () => {
        editandoId = null;
        formCriarHabito.reset();
        btnSalvar.textContent = 'SALVAR HÁBITO';
        tituloForm.textContent = 'Adicionar Novo Hábito';
        btnCancelar.style.display = 'none';
    };

    btnCancelar.addEventListener('click', limparModoEdicao);

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
                    <span>
                        <strong>${habito.nome}</strong> <br>
                        <small style="color: #666;">${habito.tipo} - ${habito.descricao}</small>
                    </span>
                    <div class="habito-actions">
                        <button class="btn-concluir" data-id="${habito.id}" title="Marcar como feito hoje">Feito</button>
                        <button class="btn-editar" data-id="${habito.id}" title="Editar hábito">Editar</button>
                        <button class="btn-excluir" data-id="${habito.id}" title="Excluir hábito">Excluir</button>
                    </div>
                `;
                ul.appendChild(li);
            });
            habitosListaContainer.appendChild(ul);

            // AÇÃO: EXCLUIR
            ul.querySelectorAll('.btn-excluir').forEach(button => {
                button.addEventListener('click', async (e) => {
                    if (confirm('Excluir este hábito permanentemente?')) {
                        try {
                            await api.habitos.delete(e.target.dataset.id);
                            if (editandoId == e.target.dataset.id) limparModoEdicao();
                            loadHabitos();
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                });
            });

            // AÇÃO: CONCLUIR (Feito)
            ul.querySelectorAll('.btn-concluir').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const habitoId = e.target.dataset.id;
                    const hoje = new Date().toISOString().split('T')[0];
                    const novoRegistro = {
                        data: hoje,
                        observacao: "Concluído via App",
                        usuarioId: userId,
                        habito: { id: habitoId }
                    };
                    try {
                        await api.registros.create(novoRegistro);
                        alert('Hábito registrado com sucesso para hoje!');
                    } catch (error) {
                        alert('Erro ao registrar: ' + error.message);
                    }
                });
            });

            // AÇÃO: EDITAR
            ul.querySelectorAll('.btn-editar').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const habitoParaEditar = meusHabitos.find(h => h.id == id);

                    if (habitoParaEditar) {
                        editandoId = id;
                        // Preenche o formulário
                        document.getElementById('habito-nome').value = habitoParaEditar.nome;
                        document.getElementById('habito-tipo').value = habitoParaEditar.tipo;
                        document.getElementById('habito-descricao').value = habitoParaEditar.descricao;

                        // Muda visual do formulário
                        tituloForm.textContent = 'Editando: ' + habitoParaEditar.nome;
                        btnSalvar.textContent = 'ATUALIZAR HÁBITO';
                        btnCancelar.style.display = 'inline-block';

                        formCriarHabito.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

        } catch (error) {
            console.error(error);
            habitosListaContainer.innerHTML = `<p style="color:red">Erro ao carregar hábitos.</p>`;
        }
    };

    formCriarHabito.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const dadosForm = {
            nome: document.getElementById('habito-nome').value,
            tipo: document.getElementById('habito-tipo').value,
            descricao: document.getElementById('habito-descricao').value,
            usuario: { id: parseInt(userId) }
        };

        try {
            if (editandoId) {
                // MODO EDIÇÃO
                await api.habitos.update(editandoId, dadosForm);
                alert('Hábito atualizado com sucesso!');
                limparModoEdicao();
            } else {
                // MODO CRIAÇÃO
                await api.habitos.create(dadosForm);
                formCriarHabito.reset();
            }
            loadHabitos();
        } catch (error) {
            alert('Erro ao salvar: ' + error.message);
        }
    });

    loadHabitos();
};

// --- COMPONENTE DE DIETAS ---

const renderDietasPage = async () => {
    // Variável de controle
    let editandoId = null;

    appContent.innerHTML = `
        <h2>MINHA DIETA</h2>
        <form id="form-criar-dieta">
            <h3 id="titulo-form-dieta">Adicionar Nova Refeição</h3>
            
            <label for="dieta-refeicao">Refeição:</label>
            <input type="text" id="dieta-refeicao" placeholder="Ex: Café da Manhã" required>
            
            <label for="dieta-descricao">O que vou comer?</label>
            <input type="text" id="dieta-descricao" placeholder="Ex: 2 Ovos e Café sem açúcar" required>
            
            <label for="dieta-calorias">Calorias (kcal):</label>
            <input type="number" id="dieta-calorias" placeholder="Ex: 150" step="0.1" required>
            
            <div style="display:flex; gap:10px;">
                <button type="submit" id="btn-salvar-dieta">SALVAR REFEIÇÃO</button>
                <button type="button" id="btn-cancelar-edicao" style="display:none; background-color: #95a5a6;">CANCELAR</button>
            </div>
        </form>
        <hr>
        <div id="dietas-lista">
            <p>Carregando...</p>
        </div>
    `;

    const dietasListaContainer = document.getElementById('dietas-lista');
    const formCriarDieta = document.getElementById('form-criar-dieta');
    const btnSalvar = document.getElementById('btn-salvar-dieta');
    const btnCancelar = document.getElementById('btn-cancelar-edicao');
    const tituloForm = document.getElementById('titulo-form-dieta');

    // Função para limpar o modo de edição e voltar ao modo de criação
    const limparModoEdicao = () => {
        editandoId = null;
        formCriarDieta.reset();
        btnSalvar.textContent = 'SALVAR REFEIÇÃO';
        tituloForm.textContent = 'Adicionar Nova Refeição';
        btnCancelar.style.display = 'none';
        // Remove destaque amarelo se houvesse na lista
    };

    btnCancelar.addEventListener('click', limparModoEdicao);

    const loadDietas = async () => {
        dietasListaContainer.innerHTML = '<p>Carregando...</p>';
        try {
            const dietas = await api.dietas.getAll();
            dietasListaContainer.innerHTML = '';

            const userId = parseInt(localStorage.getItem('userId'));
            // Filtra as dietas do usuário
            const minhasDietas = dietas.filter(d => d.usuario && d.usuario.id === userId);

            if (minhasDietas.length === 0) {
                dietasListaContainer.innerHTML = '<p>Nenhuma refeição cadastrada.</p>';
                return;
            }

            const ul = document.createElement('ul');

            minhasDietas.forEach(dieta => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>
                        <strong>${dieta.nomeRefeicao}</strong> <small>(${dieta.calorias} kcal)</small><br>
                        <small style="color: #666;">${dieta.descricao}</small>
                    </span>
                    <div class="habito-actions">
                        <button class="btn-editar" data-id="${dieta.id}" title="Editar refeição">Editar</button>
                        <button class="btn-excluir" data-id="${dieta.id}" title="Remover refeição">Excluir</button>
                    </div>
                `;
                ul.appendChild(li);
            });
            dietasListaContainer.appendChild(ul);

            // AÇÃO: EXCLUIR
            ul.querySelectorAll('.btn-excluir').forEach(button => {
                button.addEventListener('click', async (e) => {
                    if (confirm('Remover esta refeição?')) {
                        try {
                            await api.dietas.delete(e.target.dataset.id);
                            // Se estava editando o item excluído, cancela a edição
                            if (editandoId == e.target.dataset.id) limparModoEdicao();
                            loadDietas();
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                });
            });

            // AÇÃO: EDITAR
            ul.querySelectorAll('.btn-editar').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    // Encontra a dieta nos dados que já temos
                    const dietaParaEditar = minhasDietas.find(d => d.id == id);

                    if (dietaParaEditar) {
                        editandoId = id;
                        // Preenche o formulário
                        document.getElementById('dieta-refeicao').value = dietaParaEditar.nomeRefeicao;
                        document.getElementById('dieta-descricao').value = dietaParaEditar.descricao;
                        document.getElementById('dieta-calorias').value = dietaParaEditar.calorias;

                        // Muda visual do formulário
                        tituloForm.textContent = 'Editando: ' + dietaParaEditar.nomeRefeicao;
                        btnSalvar.textContent = 'ATUALIZAR REFEIÇÃO';
                        btnCancelar.style.display = 'inline-block';

                        // Rola a tela até o formulário
                        formCriarDieta.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

        } catch (error) {
            console.error(error);
            dietasListaContainer.innerHTML = `<p style="color:red">Erro ao carregar dieta.</p>`;
        }
    };

    formCriarDieta.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        const dadosForm = {
            nomeRefeicao: document.getElementById('dieta-refeicao').value,
            descricao: document.getElementById('dieta-descricao').value,
            calorias: parseFloat(document.getElementById('dieta-calorias').value),
            usuario: { id: parseInt(userId) }
        };

        try {
            if (editandoId) {
                // MODO EDIÇÃO: Chama update
                await api.dietas.update(editandoId, dadosForm);
                alert('Refeição atualizada com sucesso!');
                limparModoEdicao(); // Volta ao estado inicial
            } else {
                // MODO CRIAÇÃO: Chama create
                await api.dietas.create(dadosForm);
                formCriarDieta.reset();
            }
            loadDietas(); // Recarrega a lista
        } catch (error) {
            alert('Erro ao salvar: ' + error.message);
        }
    });

    loadDietas();
};

// COMPONENTE: PÁGINA DE EVOLUÇÃO
const renderEvolucaoPage = () => {
    const hoje = new Date().toISOString().split('T')[0];
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    appContent.innerHTML = `
        <h2>Sua Evolução</h2>
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
        <div id="resultado-evolucao" style="display: none; animation: fadeIn 0.5s;"></div>
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
            const dados = await api.evolucao.get(userId, inicio, fim);
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
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Consistência</label>
                        <div style="background: #e0e0e0; border-radius: 15px; height: 25px; width: 100%; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);">
                            <div style="background: linear-gradient(90deg, #f1c40f, #2ecc71); 
                                        height: 100%; 
                                        width: ${Math.min(dados.progresso * 100, 100)}%;
                                        transition: width 1s ease-in-out;">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            resultadoDiv.innerHTML = `<p style="color: red; background: #fee; padding: 10px; border-radius: 5px;">Erro: ${error.message}</p>`;
        }
    });
};

// COMPONENTE: MEU PERFIL (ATUALIZAR DADOS)
const renderPerfilPage = async () => {
    const userId = localStorage.getItem('userId');
    appContent.innerHTML = '<h3>Carregando perfil...</h3>';
    try {
        const usuario = await api.usuarios.getById(userId);
        appContent.innerHTML = `
            <h2>Meu Perfil</h2>
            <p>Atualize seus dados para recalcular seu IMC e metas.</p>
            <form id="form-perfil">
                <label for="perfil-nome">Nome:</label>
                <input type="text" id="perfil-nome" value="${usuario.nome}" required>
                <label for="perfil-email">Email:</label>
                <input type="email" id="perfil-email" value="${usuario.email}" required>
                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1;">
                        <label for="perfil-idade">Idade:</label>
                        <input type="number" id="perfil-idade" value="${usuario.idade}" required>
                    </div>
                    <div style="flex: 1;">
                        <label for="perfil-peso">Peso (kg):</label>
                        <input type="number" id="perfil-peso" value="${usuario.peso}" step="0.1" required>
                    </div>
                    <div style="flex: 1;">
                        <label for="perfil-altura">Altura (m):</label>
                        <input type="number" id="perfil-altura" value="${usuario.altura}" step="0.01" required>
                    </div>
                </div>
                <button type="submit" style="background-color: #3498db;">SALVAR ALTERAÇÕES</button>
            </form>
        `;

        document.getElementById('form-perfil').addEventListener('submit', async (e) => {
            e.preventDefault();
            const dadosAtualizados = {
                nome: document.getElementById('perfil-nome').value,
                email: document.getElementById('perfil-email').value,
                idade: parseInt(document.getElementById('perfil-idade').value),
                peso: parseFloat(document.getElementById('perfil-peso').value),
                altura: parseFloat(document.getElementById('perfil-altura').value),
                senha: usuario.senha
            };
            try {
                await api.usuarios.update(userId, dadosAtualizados);
                localStorage.setItem('userName', dadosAtualizados.nome);
                alert('Perfil atualizado com sucesso!');
                await renderSidebar();
            } catch (error) {
                alert('Erro ao atualizar: ' + error.message);
            }
        });
    } catch (error) {
        appContent.innerHTML = `<p style="color:red">Erro ao carregar perfil: ${error.message}</p>`;
    }
};