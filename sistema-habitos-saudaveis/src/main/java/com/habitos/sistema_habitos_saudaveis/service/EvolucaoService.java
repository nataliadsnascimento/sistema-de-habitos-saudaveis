package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.model.Evolucao;
import com.habitos.sistema_habitos_saudaveis.model.RegistroDiario;
import com.habitos.sistema_habitos_saudaveis.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EvolucaoService {

    @Autowired
    private RegistroRepository registroRepository;

    public Evolucao gerarRelatorio(Long usuarioId, LocalDate dataInicio, LocalDate dataFim) {

        List<RegistroDiario> registrosEncontrados =
                registroRepository.findByUsuarioIdAndDataBetween(usuarioId, dataInicio, dataFim);

        // --- CÁLCULO DE PROGRESSO ---
        long totalRegistros = registrosEncontrados.size();
        long totalDiasNoPeriodo = ChronoUnit.DAYS.between(dataInicio, dataFim) + 1;

        double progresso;

        if (totalDiasNoPeriodo > 0) {
            progresso = (double) totalRegistros / totalDiasNoPeriodo;
        } else {
            progresso = 0.0;
        }

        progresso = Math.round(progresso * 100.0) / 100.0; // Arredonda para 2 casas

        // NOVO FORMATO DA META: INCLUI AS DATAS DE INÍCIO E FIM
        String metaDetalhada = String.format(
                "Análise do período: %s até %s (%d dias). Total de registros: %d.",
                dataInicio.toString(),
                dataFim.toString(),
                totalDiasNoPeriodo,
                totalRegistros
        );

        // O construtor Evolucao foi atualizado em uma etapa anterior para aceitar 3 parâmetros
        return new Evolucao(metaDetalhada, progresso, totalRegistros);
    }
}