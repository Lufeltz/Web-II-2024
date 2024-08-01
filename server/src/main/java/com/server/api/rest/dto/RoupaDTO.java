package com.server.api.rest.dto;

public class RoupaDTO {
    private Long id;
    private String nome;
    private int prazo;
    private double preco;

    public RoupaDTO() {
        super();
    }

    public RoupaDTO(Long id, String nome, int prazo, double preco) {
        super();
        this.id = id;
        this.nome = nome;
        this.prazo = prazo;
        this.preco = preco;
    }

	public Long getId() {
		return this.id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getNome() {
		return this.nome;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public int getPrazo() {
		return this.prazo;
	}
	
	public void setPrazo(int prazo) {
		this.prazo = prazo;
	}
	
	public double getPreco() {
		return this.preco;
	}
	
	public void setPreco(double preco) {
		this.preco = preco;
	}
}
