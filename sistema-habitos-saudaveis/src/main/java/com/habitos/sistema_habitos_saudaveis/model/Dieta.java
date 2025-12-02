package com.habitos.sistema_habitos_saudaveis.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Dieta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeRefeicao;
    private String descricao;
    private double calorias;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
