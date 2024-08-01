package com.server.api.rest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class RoupaREST {
	public List<Roupa> lista = new ArrayList<>(); /*Adicionei static para puxar a tabela inicial, mas acho q com o bd precisa remove o static */
	@Autowired
	private RoupaRepository repo;

	@Autowired
	private ModelMapper mapper;

	@PostMapping("/roupas")
	RoupaDTO inserir(@RequestBody
					RoupaDTO roupa) {
		repo.save(mapper.map(roupa, Roupa.class));
		Roupa rou = repo.findByNome(roupa.getNome());
		return mapper.map(rou, RoupaDTO.class);
	}

	@GetMapping("/roupas")
	List<RoupaDTO> listarTodos() {
		List<Roupa> lista = repo.findAll();
		return lista.stream().map(e -> mapper.map(e, RoupaDTO.class))
							 .collect(Collectors.toList());
	}

	// @GetMapping("/roupas/{id}")
	// List<RoupaDTO> buscarPorId(@PathVariable("id") int id) {
	// 	List<Roupa> lista = repo.findAll(); // Tentar mudar para findById ou mudar para o @query de baixo no put
	// 	return lista.stream().map(e -> mapper.map(e, RoupaDTO.class))
	// 						 .collect(Collectors.toList());
	// }

	@GetMapping(path = {"roupas/{id}"})
	public ResponseEntity findById(@PathVariable long id) {
		return repo.findById(id).map(record -> ResponseEntity.ok().body(record)).orElse(ResponseEntity.notFound().build());
	}

	@PutMapping(value="roupas/{id}")
	public ResponseEntity update(@PathVariable("id") long id,
								@RequestBody Roupa roupa) {
		return repo.findById(id)
		.map(rou -> {
			rou.setNome(roupa.getNome());
			rou.setPrazo(roupa.getPrazo());
			rou.setPreco(roupa.getPreco());
			Roupa updated = repo.save(rou);
			return ResponseEntity.ok().body(updated);
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping(path ={"roupas/{id}"})
	public ResponseEntity<?> delete(@PathVariable long id) {
		return repo.findById(id)
		.map(rou -> {
			repo.deleteById(id);
			return ResponseEntity.ok().build();
		}).orElse(ResponseEntity.notFound().build());
	}

//	 static	 {
//	 	lista.add(new Roupa(1, "calça", 12, 12.15));
//	 	lista.add(new Roupa(2, "camisa", 12, 12.15));
//	 	lista.add(new Roupa(3, "camiseta", 12, 12.15));
//	 	lista.add(new Roupa(4, "meia", 12, 12.15));
//	 	lista.add(new Roupa(5, "cueca", 12, 12.15));
//	 }
}
