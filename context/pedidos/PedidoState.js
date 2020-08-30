import React, {useReducer} from 'react';
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";

import {
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTO,
    SELECCIONAR_CLIENTE,
    ACTUALIZAR_TOTAL
} from '../../types';

const PedidoState = ({children}) => {

    // State de Pedidos
    const initState = {
        cliente: {},
        productos: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(PedidoReducer, initState);

    //Modifica el cliente
    const agregarCliente = cliente => {
        // console.log(cliente);
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    // Modifica productos

    const agregarProducto = productosSeleccionados => {

        let nuevoState;
        if(state.productos.length > 0) {
            // Tomar del segundo arreglo una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map(producto => {
                const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id)
                return {...producto, ...nuevoObjeto}
            })
        } else {
            nuevoState = productosSeleccionados;
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    // Modifica las cantidades de los productos
    const cantidadProductos = nuevoProducto => {
        console.log(nuevoProducto);
        dispatch({
            type: CANTIDAD_PRODUCTO,
            payload: nuevoProducto
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }
    return (
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal
            }}>
            {children}

        </PedidoContext.Provider>
    )
}

export default PedidoState