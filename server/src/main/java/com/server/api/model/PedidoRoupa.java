package com.server.api.model;


import com.server.api.model.PedidoRoupaId;
import jakarta.persistence.*;

@Entity
@Table(name="pedidos_roupas")
public class PedidoRoupa {
    @EmbeddedId
    private PedidoRoupaId id;
    @ManyToOne
    @MapsId("pedidoId")
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;
    @ManyToOne
    @MapsId("roupaId")
    @JoinColumn(name = "id_roupa")
    private Roupa roupa;
    @Column(name="quantidade")
    private int quantidade;

    public PedidoRoupa() {
        this.id = new PedidoRoupaId();
    }
    public PedidoRoupa(PedidoRoupaId id, Pedido pedido, Roupa roupa, int quantidade) {
        this.id = id;
        this.pedido = pedido;
        this.roupa = roupa;
        this.quantidade = quantidade;
    }
    public PedidoRoupaId getId() {
        return id;
    }

    public void setId(PedidoRoupaId id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
        if (id != null) {
            id.setPedidoId(pedido.getId());
        }
    }

    public Roupa getRoupa() {
        return roupa;
    }

    public void setRoupa(Roupa roupa) {
        this.roupa = roupa;
        if (id != null) {
            id.setRoupaId(roupa.getId());
        }
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
}
