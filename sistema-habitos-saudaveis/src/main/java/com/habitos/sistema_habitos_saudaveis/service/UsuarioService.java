package com.habitos.sistema_habitos_saudaveis.service;

import com.habitos.sistema_habitos_saudaveis.exception.ResourceNotFoundException;
import com.habitos.sistema_habitos_saudaveis.model.Usuario;
import com.habitos.sistema_habitos_saudaveis.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository; //Injeta o repository de Usuário

    //Create
    public Usuario criarUsuario(Usuario usuario) {
        //O Repository lida com a atribuição de ID e salvamento em JSON
        return usuarioRepository.save(usuario);
    }

    //Read all
    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    //Read by id
    public Usuario buscarPorId(Long id) {
        //Usa a exceção que já existe no projeto
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + id));
    }

    //Update
    public Usuario atualizarUsuario(Long id, Usuario detalhesUsuario) {
        //Garante que o usuário existe
        buscarPorId(id);
        //Define o ID no objeto de detalhes que será salvo
        detalhesUsuario.setId(id);
        //Salva a versão atualizada
        return usuarioRepository.save(detalhesUsuario);
    }

    //Delete
    public void deletarUsuario(Long id) {
        // Verifica se o ID existe
        buscarPorId(id);
        usuarioRepository.deleteById(id);
    }

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