package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.model.Usuario;
import com.habitos.sistema_habitos_saudaveis.repository.UsuarioRepository;
import com.habitos.sistema_habitos_saudaveis.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + id));
    }

    public Usuario atualizarUsuario(Long id, Usuario detalhesUsuario) {
        // Busca o usuário do banco, se não achar dá erro
        Usuario usuarioExistente = buscarPorId(id);

        // Atualiza os dados do objeto recuperado
        usuarioExistente.setNome(detalhesUsuario.getNome());
        usuarioExistente.setEmail(detalhesUsuario.getEmail());
        usuarioExistente.setIdade(detalhesUsuario.getIdade());
        usuarioExistente.setPeso(detalhesUsuario.getPeso());
        usuarioExistente.setAltura(detalhesUsuario.getAltura());

        // Salva novamente
        return usuarioRepository.save(usuarioExistente);
    }

    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // IMC
    public double calcularIMC(Long usuarioId) {
        Usuario usuario = buscarPorId(usuarioId);

        if (usuario.getAltura() <= 0 || usuario.getPeso() <= 0) {
            throw new IllegalArgumentException("Peso e Altura devem ser valores positivos.");
        }
        return usuario.getPeso() / (usuario.getAltura() * usuario.getAltura());
    }
}