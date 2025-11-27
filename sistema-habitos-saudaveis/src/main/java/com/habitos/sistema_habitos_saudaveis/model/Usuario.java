package com.habitos.sistema_habitos_saudaveis.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID automático (1, 2...)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    private int idade;
    private double peso;
    private double altura;
}