# 📊 Sistema de Hábitos Saudáveis
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Objetivo do Projeto

Este projeto consiste no desenvolvimento de um sistema para monitoramento de hábitos saudáveis.

**Backend (API RESTful):** Desenvolvido em Java com Spring Boot, seguindo arquitetura em camadas (Controller, Service, Repository) e POO.

**Frontend (Interface Web):** Interface responsiva desenvolvida com HTML5, CSS3 e JavaScript, consumindo a API via `fetch`.

---

## Funcionalidades
### 1. Autenticação de Usuários
* Validação de e-mail e senha diretamente no Backend.
* Criação de conta com dados pessoais (nome, idade, peso, altura) e credenciais.

### 2. Gestão de Hábitos (`/habitos`)
* Criar novos hábitos (ex: "Beber água", "Correr").
* Listar hábitos (exibe apenas os hábitos do usuário logado).
* Excluir hábitos.

### 3. Diário e Registros (`/registros`)
* Registar a execução de um hábito numa data específica.
* Histórico de atividades.

### 4. Relatórios de Evolução (`/evolucao`)
O sistema calcula o progresso do usuário com base nos registos:
* Endpoint `/evolucao/demo` que gera um relatório automático dos últimos 7 dias.
* Cálculo dinâmico por período.

---

## Estrutura da API (Endpoints)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **POST** | `/usuarios` | Cadastra um novo usuário com cálculo automático de IMC futuro. |
| **GET** | `/usuarios` | Lista usuários para validação de login. |
| **GET** | `/habitos` | Lista todos os hábitos (filtrados no front pelo ID do usuário). |
| **POST** | `/habitos` | Cria um hábito vinculado a um usuário. |
| **DELETE** | `/habitos/{id}` | Remove um hábito. |
| **GET** | `/evolucao` | `?usuarioId=1&dataInicio=...&dataFim=...` (Gera métricas). |

## Tecnologias utilizadas

| Camada | Tecnologia            | Detalhes |
| :--- |:----------------------| :--- |
| **Backend** | Java 21 + Spring Boot | API REST, Injeção de Dependência, Spring Data JPA. |
| **Banco de Dados** | H2 Database           | Banco em memória/arquivo para persistência ágil. |
| **Frontend** | JavaScript            | Lógica de consumo de API (Fetch), manipulação de DOM e `localStorage`. |
| **Frontend** | HTML5 & CSS3          | Estrutura semântica e estilização responsiva. |
| **Documentação** | Swagger (OpenAPI)     | Documentação automática dos endpoints. |
---

## 💻 Como Executar o Projeto

### Pré-requisitos
* **Java JDK 21**
* **Maven**

### Passos
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/nataliadsnascimento/Sistema-de-Habitos-Saudaveis.git](https://github.com/nataliadsnascimento/Sistema-de-Habitos-Saudaveis.git)
    cd Sistema-de-Habitos-Saudaveis
    ```

2.  **Compile o projeto (usando Maven como exemplo):**
    ```bash
    # Navegue até a pasta raiz do projeto e execute:
    mvn clean install
    ```

3.  **Execute a aplicação Spring Boot:**
    ```bash
    # Na mesma pasta, execute:
    mvn spring-boot:run
    ```

4.  **Acesse a API:**
    * O servidor deve iniciar na porta padrão do Spring Boot, **8080**.
    * A API REST estará acessível em `http://localhost:8080/api/...`

---

## 🧑‍💻 Autores

Este projeto foi desenvolvido por:

| Nome | GitHub |
|------|--------|
| Natália Nascimento | [@nataliadsnascimento](https://github.com/nataliadsnascimento) |
| Kelven Daniel | [@k3lven](https://github.com/k3lven) |
| Letícia Guardiola | [@leticiaguardiolaabbreus-gif](https://github.com/leticiaguardiolaabreus-gif) |
| João Marcelo | [@cruz-jmc](https://github.com/cruz-jmc)|

---
## 📄 Licença

Este projeto está licenciado sob a Licença MIT
