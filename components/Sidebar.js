import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  // routing de next
  const router = useRouter();

  // console.log(router.pathname)

  return (
    <aside className="bg-violet-900 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-6">
      <div>
        <p className="text-stone-900 text-xl font-bold block">CRM Clientes</p>
      </div>

      <nav className="mt-2 list-none">
        <li
          className={
            router.pathname === "/" ? "bg-purple-800/60 rounded-xl p-2" : "p-2"
          }
        >
          <Link href="/">
            <a
              className={
                router.pathname === "/"
                  ? "text-stone-900 font-bold "
                  : "text-purple-300 font-bold block"
              }
            >
              Clientes
            </a>
          </Link>
        </li>
        <li
          className={
            router.pathname === "/pedidos"
              ? "bg-purple-800/60 rounded-xl p-2"
              : "p-2"
          }
        >
          <Link href="/pedidos">
            <a
              className={
                router.pathname === "/pedidos"
                  ? "text-stone-900 font-bold "
                  : "text-purple-300 font-bold block"
              }
            >
              Pedidos
            </a>
          </Link>
        </li>
        <li
          className={
            router.pathname === "/productos"
              ? "bg-purple-800/60 rounded-xl p-2"
              : "p-2"
          }
        >
          <Link href="/productos">
            <a
              className={
                router.pathname === "/productos"
                  ? "text-stone-900 font-bold "
                  : "text-purple-300 font-bold block"
              }
            >
              Productos
            </a>
          </Link>
        </li>
      </nav>

      <div className="sm:mt-10">
        <p className="text-stone-900 text-xl font-bold block">Otras Opciones</p>
      </div>
      <nav className="mt-2 list-none">
        <li
          className={
            router.pathname === "/mejoresvendedores"
              ? "bg-purple-800/60 rounded-xl p-2"
              : "p-2"
          }
        >
          <Link href="/mejoresvendedores">
            <a
              className={
                router.pathname === "/mejoresvendedores"
                  ? "text-stone-900 font-bold "
                  : "text-purple-300 font-bold block"
              }
            >
              Mejores Vendedores
            </a>
          </Link>
        </li>
        <li
          className={
            router.pathname === "/mejoresclientes"
              ? "bg-purple-800/60 rounded-xl p-2"
              : "p-2"
          }
        >
          <Link href="/mejoresclientes">
            <a
              className={
                router.pathname === "/mejoresclientes"
                  ? "text-stone-900 font-bold "
                  : "text-purple-300 font-bold block"
              }
            >
              Mejores Clientes
            </a>
          </Link>
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
