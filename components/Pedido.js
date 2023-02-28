import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ACTUALIZAR_PEDIDO = gql`
  mutation actualizarPedido($id: ID!, $input: PedidoInput) {
    actualizarPedido(id: $id, input: $input) {
      estado
    }
  }
`;
const ELIMINAR_PEDIDO = gql`
  mutation eliminarPedido($id: ID!) {
    eliminarPedido(id: $id)
  }
`;

const OBTENER_PEDIDOS = gql`
  query ObtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
    }
  }
`;

const Pedido = ({ pedido }) => {
  const {
    id,
    total,
    cliente: { nombre, apellido, telefono, email },
    estado,
    cliente,
  } = pedido;

  // Mutation para cambiar el estado de un pedido
  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
    update(cache) {
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });

      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: obtenerPedidosVendedor.filter(
            (pedido) => pedido.id !== id
          ),
        },
      });
    },
  });

  // console.log(pedido)

  const [estadoPedido, setEstadoPedido] = useState(estado);
  const [clase, setClase] = useState("");

  useEffect(() => {
    if (estadoPedido) {
      setEstadoPedido(estadoPedido);
    }
    clasePedido();
  }, [estadoPedido]);

  // Función que modifica el color del pedido de acuerdo a su estado
  const clasePedido = () => {
    if (estadoPedido === "PENDIENTE") {
      setClase("border-yellow-500");
    } else if (estadoPedido === "COMPLETADO") {
      setClase("border-green-500");
    } else {
      setClase("border-red-800");
    }
  };

  const cambiarEstadoPedido = async (nuevoEstado) => {
    try {
      const { data } = await actualizarPedido({
        variables: {
          id,
          input: {
            estado: nuevoEstado,
            cliente: cliente.id,
          },
        },
      });

      setEstadoPedido(data.actualizarPedido.estado);
    } catch (error) {
      console.log(error);
    }
  };

  const descargarPedido = () => {
    const doc = new jsPDF();
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("CRM PEDIDOS", 20, 30);
    doc.setFontSize(25);
    doc.setFont("helvetica", "normal");
    doc.text("Pedido: " + id, 20, 42);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Estado: " + estado, 20, 50);
    const docWidth = doc.internal.pageSize.getWidth();
    const docHeight = doc.internal.pageSize.getHeight();
    doc.line(0, 56, docWidth, 56);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Cliente: ", 20, 70);
    doc.text(nombre + " " + apellido, 50, 70);
    doc.text("Email: ", 20, 80);
    doc.text(email, 50, 80);
    doc.text("Telefono: ", 20, 90);
    doc.text(telefono, 50, 90);
    const columns = [
      { title: "Cantidad", dataKey: "Cantidad" },
      { title: "Producto", dataKey: "Producto" },
      { title: "Precio", dataKey: "Precio" },
    ];
    const rows = [];
    pedido.pedido.forEach((articulo) => {
      const articuloData = [
        articulo.cantidad,
        articulo.nombre,
        articulo.precio,
      ];
      rows.push(articuloData);
    });
    autoTable(
      doc,{
        head: [columns],
        body: rows,
        startY: 100
      }
    );
    doc.text("Total: " + total.toFixed(2), 147, (doc).lastAutoTable.finalY + 10);
    doc.save(`${nombre}-${apellido}`);
  };

  const confirmarEliminarPedido = () => {
    Swal.fire({
      title: "¿Deseas eliminar a este pedido?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "No, Cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          const data = await eliminarPedido({
            variables: {
              id,
            },
          });

          Swal.fire("Eliminado", data.eliminarPedido, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div
      className={` ${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}
    >
      <div className="col-span-1 flex flex-col justify-center items-center">
        {estadoPedido === "COMPLETADO" ? (
          <svg
            className="w-20 h-20 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : estadoPedido === "PENDIENTE" ? (
          <svg
            className="w-20 h-20 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        ) : (
          <svg
            className="w-20 h-20 text-red-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}

        <h2 className="text-gray-800 text-center font-bold text-xl mt-10">
          Estado Pedido:
        </h2>
        <select
          className="mt-4 border-2 appearance-none bg-white border-blue-600 text-black p-2 text-center rounded leading-tight focus:outline-none focus:bg-white uppercase text-xs font-bold mb-2
          "
          value={estadoPedido}
          onChange={(e) => cambiarEstadoPedido(e.target.value)}
        >
          <option value="COMPLETADO">COMPLETADO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
      </div>

      <div className="col-span-1 mt-8 md:mt-4">
        <p className="font-bold text-xl text-gray-800 mb-6">
          Cliente: {nombre} {apellido}{" "}
        </p>

        {email && (
          <p className="flex items-center my-2">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-2"
            >
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            {email}
          </p>
        )}

        {telefono && (
          <p className="flex items-center my-2">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-2"
            >
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            {telefono}
          </p>
        )}

        <div className="flex mt-4 gap-2 justify-between">
          <button
            className="w-full border-2 uppercase text-xs font-bold text-center border-lime-500 px-5 py-2 text-black rounded leading-tight appearance-none"
            onClick={() => descargarPedido()}
          >
            Descargar Pedido
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-4 h-4 ml-2 inline-block"
            >
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
          <button
            className="w-full border-2 uppercase text-xs font-bold text-center border-red-800 px-5 py-2 text-black rounded leading-tight appearance-none"
            onClick={() => confirmarEliminarPedido()}
          >
            Eliminar Pedido
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-4 h-4 ml-2 inline-block"
            >
              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="col-span-2">
        <h2 className="text-gray-800 font-bold mt-2">Resumen del Pedido</h2>
        {pedido.pedido.map((articulo) => (
          <div key={articulo.id} className="mt-4">
            <p className="text-sm text-gray-600">
              Producto: {articulo.nombre}{" "}
            </p>
            <p className="text-sm text-gray-600">
              Cantidad: {articulo.cantidad}{" "}
            </p>
          </div>
        ))}

        <p className="text-gray-800 mt-3 font-bold ">
          Total a pagar:
          <span className="font-light"> $ {total}</span>
        </p>
      </div>
    </div>
  );
};

export default Pedido;
