package com.habitos.sistema_habitos_saudaveis.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class RegistroDiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;
    private String observacao;

    // Relacionamento: Um registro pertence a um hábito
    @ManyToOne
    @JoinColumn(name = "habito_id")
    private Habito habito;
    private Long usuarioId;
}