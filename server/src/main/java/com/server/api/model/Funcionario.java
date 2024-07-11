package com.server.api.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("funcionario")
public class Funcionario extends Usuario {
    @Column(name="idFuncionario")
    private int idFuncionario;

    @Column(name="nome")
    private String nome;

    @Column(name="dataNascimento")
    private Date dataNascimento;

    public Funcionario() {
        super();
    }

    public Funcionario(int idFuncionario, String nome, String email, String senha, Date dataNascimento) {
        super(nome, email, senha, "funcionario");
        this.idFuncionario = idFuncionario;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
    }

    public int getIdFuncionario() {
        return this.idFuncionario;
    }

    public void setIdFuncionario(int idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String Nome) {
        this.Nome = Nome;
    }

    public Date getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(Date dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
}
