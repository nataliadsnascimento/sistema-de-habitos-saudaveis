# 📊 Sistema de Hábitos Saudáveis
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Objetivo do Projeto

Este projeto consiste no desenvolvimento de uma **API RESTful** para monitorar e gerenciar hábitos saudáveis.

A aplicação foi desenvolvida em **Java** e utiliza o framework **Spring Boot** para construir uma arquitetura robusta baseada em Programação Orientada a Objetos (POO), seguindo os padrões de Controller, Service e Repository.

---

## Funcionalidades

A API gerencia três entidades principais e uma lógica de negócio:

### 1. Usuários (`/usuarios`)
* `POST /usuarios`: Cria um novo usuário.
* `GET /usuarios`: Lista todos os usuários.
* `GET /usuarios/{id}`: Busca um usuário por ID.
* `PUT /usuarios/{id}`: Atualiza um usuário.
* `DELETE /usuarios/{id}`: Deleta um usuário.
* `GET /usuarios/{id}/imc`: Calcula o IMC (Índice de Massa Corporal) do usuário.

### 2. Hábitos (`/habitos`)
* `POST /habitos`: Cria um novo hábito.
* `GET /habitos`: Lista todos os hábitos.
* `GET /habitos/{id}`: Busca um hábito por ID.
* `PUT /habitos/{id}`: Atualiza um hábito.
* `DELETE /habitos/{id}`: Deleta um hábito.

### 3. Registros Diários (`/registros`)
* `POST /registros`: Cria um novo registro de hábito.
* `GET /registros/{id}`: Busca um registro por ID.
* `GET /registros?usuarioId={id}&dataInicio={data}&dataFim={data}`: Busca registros por período e usuário.
* `PUT /registros/{id}`: Atualiza um registro.
* `DELETE /registros/{id}`: Deleta um registro.

### 4. Evolução (`/evolucao`)
* `GET /evolucao?usuarioId={id}&dataInicio={data}&dataFim={data}`: Gera um relatório de progresso do usuário em um período.
* `GET /evolucao/demo`: Gera um relatório de demonstração dos últimos 7 dias para o usuário ID 1.

---

## Tecnologias utilizadas

| Categoria | Requisito | Aplicação |
| :--- | :--- | :--- |
| **Framework** | Spring Boot | Utilizado como o principal framework para desenvolvimento da API REST. |
| **Programação** | POO (Java) | Implementação completa de Classes, Objetos, **Encapsulamento**, **Herança**, e **Polimorfismo**. |
| **Arquitetura** | APIs RESTful | Todos os CRUDs implementados como endpoints REST (GET, POST, PUT, DELETE). |
| **Spring Core** | Injeção de Dependência (DI) | Uso de DI com anotações Spring essenciais: `@RestController`, `@Service`, `@Repository`. |
| **Persistência** | Dados Temporários | Gerenciamento de coleções de dados com **ArrayList** na camada de Serviço. |
| **Persistência** | Armazenamento | Dados persistidos e transferidos no formato **JSON**. |

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
