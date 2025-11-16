package com.habitos.sistema_habitos_saudaveis.controller;

import com.habitos.sistema_habitos_saudaveis.model.Evolucao;
import com.habitos.sistema_habitos_saudaveis.service.EvolucaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/evolucao")
public class EvolucaoController {

    @Autowired
    private EvolucaoService evolucaoService;

    // --- CLASSE DE REQUEST PARA O MÉTODO POST ---
    // (Pode ser mantida separada se preferir)
    public static class EvolucaoRequest {
        private Long usuarioId;
        private LocalDate dataInicio;
        private LocalDate dataFim;

        // Getters e Setters (necessários para o @RequestBody)
        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public LocalDate getDataInicio() { return dataInicio; }
        public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
        public LocalDate getDataFim() { return dataFim; }
        public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    }


    // 1. ENDPOINT PRINCIPAL: GET via URL (Acessível no Navegador)
    // Recebe datas como String e faz a conversão manualmente, evitando erros de parsing do Spring.
    @GetMapping
    public ResponseEntity<Evolucao> gerarRelatorioViaURL(
            @RequestParam Long usuarioId,
            @RequestParam String dataInicio,
            @RequestParam String dataFim) {

        try {
            LocalDate inicio = LocalDate.parse(dataInicio);
            LocalDate fim = LocalDate.parse(dataFim);

            Evolucao relatorio = evolucaoService.gerarRelatorio(usuarioId, inicio, fim);
            return ResponseEntity.ok(relatorio);
        } catch (DateTimeParseException e) {
            // Retorna um erro amigável se a data estiver incorreta
            return ResponseEntity.badRequest().build();
        }
    }

    // 2. ENDPOINT PARA TESTE AVANÇADO: POST com Body JSON
    @PostMapping
    public ResponseEntity<Evolucao> gerarRelatorioViaBody(@RequestBody EvolucaoRequest request) {

        Evolucao relatorio = evolucaoService.gerarRelatorio(
                request.getUsuarioId(),
                request.getDataInicio(),
                request.getDataFim()
        );

        return ResponseEntity.ok(relatorio);
    }

    // 3. ENDPOINT DE DEMONSTRAÇÃO RÁPIDA: GET /evolucao/demo
    // Calcula automaticamente a evolução dos últimos 7 dias para o Usuário 1 (ID 1).
    @GetMapping("/demo")
    public ResponseEntity<Evolucao> gerarRelatorioDemonstracao() {
        // Assume o ID 1 e o período dos últimos 7 dias (excluindo hoje)
        LocalDate dataFim = LocalDate.now();
        LocalDate dataInicio = dataFim.minusDays(6);

        // Usuário fixo para a demonstração
        Long usuarioId = 1L;

        Evolucao relatorio = evolucaoService.gerarRelatorio(usuarioId, dataInicio, dataFim);
        return ResponseEntity.ok(relatorio);
    }
}