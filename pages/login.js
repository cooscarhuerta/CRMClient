import React, { useState } from 'react';
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { gql, useMutation } from "@apollo/client";
import { useRouter} from "next/router";

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput!) {
        autenticarUsuario(input: $input) {
            token
        }
    }
`;
const Login = () => {

    // Routing
    const router = useRouter();

    const [mensaje, guardarMensaje] = useState(null);

    // Mutation para crear nuevos usuarios en apollo
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('el email no es valido')
                .required('El email no puede ir vacio'),
            password: Yup.string()
                .required('La contraseña es obligatoria')
        }),
        onSubmit: async valores => {
            const { email, password } = valores;
            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });

                guardarMensaje(`Iniciando sesion...`)

                // Guardar token enlocal storage
                setTimeout(() => {
                    const { token } = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                }, 1000);

                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/');
                }, 2000);

            } catch (e) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000)
            }
        }
    })

    const mostrarMensaje = () => {
        return(
            <div className={'bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'}>
                <p>{mensaje}</p>
            </div>
        )}


    return (
        <>
            <Layout>
                <h1 className={'text-center text-2xl text-white font-light'}>Login</h1>
                {mensaje && mostrarMensaje()}

                <div className={'flex justify-center mt-5'}>
                    <div className={'w-full max-w-sm'}>
                        <form
                            className={'bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'}
                            onSubmit={formik.handleSubmit}>
                            <div className={'mb4'}>
                                <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'email'}>
                                    Email
                                </label>
                                <input className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                                       id={'email'}
                                       type={'email'}
                                       placeholder={'Email usuario'}
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                       value={formik.values.email}
                                />

                                { formik.touched.email && formik.errors.email ? (
                                    <div className={'my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'}>
                                        <p className={'font-bold'}>Error</p>
                                        <p>{formik.errors.email}</p>
                                    </div>
                                ) : null }

                            </div>

                            <div className={'mb4'}>
                                <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'password'}>
                                    Contraseña
                                </label>
                                <input className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                                       id={'password'}
                                       type={'password'}
                                       placeholder={'Contraseña'}
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                       value={formik.values.password}
                                />

                                { formik.touched.password && formik.errors.password ? (
                                    <div className={'my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'}>
                                        <p className={'font-bold'}>Error</p>
                                        <p>{formik.errors.password}</p>
                                    </div>
                                ) : null }

                                <input
                                    type={'submit'}
                                    className={'bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'}
                                    value={'Iniciar sesión'}
                                />
                            </div>

                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Login;