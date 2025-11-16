package com.habitos.sistema_habitos_saudaveis.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.habitos.sistema_habitos_saudaveis.model.RegistroDiario;
import com.habitos.sistema_habitos_saudaveis.exception.ResourceNotFoundException;
import org.springframework.stereotype.Component;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RegistroRepository {
    private static final String FILE_PATH = "registros.json";
    private final ObjectMapper objectMapper;

    public RegistroRepository() {
        this.objectMapper = new ObjectMapper();
        // Necessário para serializar/deserializar LocalDate
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    private List<RegistroDiario> readAll() {
        try {
            File file = new File(FILE_PATH);
            if (!file.exists() || file.length() == 0) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(file, new TypeReference<List<RegistroDiario>>() {});
        } catch (IOException e) {
            System.err.println("Erro ao ler registros do arquivo: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private void writeAll(List<RegistroDiario> registros) {
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), registros);
        } catch (IOException e) {
            System.err.println("Erro ao escrever registros no arquivo: " + e.getMessage());
        }
    }

    // Método para o READ (Todos)
    public List<RegistroDiario> findAll() {
        return readAll();
    }

    // Método para o CREATE
    public RegistroDiario save(RegistroDiario registro) {
        List<RegistroDiario> registros = readAll();

        // Define o ID
        Long newId = registros.stream()
                .map(RegistroDiario::getId)
                .filter(java.util.Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(0L) + 1;

        registro.setId(newId);
        registros.add(registro);
        writeAll(registros);
        return registro;
    }

    // Método para o READ (Por ID)
    public Optional<RegistroDiario> findById(Long id) {
        return readAll().stream()
                .filter(r -> r.getId() != null && r.getId().equals(id))
                .findFirst();
    }

    // Método para o UPDATE
    public RegistroDiario update(RegistroDiario registroAtualizado) {
        List<RegistroDiario> registros = readAll();

        // Encontra o índice do registro a ser atualizado
        int index = -1;
        for (int i = 0; i < registros.size(); i++) {
            if (registros.get(i).getId() != null && registros.get(i).getId().equals(registroAtualizado.getId())) {
                index = i;
                break;
            }
        }

        if (index != -1) {
            registros.set(index, registroAtualizado);
            writeAll(registros);
            return registroAtualizado;
        }
        throw new ResourceNotFoundException("Registro não encontrado para atualização.");
    }

    // Método para o DELETE
    public void deleteById(Long id) {
        List<RegistroDiario> registros = readAll();

        List<RegistroDiario> registrosAtualizados = registros.stream()
                .filter(r -> !r.getId().equals(id))
                .collect(Collectors.toList());

        writeAll(registrosAtualizados);
    }

    // MÉTODO ESSENCIAL PARA O RELATÓRIO DE EVOLUÇÃO (Busca por filtros)
    public List<RegistroDiario> findByUsuarioIdAndDataBetween(
            Long usuarioId, LocalDate dataInicio, LocalDate dataFim) {

        return readAll().stream()
                .filter(r -> r.getUsuarioId() != null && r.getUsuarioId().equals(usuarioId))
                .filter(r -> !r.getData().isBefore(dataInicio) && !r.getData().isAfter(dataFim))
                .collect(Collectors.toList());
    }
}