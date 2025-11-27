package com.habitos.sistema_habitos_saudaveis.repository;

import com.habitos.sistema_habitos_saudaveis.model.RegistroDiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RegistroRepository extends JpaRepository<RegistroDiario, Long> {

    List<RegistroDiario> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate dataInicio, LocalDate dataFim);
}