import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [mensaje, guardarMensaje] = useState(null);

  //routing
  const router = useRouter();

  //mutation para autenticar usuarios en apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El email no es valido")
        .required("El email no puede ser vacio"),
      password: Yup.string().required("El password es obligatorio"),
    }),
    onSubmit: async (valores) => {
      //console.log(valores);
      const { email, password } = valores;
      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        guardarMensaje("Autenticando....");

        //Almacenar el token en localstorage
        setTimeout(() => {
          const { token } = data.autenticarUsuario;
          localStorage.setItem("token", token);
        }, 1000);

        //Redirigir al ususaro
        setTimeout(() => {
          guardarMensaje(null);
          router.push("/");
        }, 2000);
      } catch (error) {
        //console.log(error);
        guardarMensaje(error.message.replace("GraphQL error: ", ""));

        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full m-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="font-extralight text-4xl text-center text-indigo-200">Bienvenido</h1>
      {mensaje && mostrarMensaje()}
      <div className="mt-5 grid grid-cols-1 grid-rows-2">
        <div className="place-self-center w-full max-w-sm">
          <form
            className="bg-gradient-to-b from-indigo-500 to-purple-600 rounded-lg shadow-xl px-8 pt-6 pb-8 mb-4 h-max"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-900 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:outline-blue-500"
                id="email"
                type="email"
                placeholder="Email Usuario"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>

            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-900 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:outline-blue-500"
                id="password"
                type="password"
                placeholder="Password Usuario"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>

            {formik.touched.password && formik.errors.password ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                <p className="font-bold">Error</p>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}

            <input
              type="submit"
              className="bg-transparent w-full mt-5 p-2 rounded-3xl text-white uppercase hover:bg-purple-700 hover:cursor-pointer"
              value="Iniciar sesion"
            />
          </form>
        </div>
        <div className="row-start-3 align-bottom items-end">
          <Link href="/nuevacuenta">
            <a className="block text-center hover:text-purple-600">Registrarse</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
