package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.exception.ResourceNotFoundException;
import com.habitos.sistema_habitos_saudaveis.model.Habito;
import com.habitos.sistema_habitos_saudaveis.repository.HabitoRepository; // Agora é a classe DAO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HabitoService {

    @Autowired
    private HabitoRepository habitoRepository;

    // C - Create
    public Habito criarHabito(Habito habito) {
        // O Repository agora lida com a atribuição de ID e salvamento em JSON
        return habitoRepository.save(habito);
    }

    // R - Read All
    public List<Habito> buscarTodos() {
        return habitoRepository.findAll();
    }

    // R - Read by ID
    public Habito buscarPorId(Long id) {
        return habitoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hábito não encontrado com ID: " + id));
    }

    // U - Update
    public Habito atualizarHabito(Long id, Habito detalhesHabito) {
        // 1. Garante que o hábito existe (lança 404 se não existir)
        buscarPorId(id);

        // 2. Define o ID no objeto de detalhes que será salvo
        detalhesHabito.setId(id);

        // 3. Salva a versão atualizada (Repository atualiza a lista e o JSON)
        return habitoRepository.save(detalhesHabito);
    }

    // D - Delete
    public void deletarHabito(Long id) {
        // Verifica se o ID existe (para lançar 404 se não existir)
        buscarPorId(id);
        // Chama o método de deleção no Repository
        habitoRepository.deleteById(id);
    }
}//funcionando