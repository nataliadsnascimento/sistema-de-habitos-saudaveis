package com.habitos.sistema_habitos_saudaveis.repository;

import com.habitos.sistema_habitos_saudaveis.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}