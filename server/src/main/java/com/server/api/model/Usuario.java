package com.server.api.model;


import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="perfil", discriminatorType=DiscriminatorType.STRING)
@Table(name="usuarios")
public class Usuario implements Serializable {
    private static final Long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "idSequence")
    @SequenceGenerator(name = "idSequence", sequenceName = "usuarios_id_seq", allocationSize = 1)
    @Column(name="id")
    private Long id;
    @Column(name="nome")
    private String nome;
    @Column(name="email")
    private String email;
    @Column(name="senha")
    private String senha;
    @Column(name="perfil", insertable = false, updatable = false)
    private String perfil;

    public Usuario() {
        super();
    }

    public Usuario(String nome, String email, String senha, String perfil) {
        super();
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }


}
