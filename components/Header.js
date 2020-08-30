import React from 'react';
import {useQuery, gql} from "@apollo/client";
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }`;

const Header = () => {
    const router = useRouter();
    // query apollo
    const {data, loading, error} = useQuery(OBTENER_USUARIO);
    if(loading) return null;

    // Sino hay informacion
    if(!data) {
        return router.push('/login');
    }
    // Acceder antes de loading
    const { nombre, apellido } = data.obtenerUsuario;
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login')
    }

    return (
        <div className={'sm:flex sm:justify-between mb-6'}>
            <h1 className={'m-2 mb-5 lg:mb-0'}>Hola: {nombre} {apellido}</h1>

            <button
                type={'button'}
                onClick={() => cerrarSesion()}
            className={'bg-blue-800 w-gull sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md hover:bg-gray-800'}>
                Cerrar Sesión
            </button>
        </div>
);
}

export default Header;