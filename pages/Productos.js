import React from 'react';
import Swal from 'sweetalert2';
import {gql, useMutation, useQuery} from "@apollo/client";
import Router, {useRouter} from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";
import Producto from "../components/producto";

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


const Productos  = ({producto}) => {
    const router = useRouter();

    // Consulta de apollo
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
    console.log(data);
    if(loading) return 'Cargando...';
    return (
        <div>
            <Layout>
                <h1 className={'text-2xl text-gray-800 front-light'}>Productos</h1>
                <Link href={'/nuevoproducto'}>
                    <a className={'bg-blue-800 py-2 px-5 mt-3 text-white inline-block rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'}
                    >Nuevo Producto</a>
                </Link>
                <table className={'table-auto shadow-md mt-10 w-full w-lg'}>
                    <thead className={'bg-gray-800'}>
                    <tr className={'text-white'}>
                        <th className={'w-1/5 py2'}>Nombre</th>
                        <th className={'w-1/5 py2'}>Existencia</th>
                        <th className={'w-1/5 py2'}>Precio</th>
                        <th className={'w-1/5 py2'}>Eliminar</th>
                        <th className={'w-1/5 py2'}>Editar</th>
                    </tr>
                    </thead>
                    <tbody className={'bg-white'}>
                    {data.obtenerProductos.map( producto => (
                        <Producto
                            key={producto.id}
                            producto={producto}/>
                    ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    )
}

export default Productos