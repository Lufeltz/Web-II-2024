package com.server.api.model;

import jakarta.persistence.Column;

public class Login implements Serializable {
    @Column(name="email")
    private String email;

    @Column(name="senha")
    private String senha;

    public Login() {
        super();
    }

    public Login(String email, String senha) {
        super();
        this.email = email;
        this.senha = senha;
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
}
