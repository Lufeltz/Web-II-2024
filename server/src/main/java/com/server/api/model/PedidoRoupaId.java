package com.server.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PedidoRoupaId implements Serializable {
    @Column(name = "id_pedido")
    private Long pedidoId;

    @Column(name = "id_roupa")
    private Long roupaId;

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }

    public Long getRoupaId() {
        return roupaId;
    }

    public void setRoupaId(Long roupaId) {
        this.roupaId = roupaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PedidoRoupaId pedidoRoupaId1 = (PedidoRoupaId) o;
        return Objects.equals(pedidoId, pedidoRoupaId1.pedidoId) && Objects.equals(roupaId, pedidoRoupaId1.roupaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pedidoId, roupaId);
    }
}
