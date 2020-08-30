import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { gql, useQuery } from '@apollo/client';
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";

const MEJORES_VENDEDORES = gql`
    query mejoresVendedores {
        mejoresVendedores {
            vendedor {
                nombre
                email
            }
            total
        }
    }`;

const MejoresVendedores = () => {

    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_VENDEDORES);

    // tiempo real esto dice si hay cambios los ejecuta el statPolling despues de un segnudo
    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling,stopPolling])

    if (loading) return 'Cargando...';


    const { mejoresVendedores } = data;

    const vendedorGrafica = [];
    mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        };
    });

    return (<Layout>
            <h1 className={'text-2xl text-gray-800 front-light'}>Mejores Vendedores</h1>
            <ResponsiveContainer width={'99%'} height={550}>
                <BarChart
                    className={'mt-10'}
                    width={600}
                    height={500}
                    data={vendedorGrafica}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182ce" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    );
}

export default MejoresVendedores;