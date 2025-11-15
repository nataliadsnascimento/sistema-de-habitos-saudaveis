package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.model.Evolucao;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class EvolucaoService {

    public Evolucao gerarRelatorio(Long usuarioId, LocalDate dataInicio, LocalDate dataFim) {

        System.out.println("Gerando relatório MOCK para o Usuário " + usuarioId
                + " de " + dataInicio + " até " + dataFim);

        // LÓGICA MOCK: Simula um cálculo baseado no ID do usuário
        double progressoSimulado = (usuarioId % 2 == 0) ? 0.85 : 0.60;

        // Retorna o objeto Evolucao (Model)
        return new Evolucao("Meta semanal de 70% de conclusão de hábitos.", progressoSimulado);
    }
}