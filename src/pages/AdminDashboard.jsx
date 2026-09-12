// src/pages/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cerrarSesionAdmin } from "../services/auth";
import {
  escucharPedidos,
  confirmarPedido,
  marcarComoEntregado,
  eliminarPedido,
} from "../services/pedidos";
import TarjetaPedido from "../components/TarjetaPedido";
import PanelStock from "../components/PanelStock";
import { RUTA_ADMIN_LOGIN } from "../config/rutas";
import "./AdminDashboard.css";

const FILTROS = [
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "confirmado", etiqueta: "Confirmados" },
  { valor: "entregado", etiqueta: "Entregados" },
  { valor: "cancelado", etiqueta: "Cancelados" },
  { valor: "todos", etiqueta: "Todos" },
];

export default function AdminDashboard() {
  const { usuario } = useAuth();
  const navegar = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("pendiente");

  useEffect(() => {
    const dejarDeEscuchar = escucharPedidos(
      (datos) => {
        setPedidos(datos);
        setCargando(false);
      },
      (err) => {
        setError(
          "No se pudieron cargar los pedidos. Revisa tu conexión o vuelve a iniciar sesión."
        );
        console.error(err);
        setCargando(false);
      }
    );
    return dejarDeEscuchar;
  }, []);

  async function manejarCerrarSesion() {
    await cerrarSesionAdmin();
    navegar(RUTA_ADMIN_LOGIN, { replace: true });
  }

  const pedidosFiltrados =
    filtro === "todos"
      ? pedidos
      : pedidos.filter((pedido) => pedido.estado === filtro);

  const conteosPorEstado = pedidos.reduce((conteos, pedido) => {
    conteos[pedido.estado] = (conteos[pedido.estado] ?? 0) + 1;
    return conteos;
  }, {});

  return (
    <main className="panel-admin entrada">
      <header className="panel-admin-cabecera">
        <div>
          <h1>Panel — SCILD</h1>
          <p className="sesion-actual">Sesión: {usuario?.email}</p>
        </div>
        <button type="button" onClick={manejarCerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <PanelStock />

      <h2 className="titulo-seccion">Pedidos</h2>

      <nav className="filtros-estado">
        {FILTROS.map(({ valor, etiqueta }) => (
          <button
            key={valor}
            type="button"
            className={filtro === valor ? "filtro-activo" : ""}
            onClick={() => setFiltro(valor)}
          >
            {etiqueta}
            {valor !== "todos" && conteosPorEstado[valor]
              ? ` (${conteosPorEstado[valor]})`
              : ""}
          </button>
        ))}
      </nav>

      {cargando && <p>Cargando pedidos...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && pedidosFiltrados.length === 0 && (
        <p>No hay pedidos en este filtro por ahora.</p>
      )}

      <div className="lista-pedidos">
        {pedidosFiltrados.map((pedido) => (
          <TarjetaPedido
            key={pedido.id}
            pedido={pedido}
            alConfirmar={confirmarPedido}
            alMarcarEntregado={marcarComoEntregado}
            alEliminar={eliminarPedido}
          />
        ))}
      </div>
    </main>
  );
}
