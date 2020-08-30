import React from 'react';
import { useRouter} from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from '@apollo/client';
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const  OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id:$id){
            nombre
            email
            empresa
            apellido
            telefono
        }
    }
`;
const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input) {
            nombre
            email
            empresa
            telefono
        }
    }
`;

const EditarCliente = () => {

    // Obtener el ID actial
    const router = useRouter();
    const { query: { id } } = router;

    // Consultar para obtener cliente
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    // Actualizar cliente
    const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE);

    // Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
            .required('El nombre del cliente es obligatorio'),
        apellido: Yup.string()
            .required('El apellido del cliente es obligatorio'),
        empresa: Yup.string()
            .required('El campo emrpesa es obligatorio'),
        email: Yup.string()
            .email('Email no válido')
            .required('El email del cliente es obligatorio')

    });

    if(loading) return 'Cargando...';
    if(!data) return 'Accion no permitida';
    const { obtenerCliente } = data;

    // Modifica el cliente en la BD
    const actualizarInfoCliente = async valores => {
        const { nombre, apellido, empresa, email, telefono } = valores;

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        email,
                        telefono,
                        empresa
                    }
                }
            })

            // SweetAlert
            await Swal.fire('Actualizado',
                'El cliente se actualizó correctaente',
                'success')

            // Redireccionar
            await router.push('/');

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Layout>
            <h1 className={'text-2xl text-gray-800 front-light'}>Editar Cliente</h1>


            <div className={'flex justify-center my-5'}>
                <div className={'w-full max-w-lg'}>
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={ obtenerCliente }
                        onSubmit={(valores, functiones) => {
                            actualizarInfoCliente(valores);
                        }}
                    >

                        {props => {

                            return (
                                <form
                                    className={'bg-white shadow-md px-8 pt-6 pb-8 mb-4'}
                                    onSubmit={props.handleSubmit}
                                >

                                    <div className={'mb4'}>
                                        <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'nombre'}>
                                            Nombre
                                        </label>
                                        <input className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                                               id={'nombre'}
                                               type={'text'}
                                               placeholder={'Nombre Cliente'}
                                               onChange={props.handleChange}
                                               onBlur={props.handleBlur}
                                               value={props.values.nombre}
                                        />
                                        {
                                            props.touched.nombre && props.errors.nombre ? (
                                                <div className={'my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'}>
                                                    <p className={'font-bold'}>Error</p>
                                                    <p>{props.errors.nombre}</p>
                                                </div>
                                            ) : null }

                                    </div>
                                    <div className={'mb4'}>
                                        <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'apellido'}>
                                            Apellido
                                        </label>
                                        <input className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                                               id={'apellido'}
                                               type={'text'}
                                               placeholder={'Apellido Cliente'}
                                               onChange={props.handleChange}
                                               onBlur={props.handleBlur}
                                               value={props.values.apellido}
                                        />

                                        {            props.touched.apellido && props.errors.apellido ? (
                                            <div className={'my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'}>
                                                <p className={'font-bold'}>Error</p>
                                                <p>{props.errors.apellido}</p>
                                            </div>
                                        ) : null }

                                    </div>
                                    <div className={'mb4'}>
                                        <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'empresa'}>
                                            Empresa
                                        </label>
                                        <input className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                                               id={'empresa'}
                                               type={'text'}
                                               placeholder={'Empresa Cliente'}
                                               onChange={props.handleChange}
                                               onBlur={props.handleBlur}
                                               value={props.values.empresa}
                                        />

                                        { props.touched.empresa && props.errors.empresa ? (
                                            <div className={'my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'}>
                                                <p className={'font-bold'}>Error</p>
                                                <p>{props.errors.empresa}</p>
                                            </div>
                                        ) : null }

                                    </div>

                                    <div className={'mb4'}>
                                        <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'email'}>
                                            Email
                                        </label>
                                        <input className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                                               id={'email'}
                                               type={'email'}
                                               placeholder={'Email usuario'}
                                               onChange={props.handleChange}
                                               onBlur={props.handleBlur}
                                               value={props.values.email}
                                        />

                                        { props.touched.email && props.errors.email ? (
                                            <div className={'my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'}>
                                                <p className={'font-bold'}>Error</p>
                                                <p>{props.errors.email}</p>
                                            </div>
                                        ) : null }

                                    </div>

                                    <div className={'mb4'}>
                                        <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'telefono'}>
                                            Telefono
                                        </label>
                                        <input className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                                               id={'telefono'}
                                               type={'number'}
                                               placeholder={'Telefono Cliente'}
                                               onChange={props.handleChange}
                                               onBlur={props.handleBlur}
                                               value={props.values.telefono}
                                        />

                                    </div>

                                    <input
                                        type={'submit'}
                                        className={'bg-gray-800 w-full mt-5 p-2 text-white text-center uppercase font-bold hover:bg-gray-900'}
                                        value={'Guardar Cambios'}/>



                                </form>
                            )
                        }}

                    </Formik>
                </div>
            </div>


        </Layout>
    )
}

export default EditarCliente;