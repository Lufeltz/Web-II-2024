package com.server.api.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import br.net.trabalho.api.model.Funcionario;
import br.net.trabalho.api.model.Usuario;
import br.net.trabalho.api.repository.FuncionarioRepository;
import br.net.trabalho.api.rest.dto.ClienteDTO;
import br.net.trabalho.api.rest.dto.FuncionarioDTO;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FuncionarioREST {
    public static List<Funcionario> lista = new ArrayList<>();
    
    @Autowired
    private FuncionarioRepository repo;

    @Autowired
    private ModelMapper mapper;

    @PostMapping("/funcionarios")
    FuncionarioDTO login(@RequestBody FuncionarioDTO funcionarioDTO) {
        repo.save(mapper.map(funcionarioDTO, Funcionario.class));

        Usuario usuario = repo.findByEmail(funcionarioDTO.getEmail());

        return mapper.map(usuario, FuncionarioDTO.class);
    }

    @GetMapping("/funcionarios")
	List<FuncionarioDTO> listarTodos() {
		List<Funcionario> lista = repo.findAll();
		return lista.stream().map(e -> mapper.map(e, FuncionarioDTO.class))
							  .collect(Collectors.toList());
	}

    

    @GetMapping(path = {"/funcionarios/{id}"})

	public ResponseEntity findById(@PathVariable long id) {
		return repo.findById(id).map(record -> ResponseEntity.ok().body(record)).orElse(ResponseEntity.notFound().build());
	}


	@PutMapping(value="/funcionarios/{id}")
public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody FuncionarioDTO funcionarioDTO) {
    return repo.findById(id).map(funci -> {
        funci.setNome(funcionarioDTO.getNome());
        funci.setEmail(funcionarioDTO.getEmail());
        funci.setDataNascimento(funcionarioDTO.getDataNascimento());
        Funcionario updated = repo.save(funci);
        return ResponseEntity.ok().body(updated);
    }).orElse(ResponseEntity.notFound().build());
}

	@DeleteMapping(path ={"/funcionarios/{id}"})

	public ResponseEntity<?> delete(@PathVariable long id) {
		return repo.findById(id)
		.map(rou -> {
			repo.deleteById(id);
			return ResponseEntity.ok().build();
		}).orElse(ResponseEntity.notFound().build());
	}
}