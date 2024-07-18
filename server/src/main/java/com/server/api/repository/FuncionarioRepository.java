package com.server.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.server.api.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    public Funcionario findByEmail(String email);

    @Query("from Funcionario where email = :email and senha = :senha")
    public Funcionario findByEmailAndSenha(@Param("email") String email, @Param("senha") String senha);
}
