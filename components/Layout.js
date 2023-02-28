import React from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  // Hook de routing
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CRM - Administración de Clientes</title>
      </Head>

      {router.pathname === "/login" || router.pathname === "/nuevacuenta" ? (
        <div className="bg-gradient-to-b from-violet-700 to-purple-900 min-h-screen flex flex-col justify-center">
          <div>{children}</div>
        </div>
      ) : (
        <div className="bg-gray-100 min-h-screen">
          <div className="sm:flex min-h-screen">
            <Sidebar />

            <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
              <Header />
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
