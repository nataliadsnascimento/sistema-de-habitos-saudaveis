package com.habitos.sistema_habitos_saudaveis.repository;

import com.habitos.sistema_habitos_saudaveis.model.Habito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitoRepository extends JpaRepository<Habito, Long> {

}