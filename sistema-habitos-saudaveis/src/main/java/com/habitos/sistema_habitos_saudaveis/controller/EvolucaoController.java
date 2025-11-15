package com.habitos.sistema_habitos_saudaveis.controller;

import com.habitos.sistema_habitos_saudaveis.model.Evolucao;
import com.habitos.sistema_habitos_saudaveis.service.EvolucaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/evolucao")
public class EvolucaoController {

    @Autowired
    private EvolucaoService evolucaoService;

    @GetMapping
    public Evolucao gerarRelatorio(
            @RequestParam Long usuarioId,
            @RequestParam LocalDate dataInicio,
            @RequestParam LocalDate dataFim) {

        // Chama o serviço para gerar o relatório (que retorna o MOCK)
        return evolucaoService.gerarRelatorio(usuarioId, dataInicio, dataFim);
    }
}