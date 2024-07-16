package com.server.api.model;


import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "pagamentos")
public class Pagamento implements Serializable {
    private static final Long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "idSequencePagamento")
    @SequenceGenerator(name = "idSequencePagamento", sequenceName = "pagamentos_id_seq", allocationSize = 1)
    @Column(name="id")
    private Long id;
    @Column(name="metodo")
    private String metodo;
    @Column(name="valor")
    private double valor;
    @Column(name="data")
    private Date data;
    @OneToOne()
    @JoinColumn(name = "id_pedido", referencedColumnName = "id")
    private Pedido pedido;

    public Pagamento() {
    }

    public Pagamento(Long id, String metodo, double valor, Date data, Pedido pedido) {
        this.id = id;
        this.metodo = metodo;
        this.valor = valor;
        this.data = data;
        this.pedido = pedido;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMetodo() {
        return metodo;
    }

    public void setMetodo(String metodo) {
        this.metodo = metodo;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }
}
