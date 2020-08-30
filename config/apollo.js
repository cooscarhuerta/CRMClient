import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from 'node-fetch';
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
    uri: 'https://pacific-plains-61189.herokuapp.com/',
    fetch
});

const authLink = setContext((_, { headers }) => {

    // Leer storage almacenado

    const token = localStorage.getItem('token');

    return {
       headers: {
           ...headers,
           authorization: token ? `Bearer ${token}` : ''
       }
   }
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;