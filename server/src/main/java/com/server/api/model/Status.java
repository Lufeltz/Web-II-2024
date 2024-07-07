package com.server.api.model;


import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "status")
public class Status implements Serializable {
    private static final Long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "idSequenceStatus")
    @SequenceGenerator(name = "idSequenceStatus", sequenceName = "status_id_seq", allocationSize = 1)
    @Column(name="id")
    private Long id;
    @Column(name = "nome")
    private String nome;
    @Column(name = "descricao")
    private String descricao;

    public Status() {
    }

    public Status(Long id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
