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

    // 1. INJEÇÃO: Integração com o trabalho da Pessoa 3
    @Autowired
    private RegistroRepository registroRepository;

    public Evolucao gerarRelatorio(Long usuarioId, LocalDate dataInicio, LocalDate dataFim) {

        System.out.println("Gerando relatório REAL para o Usuário " + usuarioId
                + " de " + dataInicio + " até " + dataFim);

        // 2. BUSCA: Utiliza o método de filtro do Repositório para obter os dados reais.
        List<RegistroDiario> registrosEncontrados =
                registroRepository.findByUsuarioIdAndDataBetween(usuarioId, dataInicio, dataFim);

        // --- CÁLCULO REAL DE PROGRESSO ---

        // Número de registros (hábitos concluídos)
        long totalRegistros = registrosEncontrados.size();

        // Número de dias no período (adicionamos 1 para incluir o dia final)
        long totalDiasNoPeriodo = ChronoUnit.DAYS.between(dataInicio, dataFim) + 1;

        double progresso;

        if (totalDiasNoPeriodo > 0) {
            // Progresso = Registros / Dias no Período
            progresso = (double) totalRegistros / totalDiasNoPeriodo;
        } else {
            progresso = 0.0;
        }

        // Formata para ter no máximo duas casas decimais, por exemplo (opcional)
        progresso = Math.round(progresso * 100.0) / 100.0;

        // Retorna o objeto Evolucao (Model) com o resultado REAL
        return new Evolucao("Progresso no período: " + totalDiasNoPeriodo + " dias.", progresso);
    }
}