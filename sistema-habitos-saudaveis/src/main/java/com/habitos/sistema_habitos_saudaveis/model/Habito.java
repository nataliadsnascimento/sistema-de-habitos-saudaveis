package com.habitos.sistema_habitos_saudaveis.model;

import lombok.Data; // id, tipo, descrição

@Data
public class Habito {
    private Long id;
    private String tipo;
    private String descricao;
    private Usuario usuario; // Relação simples
}