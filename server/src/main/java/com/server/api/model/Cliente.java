package com.server.api.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("cliente")
public class Cliente extends Usuario {
    @Column(name="cpf")
    private String cpf;
    @Column(name="telefone")
    private String telefone;
    @Column(name="endereco")
    private String endereco;

    public Cliente() {
        super();
    }

    public Cliente(String nome, String email, String senha, String cpf, String telefone, String endereco) {
        super(nome, email, senha, "cliente");
        this.cpf = cpf;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    @Override
    public void setPerfil(String perfil) {
        super.setPerfil("cliente");
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
}

