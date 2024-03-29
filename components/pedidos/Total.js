import React, { useContext } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

const Total = () => {
  // Context de pedidos
  const { total } = useContext(PedidoContext);

  return (
    <div className="flex items-center mt-5 justify-between bg-white p-3 ">
      <h2 className="text-gray-800 text-lg">Total a pagar: </h2>
      <p className="text-gray-800 mt-0 font-bold">$ {total}</p>
    </div>
  );
};

export default Total;
