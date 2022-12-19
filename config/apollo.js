import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { NextFetchEvent } from "next/server";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
  NextFetchEvent,
});

const authLink = setContext((_, { headers }) => {
  //Leer el storage almacenado
  const token = localStorage.getItem('token');

  return{
    headers:{
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
