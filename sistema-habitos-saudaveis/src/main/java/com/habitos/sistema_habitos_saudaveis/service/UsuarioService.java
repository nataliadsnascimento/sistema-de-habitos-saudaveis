package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.model.Usuario;
import com.habitos.sistema_habitos_saudaveis.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 1. CREATE
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // 2. READ ALL
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    // 3. READ BY ID (Método auxiliar usado internamente e pelo Controller)
    public Usuario buscarPorId(Long usuarioId) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        if (usuario.isEmpty()) {
            // Em um projeto real, lançaríamos uma ResourceNotFoundException
            throw new IllegalArgumentException("Usuário não encontrado com ID: " + usuarioId);
        }
        return usuario.get();
    }

    // 4. UPDATE
    public Usuario atualizarUsuario(Long id, Usuario detalhesUsuario) {
        Usuario usuarioExistente = buscarPorId(id);

        // Simplesmente atualizamos todos os campos, garantindo que o ID permaneça
        detalhesUsuario.setId(id);

        // Chamada direta ao Repositório para salvar a atualização
        // NOTE: O UsuarioRepository precisa de um método 'update' ou o 'save' precisa lidar com atualizações.
        // Como o save do JSON lida apenas com inserção, vamos simular a atualização com o save
        // (Em projetos Spring Data JPA, o save lida com ambos).
        // Aqui, vamos apenas retornar o objeto atualizado.
        // O método 'deleteById' no Service já está correto, o do Repositório lida com o JSON

        // Para fins de compilação, vamos apenas retornar os detalhes (o repositório precisaria de lógica de update)
        return usuarioRepository.update(detalhesUsuario);
    }



    // 5. DELETE
    public void deletarUsuario(Long id) {
        // Verifica se existe (evita erro de não encontrado)
        buscarPorId(id);
        // Chama o método do repositório
        usuarioRepository.deleteById(id);
    }

    // LÓGICA DE NEGÓCIO: Cálculo de IMC
    public double calcularIMC(Long usuarioId) {
        Usuario usuario = buscarPorId(usuarioId);

        if (usuario.getAltura() <= 0 || usuario.getPeso() <= 0) {
            throw new IllegalArgumentException("Peso e Altura devem ser valores positivos para calcular o IMC.");
        }

        double altura = usuario.getAltura();
        double peso = usuario.getPeso();

        double imc = peso / (altura * altura);
        return imc;
    }
}