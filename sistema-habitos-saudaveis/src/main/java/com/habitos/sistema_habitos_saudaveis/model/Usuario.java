package com.habitos.sistema_habitos_saudaveis.model;

import lombok.Data; // id, nome, email, idade

@Data
public class Usuario {
    private Long id;
    private String nome;
    private String email;
    private int idade;
}