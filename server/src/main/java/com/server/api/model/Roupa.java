package com.server.api.model;


import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name="roupas")
public class Roupa implements Serializable {
    private static final Long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "idSequenceRoupa")
    @SequenceGenerator(name = "idSequenceRoupa", sequenceName = "roupas_id_seq", allocationSize = 1)
    @Column(name="id")
    private long id;
    @Column(name="nome")
    private String nome;
    @Column(name="preco")
    private double preco;
    @Column(name="prazo")
    private int prazo;
    @OneToMany(mappedBy = "roupa")
    private Set<PedidoRoupa> pedidos;

    public Roupa() {
        super();
    }

    public Roupa(long id, String nome, double preco, int prazo, Set<PedidoRoupa> pedidos) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.prazo = prazo;
        this.pedidos = pedidos;
    }

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
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

    public Set<PedidoRoupa> getPedidos() {
        return pedidos;
    }

    public void setPedidos(Set<PedidoRoupa> pedidos) {
        this.pedidos = pedidos;
    }
}
