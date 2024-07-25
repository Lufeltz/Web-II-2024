package com.server.api.rest;

import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.util.Calendar;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.server.api.model.PedidoRoupa;
import com.server.api.model.Pedido;
import com.server.api.model.Cliente;

@CrossOrigin
@RestController
public class PedidoREST {

    public static List<Pedido> pedidos = new ArrayList();
    

    @PostMapping("/pedido")
    public ResponseEntity<Pedido> cadastrarPedido(@RequestParam Cliente cliente,
    @RequestParam ArrayList<PedidoRoupa> roupas){
        double valor;
        int i, maxId = 0, prazo = 0;
        Date prazoFinal = new Date();
        for(i=0; i<roupas.size(); i++){
            valor += roupas.get(i).getRoupa().getPreco() * roupas.get(i).getQuantidade();
            if(roupas.get(i).getRoupa().getPrazo() > prazo){
                prazo = roupas.get(i).getRoupa().getPrazo();
            }
        }
        for(i=0; i<pedidos.size(); i++){
            if(pedidos.get(i).getId() > maxId){
                maxId = pedidos.get(i).getId();
            }
        } //implementar a busca pelo id depois pelo banco de dados ou deixá-lo como auto_increment
        
        Calendar dataF = Calendar.getInstance();
        dataF.setTime(prazoFinal);
        dataF.add(Calendar.DAY_OF_MONTH, prazo);
        prazoFinal = dataF.getTime();

        Pedido novoPedido = new Pedido();
        novoPedido.setId(maxId + 1);
        novoPedido.setCliente(cliente);
        novoPedido.setRoupas(roupas);
        novoPedido.setPrazo(prazoFinal);
        novoPedido.setPrecoTotal(valor);

        return ResponseEntity.ok(novoPedido);
        
    }

    @PostMapping("/pedido/{id}")
    public ResponseEntity aprovarPedido(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }

    @PostMapping("/pedido/{id}")
    public ResponseEntity rejeitarPedido(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }
    
}
