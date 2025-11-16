package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.model.RegistroDiario;
import com.habitos.sistema_habitos_saudaveis.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.habitos.sistema_habitos_saudaveis.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    // 1. CREATE
    public RegistroDiario criarRegistro(RegistroDiario registro) {
        return registroRepository.save(registro);
    }

    // 2. READ (Busca por ID - essencial para os métodos PUT/DELETE)
    public RegistroDiario buscarRegistroPorId(Long id) {
        Optional<RegistroDiario> registro = registroRepository.findById(id);
        if (registro.isEmpty()) {
            throw new ResourceNotFoundException("Registro diário não encontrado com ID: " + id);
        }
        return registro.get();
    }

    // 3. READ (Busca filtrada - usa o método do Repositório que será usado na Evolucao)
    public List<RegistroDiario> buscarRegistrosPorPeriodo(Long usuarioId, LocalDate dataInicio, LocalDate dataFim) {
        return registroRepository.findByUsuarioIdAndDataBetween(usuarioId, dataInicio, dataFim);
    }

    // 4. UPDATE (Atualizar)
    public RegistroDiario atualizarRegistro(Long id, RegistroDiario detalhesRegistro) {
        RegistroDiario registroExistente = buscarRegistroPorId(id);

        // Copia os novos detalhes para o objeto existente
        registroExistente.setData(detalhesRegistro.getData());
        registroExistente.setObservacao(detalhesRegistro.getObservacao());
        registroExistente.setHabito(detalhesRegistro.getHabito());
        // Não é ideal mudar o usuarioId, mas está aqui por completude
        registroExistente.setUsuarioId(detalhesRegistro.getUsuarioId());

        return registroRepository.update(registroExistente);
    }

    // 5. DELETE
    public void deletarRegistro(Long id) {
        buscarRegistroPorId(id); // Verifica se existe
        registroRepository.deleteById(id);
    }
}