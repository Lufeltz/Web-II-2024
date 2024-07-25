package com.server.api.rest;

import br.net.trabalho.api.model.Cliente;
import br.net.trabalho.api.model.Login;
import br.net.trabalho.api.model.Usuario;
import br.net.trabalho.api.repository.ClienteRepository;
import br.net.trabalho.api.repository.UsuarioRepository;
import br.net.trabalho.api.rest.dto.ClienteDTO;
import br.net.trabalho.api.rest.dto.UsuarioDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginREST {
    @Autowired
    private UsuarioRepository loginRepo;

    @Autowired
    private ClienteRepository cadastroRepo;

    @Autowired
    private ModelMapper mapper;

    @PostMapping("/login")
    UsuarioDTO login(@RequestBody Login login) {
        Usuario usuario = loginRepo.findByEmailAndSenha(login.getEmail(), login.getSenha());
        return mapper.map(usuario, UsuarioDTO.class);
    }

    @PostMapping("/cadastro")
    UsuarioDTO cadastro(@RequestBody ClienteDTO clienteDTO) {
        clienteDTO.setSenha("abc123");
        cadastroRepo.save(mapper.map(clienteDTO, Cliente.class));

        Usuario usuario = cadastroRepo.findByEmail(clienteDTO.getEmail());

        return mapper.map(usuario, UsuarioDTO.class);
    }
}
}
