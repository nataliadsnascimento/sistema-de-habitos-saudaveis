package com.habitos.sistema_habitos_saudaveis.model;

import lombok.Data; // meta, progresso

@Data
public class Evolucao {
    private String meta;
    private double progresso;

    public Evolucao(String meta, double progresso) {
        this.meta = meta;
        this.progresso = progresso;
    }
}