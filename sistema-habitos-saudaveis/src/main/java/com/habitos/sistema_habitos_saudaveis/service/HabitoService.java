package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.model.Habito;
import com.habitos.sistema_habitos_saudaveis.repository.HabitoRepository;
import com.habitos.sistema_habitos_saudaveis.repository.RegistroRepository; // [NOVO]
import com.habitos.sistema_habitos_saudaveis.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // [NOVO]

import java.util.List;

@Service
public class HabitoService {

    @Autowired
    private HabitoRepository habitoRepository;

    @Autowired
    private RegistroRepository registroRepository; // [NOVO] Injetamos o repositório de registros

    public Habito criarHabito(Habito habito) {
        return habitoRepository.save(habito);
    }

    public List<Habito> buscarTodos() {
        return habitoRepository.findAll();
    }

    public Habito buscarPorId(Long id) {
        return habitoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hábito não encontrado com ID: " + id));
    }

    public Habito atualizarHabito(Long id, Habito detalhesHabito) {
        Habito habitoExistente = buscarPorId(id);

        habitoExistente.setNome(detalhesHabito.getNome());
        habitoExistente.setTipo(detalhesHabito.getTipo());
        habitoExistente.setDescricao(detalhesHabito.getDescricao());

        return habitoRepository.save(habitoExistente);
    }

    @Transactional
    public void deletarHabito(Long id) {
        if (!habitoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hábito não encontrado com ID: " + id);
        }

        registroRepository.deleteByHabitoId(id);
        habitoRepository.deleteById(id);
    }
}