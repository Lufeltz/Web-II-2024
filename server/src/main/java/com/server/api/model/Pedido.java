package com.server.api.model;


import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name="pedidos")
public class Pedido implements Serializable {
    private static final Long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "idSequencePedido")
    @SequenceGenerator(name = "idSequencePedido", sequenceName = "pedidos_id_seq", allocationSize = 1)
    @Column(name="id")
    private Long id;
    @Column(name="prazo")
    private Date prazo;
    @Column(name="preco_total")
    private double precoTotal;
    @ManyToOne()
    @JoinColumn(name="id_status", nullable=false)
    private Status status;
    @ManyToOne()
    @JoinColumn(name="id_cliente", nullable=false)
    private Cliente cliente;
    @OneToMany(mappedBy = "pedido")
    private Set<PedidoRoupa> roupas;
    @OneToOne(mappedBy = "pedido")
    private Pagamento pagamento;

    public Pedido() {
    }

    public Pedido(Long id, Date prazo, double precoTotal, Status status, Cliente cliente, Set<PedidoRoupa> roupas, Pagamento pagamento) {
        this.id = id;
        this.prazo = prazo;
        this.precoTotal = precoTotal;
        this.status = status;
        this.cliente = cliente;
        this.roupas = roupas;
        this.pagamento = pagamento;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getPrazo() {
        return prazo;
    }

    public void setPrazo(Date prazo) {
        this.prazo = prazo;
    }

    public double getPrecoTotal() {
        return precoTotal;
    }

    public void setPrecoTotal(double precoTotal) {
        this.precoTotal = precoTotal;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Set<PedidoRoupa> getRoupas() {
        return roupas;
    }

    public void setRoupas(Set<PedidoRoupa> roupas) {
        this.roupas = roupas;
    }

    public Pagamento getPagamento() {
        return pagamento;
    }

    public void setPagamento(Pagamento pagamento) {
        this.pagamento = pagamento;
    }
}
