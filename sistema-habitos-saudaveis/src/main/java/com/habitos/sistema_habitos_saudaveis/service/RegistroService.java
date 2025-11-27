package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.model.RegistroDiario;
import com.habitos.sistema_habitos_saudaveis.repository.RegistroRepository;
import com.habitos.sistema_habitos_saudaveis.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    public RegistroDiario criarRegistro(RegistroDiario registro) {
        return registroRepository.save(registro);
    }

    public RegistroDiario buscarRegistroPorId(Long id) {
        return registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro não encontrado com ID: " + id));
    }

    // Esse método usa JPA para filtrar no banco
    public List<RegistroDiario> buscarRegistrosPorPeriodo(Long usuarioId, LocalDate dataInicio, LocalDate dataFim) {
        return registroRepository.findByUsuarioIdAndDataBetween(usuarioId, dataInicio, dataFim);
    }

    public RegistroDiario atualizarRegistro(Long id, RegistroDiario detalhesRegistro) {
        RegistroDiario registroExistente = buscarRegistroPorId(id);

        registroExistente.setData(detalhesRegistro.getData());
        registroExistente.setObservacao(detalhesRegistro.getObservacao());
        return registroRepository.save(registroExistente);
    }

    public void deletarRegistro(Long id) {
        if (!registroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Registro não encontrado com ID: " + id);
        }
        registroRepository.deleteById(id);
    }
}