package com.habitos.sistema_habitos_saudaveis.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.habitos.sistema_habitos_saudaveis.model.Usuario;
import org.springframework.stereotype.Repository;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class UsuarioRepository {

    //Caminho do arquivo JSON para usuários
    private final String FILE_PATH = "usuarios.json";
    //Lista em memória para Usuários
    private List<Usuario> usuarios = new ArrayList<>();
    private final ObjectMapper mapper = new ObjectMapper();

    private AtomicLong nextId = new AtomicLong(1);

    //Carrega os dados do arquivo JSON na memória (ArrayList) assim que o Spring inicializa.
    @PostConstruct
    public void loadData() {
        try {
            File file = new File(FILE_PATH);
            if (file.exists() && file.length() > 0) {
                // Lê o JSON do arquivo e converte para ArrayList<Usuario>
                usuarios = mapper.readValue(file, new TypeReference<List<Usuario>>() {});
                // Garante que o contador de ID continue de onde parou
                usuarios.stream().mapToLong(Usuario::getId).max().ifPresent(maxId -> nextId.set(maxId + 1));
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar dados do arquivo JSON: " + e.getMessage());
            usuarios = new ArrayList<>();
        }
    }

    //Salva o estado atual do ArrayList de volta no arquivo JSON.
    private void saveData() {
        try {
            // Escreve a lista completa no arquivo JSON
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), usuarios);
        } catch (IOException e) {
            System.err.println("Erro ao salvar dados no arquivo JSON: " + e.getMessage());
        }
    }

    //create e update
    public Usuario save(Usuario usuario) {
        if (usuario.getId() == null) {
            // CREATE: Gera novo ID e adiciona na lista
            usuario.setId(nextId.getAndIncrement());
            usuarios.add(usuario);
        } else {
            // UPDATE: Encontra e substitui o objeto na lista
            usuarios = usuarios.stream()
                    .map(u -> u.getId().equals(usuario.getId()) ? usuario : u)
                    .collect(Collectors.toList());
        }
        saveData(); // Persiste no arquivo
        return usuario;
    }

    //Read all
    public List<Usuario> findAll() {
        return new ArrayList<>(usuarios); // Retorna uma cópia
    }

    //Read by id
    public Optional<Usuario> findById(Long id) {
        return usuarios.stream()
                .filter(u -> u.getId().equals(id))
                .findFirst();
    }

    //Delete
    public void deleteById(Long id) {
        boolean removed = usuarios.removeIf(u -> u.getId().equals(id));
        if (removed) {
            saveData(); // Persiste no arquivo
        }
    }
}