import React, { useState, useEffect, useContext} from 'react';
import Select from "react-select";
import { gql, useQuery} from '@apollo/client/';
import PedidoContext from "../../context/pedidos/PedidoContext";

const OBTENER_CLIENTES_USUARIO = gql`
    query obtenerClientesVendedor {
        obtenerClientesVendedor {
            id
            nombre
            apellido
            empresa
            email
            telefono
            vendedor
        }
    }
`;

const AsignarCliente = () => {

    const [cliente, setCliente] = useState([]);

    // Context Pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarCliente } = pedidoContext;

    // Consultar la base de datos
    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente])

    const seleccionarClientes = clientes => {
        setCliente(clientes);
    }

    //resultados de la cnosulta
    if(loading) return null;
    const { obtenerClientesVendedor } = data;
    return (
        <>
            <p className={'mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-2700 p-2 text-sm font-bold'}>2.- Asigna un cliente a un pedido</p>
            <Select
                className={'mt-3'}
                options={obtenerClientesVendedor}
                onChange={option => seleccionarClientes(option)}
                getOptionValue={ options => options.id}
                getOptionLabel={ options => options.nombre}
                placeholder={'Busque o seleccione el cliente...'}
                noOptionsMessage={() => 'No hay resultados'}
            />
        </>
    )
}

export default AsignarCliente;