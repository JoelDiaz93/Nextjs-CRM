import React, { useContext, useState, useEffect } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

const ProductoResumen = ({ producto }) => {
  // Context de pedidos
  const { cantidadProductos, actualizarTotal }  = useContext(PedidoContext);

  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    actualizarCantidad();
    actualizarTotal();
  }, [cantidad]);

  const actualizarCantidad = () => {
    const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
    cantidadProductos(nuevoProducto);
  };

  const { nombre, precio } = producto;

  const handleChange = (e) => {
    if (e.target.value > 1) {
      if (e.target.value < producto.existencia) {
        setCantidad(e.target.value);
      } else {
        setCantidad(producto.existencia);
      }
    } else {
      setCantidad(1);
    }
  };

  return (
    <div className="md:flex md:justify-between md:items-center mt-5">
      <div className="md:w-2/4 mb-2 md:mb-0">
        <p className="text-sm">{nombre}</p>
        <p>$ {precio}</p>
      </div>

      <input
        type="number"
        placeholder="Cantidad"
        className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
        onChange={(e) => handleChange(e)}
        value={cantidad}
      />
    </div>
  );
};

export default ProductoResumen;
