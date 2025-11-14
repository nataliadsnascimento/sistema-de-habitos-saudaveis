package com.habitos.sistema_habitos_saudaveis.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.habitos.sistema_habitos_saudaveis.model.Habito;
import org.springframework.stereotype.Repository;


import jakarta.annotation.PostConstruct; // Usado para inicialização do Spring
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class HabitoRepository {

    // Define o caminho do arquivo JSON onde os dados serão persistidos
    private final String FILE_PATH = "habitos.json";
    private List<Habito> habitos = new ArrayList<>();
    private final ObjectMapper mapper = new ObjectMapper(); // Objeto Jackson para ler/escrever JSON

    // Usado para garantir IDs únicos
    private AtomicLong nextId = new AtomicLong(1);

    /**
     * Carrega os dados do arquivo JSON na memória (ArrayList) assim que o Spring inicializa.
     */
    @PostConstruct
    public void loadData() {
        try {
            File file = new File(FILE_PATH);
            if (file.exists() && file.length() > 0) {
                // Lê o JSON do arquivo e converte para ArrayList<Habito>
                habitos = mapper.readValue(file, new TypeReference<List<Habito>>() {});
                // Garante que o contador de ID continue de onde parou
                habitos.stream().mapToLong(Habito::getId).max().ifPresent(maxId -> nextId.set(maxId + 1));
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar dados do arquivo JSON: " + e.getMessage());
            habitos = new ArrayList<>();
        }
    }

    /**
     * Salva o estado atual do ArrayList de volta no arquivo JSON.
     */
    private void saveData() {
        try {
            // Escreve a lista completa no arquivo JSON (formato legível 'pretty print')
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), habitos);
        } catch (IOException e) {
            System.err.println("Erro ao salvar dados no arquivo JSON: " + e.getMessage());
        }
    }

    // CREATE / UPDATE
    public Habito save(Habito habito) {
        if (habito.getId() == null) {
            // CREATE: Gera novo ID e adiciona na lista
            habito.setId(nextId.getAndIncrement());
            habitos.add(habito);
        } else {
            // UPDATE: Encontra e substitui o objeto na lista
            habitos = habitos.stream()
                    .map(h -> h.getId().equals(habito.getId()) ? habito : h)
                    .collect(Collectors.toList());
        }
        saveData(); // Persiste no arquivo
        return habito;
    }

    // READ ALL
    public List<Habito> findAll() {
        return new ArrayList<>(habitos); // Retorna uma cópia
    }

    // READ BY ID
    public Optional<Habito> findById(Long id) {
        return habitos.stream()
                .filter(h -> h.getId().equals(id))
                .findFirst();
    }

    // DELETE
    public void deleteById(Long id) {
        boolean removed = habitos.removeIf(h -> h.getId().equals(id));
        if (removed) {
            saveData(); // Persiste no arquivo
        }
    }
}//funcionando