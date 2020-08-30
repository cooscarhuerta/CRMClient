import React, { useContext, useState } from 'react';
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/asignarCliente";
import AsignarProductos from "../components/pedidos/asignarProductos";
import PedidoContext from '../context/pedidos/PedidoContext';
import ResumenPedido from "../components/pedidos/resumenPedido";
import Total from "../components/pedidos/total";
import { gql, useMutation } from '@apollo/client';
import { useRouter} from "next/router";
import Swal from "sweetalert2";

const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput!){
        nuevoPedido(input: $input){
            id
        }
    }
`;
const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
            pedido {
                id
                nombre
                cantidad
            }
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            total
            estado
        }
    }
`;
const NuevoPedido = () => {
    const router = useRouter();
    const [ mensaje, setMensaje ] = useState(null);

    // Utilizar context extraer sus funcinoes y valores
    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total } = pedidoContext;

    // Mutation para crear nuevo pedido
    const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO, {
        update(cache, { data: { nuevoPedido} } ) {

            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerPedidosVendedor } = cache.readQuery({ query: OBTENER_PEDIDOS});

            // Reescribimos el cache ( el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor : [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
        }
    });

    const validarPedido = () => {
        return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? 'opacity-50 cursor-not-allowed' : ' ';
    }

    const crearNuevoPedido = async () => {
        const { id } = cliente;

        // Remover no desdeado deproductos
        const pedido = productos.map(({existencia, creado, __typename, ...producto}) => producto)
        try {
            const { data } = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total,
                        pedido
                    }
                }
            })
            // Redireccionar
            await router.push('/Pedidos');
            // Mostrar alerta
            await Swal.fire('Correcto',
                'El pedido se registro correctamente',
                'success')
        } catch (e) {
            setMensaje(e.message.replace('GraphQL error: ', ''));
            setTimeout(()=> {
                setMensaje(null)
            }, 3000);
        }
    }

    const mostrarMensaje = () => {
        return (
            <div className={'bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'}>
                <p>{mensaje}</p>
            </div>
        )
    }
    return (
        <div>
            <Layout>
                <h1 className={'text-2xl text-gray-800 front-light'}>Nuevo Pedido</h1>
                {mensaje && mostrarMensaje()}
                <div className={'flex justify-center my-5'}>
                    <div className={'w-full max-w-lg'}>
                        <AsignarCliente/>
                        <AsignarProductos/>
                        <ResumenPedido/>
                        <Total/>

                        <button
                            type={'button'}
                            className={`bg-gray-800 w-full mt-5 p-5 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
                            onClick={() => crearNuevoPedido()}>
                            Registrar Pedido
                        </button>
                    </div>
                </div>
            </Layout>


        </div>
    )
}

export default NuevoPedido;