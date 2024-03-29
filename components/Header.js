import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
    }
  }
`;

const Header = () => {
  const router = useRouter();

  //query de apollo
  const { data, loading, error } = useQuery(OBTENER_USUARIO);

  // console.log(data);
  // console.log(loading);
  // console.log(error);

  //Acceder a la data despues de obtener datos
  if (loading) return null;

  //Si no esta logeado
  if (!data) {
    return router.push("/login");
  }

  const { nombre, apellido } = data.obtenerUsuario;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="sm:flex sm:justify-between mb-6">
      <p className="mr-2 mb-5 text-center font-semibold text-xl lg:mb-0">
        Hola {nombre} {apellido}
      </p>
      <button
        onClick={() => cerrarSesion()}
        type="button"
        className="bg-purple-800 w-full sm:w-auto font-bold uppercase text-sm rounded py-2 px-5 text-white"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
