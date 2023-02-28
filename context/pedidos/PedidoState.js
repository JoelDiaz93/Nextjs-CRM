import  React, { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';

import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types'

const PedidoState = ({children}) => {

    // State de Pedidos
    //Contiene al cliente, los productos seleccionados y el total a pagar
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }

    //dispatch es una funcion que se conecta con  los types 
    //Se le pasa la informacion que va a modificar
    //Al reducer se le pasa el PedidoReducer y el estado inicial
    const [ state, dispatch ] = useReducer(PedidoReducer, initialState);

    // Modifica el Cliente
    const agregarCliente = cliente => {
        // console.log(cliente);
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    // Modifica los productos
    const agregarProducto = productosSeleccionados => {

        let nuevoState;
        if(state.productos.length > 0 ) {
            // Tomar del segundo arreglo, una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map( producto => {
                const nuevoObjeto = state.productos.find( productoState => productoState.id === producto.id  );
                return {...producto, ...nuevoObjeto }
            } )
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
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }

    //PedidoState va a contener al context
    //Esta dentro de apollo para acceder a sus funciones
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
            }}
        > {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState;