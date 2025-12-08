# 📊 Sistema de Hábitos Saudáveis

![Status](https://img.shields.io/badge/status-concluído-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Objetivo do Projeto

Este projeto consiste no desenvolvimento de um sistema completo para monitoramento de hábitos saudáveis.

**Backend (API RESTful):** Desenvolvido em Java com Spring Boot, seguindo arquitetura em camadas (Controller, Service, Repository) e POO. Utiliza banco de dados H2 para persistência.

**Frontend (Interface Web):** Interface desenvolvida com HTML5, CSS3 e JavaScript puro, consumindo a API via `fetch`. Possui navegação dinâmica sem recarregamento de página.

---

## Funcionalidades

### 1. Gestão de Usuários e Saúde
* **Autenticação:** Login e Cadastro com validação de credenciais.
* **Perfil do Usuário:** Atualização de dados cadastrais (peso, altura, idade).
* **Cálculo de IMC:** O sistema calcula automaticamente o Índice de Massa Corporal e exibe um feedback visual (cores) na barra lateral indicando a classificação (ex: Peso normal, Sobrepeso).

### 2. Gestão de Hábitos (`/habitos`)
* Criar novos hábitos (ex: "Beber água", "Ler 10 páginas").
* Listar hábitos ativos do usuário.
* Marcar hábitos como "Feito" (gera um registro automático).
* Excluir hábitos.

### 3. Gestão de Dieta e Nutrição (`/dietas`) 
* Registro de refeições diárias.
* Controle de calorias por refeição.
* Descrição detalhada dos alimentos consumidos.
* Edição e remoção de registros de dieta.

### 4. Diário e Registros (`/registros`)
* Histórico de execução de hábitos com data e observações.
* Conclusão rápida de tarefas diretamente pelo Dashboard.

### 5. Relatórios de Evolução (`/evolucao`)
* Dashboard visual com barra de progresso.
* Endpoint `/evolucao/demo` para testes rápidos.
* Filtro personalizado por período (Data Início e Fim) para analisar a consistência dos hábitos.

---

## 🛠 Ferramentas utilizadas

| Camada | Tecnologia | Detalhes |
| :--- |:---| :--- |
| **Backend** | Java 21 + Spring Boot | API REST, Spring Data JPA, Lombok. |
| **Banco de Dados** | H2 Database | Banco em memória/arquivo para desenvolvimento ágil. |
| **Frontend** | JavaScript (ES6+) | Lógica de SPA, Fetch API, manipulação de DOM. |
| **Estilização** | CSS3 | CSS modular (`auth.css`, `habitos.css`, etc) e Design Responsivo. |
| **Documentação** | Swagger (OpenAPI) | Documentação automática acessível em `/swagger-ui.html`. |

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

3.  **Acesse o Sistema:**
    * Frontend e API estarão disponíveis em: `http://localhost:8080`
    * Documentação Swagger: `http://localhost:8080/swagger-ui.html`
    * Console do Banco H2: `http://localhost:8080/h2-console`

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