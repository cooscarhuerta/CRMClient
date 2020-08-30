import React, { useState, useEffect, useContext} from 'react';
import Select from "react-select";
import { gql, useQuery} from '@apollo/client';
import PedidoContext from "../../context/pedidos/PedidoContext";

const OBTENER_PRODUCTOS = gql`
    query buscarProductos {
        obtenerProductos{
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

const AsignarProductos = () => {

    const [productos, setProductos] = useState([]);

    // Context Productos
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;

    // Consultar la base de datos
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        agregarProducto(productos);
    }, [productos])

    const seleccionarProducto = producto => {
        setProductos(producto);
    }

    //resultados de la cnosulta
    if(loading) return null;
    const { obtenerProductos } = data;
    return (
        <>
            <p className={'mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-2700 p-2 text-sm font-bold'}>2.- Selecciona o busca los productos</p>
            <Select
                className={'mt-3'}
                options={obtenerProductos}
                onChange={option => seleccionarProducto(option)}
                getOptionValue={ options => options.id}
                isMulti={true}
                getOptionLabel={ options => `${options.nombre} - ${options.existencia} Disponibles`}
                placeholder={'Busque o seleccione los Productos...'}
                noOptionsMessage={() => 'No hay resultados'}
            />
        </>
    )
}

export default AsignarProductos;