package com.habitos.sistema_habitos_saudaveis.repository;

import com.habitos.sistema_habitos_saudaveis.model.Dieta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietaRepository extends JpaRepository<Dieta, Long>{
}
