package com.habitos.sistema_habitos_saudaveis.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class registroDiario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;
    private String observacao;
    private boolean concluido; // basicamente para marcar se fez ou não o habito do dia

    @ManyToOne
    @JoinColumn(name = "habito_id")
    private Habito habito;
}
