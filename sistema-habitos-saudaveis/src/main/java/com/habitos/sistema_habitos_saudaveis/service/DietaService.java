package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.model.Dieta;
import com.habitos.sistema_habitos_saudaveis.repository.DietaRepository;
import com.habitos.sistema_habitos_saudaveis.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DietaService {

    @Autowired
    private DietaRepository dietaRepository;

    public Dieta criarDieta(Dieta dieta) {
        return dietaRepository.save(dieta);
    }

    public List<Dieta> buscarTodas() {
        return dietaRepository.findAll();
    }

    public void deletarDieta(Long id) {
        if (!dietaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dieta não encontrada com ID: " + id);
        }
        dietaRepository.deleteById(id);
    }

    public Dieta atualizarDieta(Long id, Dieta dietaAtualizada) {
        Dieta dietaExistente = dietaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dieta não encontrada com ID: " + id));

        dietaExistente.setNomeRefeicao(dietaAtualizada.getNomeRefeicao());
        dietaExistente.setDescricao(dietaAtualizada.getDescricao());
        dietaExistente.setCalorias(dietaAtualizada.getCalorias());

        return dietaRepository.save(dietaExistente);
    }
}

