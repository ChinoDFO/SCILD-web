// src/components/MenuGestion.jsx
//
// Reemplaza el antiguo enlace suelto "Cancelar pedido" de la barra
// superior. Ahora es un botón "Gestionar pedidos" que despliega un menú
// con las tres acciones que puede necesitar quien visita la web:
// pedir un botón, consultar/gestionar un pedido que ya hizo, o cancelarlo.
//
// Si recibe la prop "onPedir", "Pedir un botón" ejecuta esa función (por
// ejemplo, abrir el panel de pedido sin cambiar de página, como hace
// Landing). Si no la recibe, simplemente lleva a "/".

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MenuGestion.css";

export default function MenuGestion({ onPedir }) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);
  const navegar = useNavigate();

  useEffect(() => {
    if (!abierto) return;

    function alHacerClicFuera(evento) {
      if (!contenedorRef.current?.contains(evento.target)) {
        setAbierto(false);
      }
    }
    function alTecla(evento) {
      if (evento.key === "Escape") setAbierto(false);
    }

    document.addEventListener("mousedown", alHacerClicFuera);
    window.addEventListener("keydown", alTecla);
    return () => {
      document.removeEventListener("mousedown", alHacerClicFuera);
      window.removeEventListener("keydown", alTecla);
    };
  }, [abierto]);

  function manejarPedir() {
    setAbierto(false);
    if (onPedir) {
      onPedir();
    } else {
      navegar("/");
    }
  }

  return (
    <div className="menu-gestion" ref={contenedorRef}>
      <button
        type="button"
        className="menu-gestion-boton"
        aria-haspopup="true"
        aria-expanded={abierto}
        onClick={() => setAbierto((valor) => !valor)}
      >
        Gestionar pedidos
        <svg
          className={`menu-gestion-flecha ${abierto ? "menu-gestion-flecha-abierta" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
        >
          <path d="M1 3 L5 7 L9 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`menu-gestion-lista ${abierto ? "menu-gestion-lista-abierta" : ""}`} role="menu">
        <button type="button" role="menuitem" onClick={manejarPedir}>
          Pedir un botón
        </button>
        <Link role="menuitem" to="/gestionar" onClick={() => setAbierto(false)}>
          Gestionar pedido
        </Link>
        <Link role="menuitem" to="/cancelar" onClick={() => setAbierto(false)}>
          Cancelar pedido
        </Link>
      </div>
    </div>
  );
}
