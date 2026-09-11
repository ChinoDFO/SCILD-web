// src/pages/Landing.jsx

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HacerPedido from "./HacerPedido";
import "./Landing.css";

function useRevelarAlDesplazar() {
  useEffect(() => {
    const elementos = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("reveal-visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );

    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);
}

export default function Landing() {
  const [pedidoAbierto, setPedidoAbierto] = useState(false);
  const [desplazamiento, setDesplazamiento] = useState(0);
  const panelRef = useRef(null);

  useRevelarAlDesplazar();

  useEffect(() => {
    function alDesplazar() {
      setDesplazamiento(window.scrollY);
    }
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  useEffect(() => {
    document.body.style.overflow = pedidoAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [pedidoAbierto]);

  useEffect(() => {
    if (!pedidoAbierto) return;
    function alTecla(evento) {
      if (evento.key === "Escape") setPedidoAbierto(false);
    }
    window.addEventListener("keydown", alTecla);
    return () => window.removeEventListener("keydown", alTecla);
  }, [pedidoAbierto]);

  function abrirPedido() {
    setPedidoAbierto(true);
    requestAnimationFrame(() => {
      panelRef.current?.scrollTo({ top: 0 });
    });
  }

  return (
    <div className="landing">
      <header className="landing-nav">
        <span className="landing-nav-marca">{/* espacio: nombre corto / logo de marca */}SCILD</span>
        <nav className="landing-nav-links">
          <Link to="/cancelar">Cancelar pedido</Link>
          <Link to="/admin/login">Administrador</Link>
        </nav>
      </header>

      {/* ---------- HERO CON PARALLAX ---------- */}
      <section className="landing-hero">
        <div
          className="landing-hero-capa landing-hero-capa-fondo"
          style={{ transform: `translate3d(0, ${desplazamiento * 0.35}px, 0)` }}
        />
        <div
          className="landing-hero-capa landing-hero-capa-brillo"
          style={{ transform: `translate3d(0, ${desplazamiento * 0.18}px, 0)` }}
        />

        <div
          className="landing-hero-contenido"
          style={{
            transform: `translate3d(0, ${desplazamiento * 0.12}px, 0)`,
            opacity: Math.max(1 - desplazamiento / 420, 0),
          }}
        >
          <div className="landing-hero-logo" aria-hidden="true">
            {/* espacio para el logo de la empresa */}
          </div>
          <h1 className="landing-hero-nombre">
            {/* espacio para el nombre de la empresa */}
            Nombre de tu empresa
          </h1>
          <p className="landing-hero-eslogan">
            {/* espacio para el eslogan o frase de marca */}
            Espacio para tu eslogan o frase de presentación
          </p>

          <button type="button" className="landing-hero-cta" onClick={abrirPedido}>
            Pedir tu botón
          </button>
        </div>

        <div className="landing-hero-scroll" aria-hidden="true">
          <span className="landing-hero-scroll-linea" />
          Desliza para conocer más
        </div>
      </section>

      {/* ---------- SECCIONES DE CONTENIDO (deslizantes al aparecer) ---------- */}
      <section className="landing-bloque reveal">
        <div className="landing-bloque-texto">
          <span className="landing-bloque-etiqueta">Espacio 01</span>
          <h2>Título de la sección</h2>
          <p>
            Aquí va la descripción de esta sección. Reemplaza este texto con
            el contenido real: qué es el producto, para quién es o cómo
            funciona.
          </p>
        </div>
        <div className="landing-bloque-media" aria-hidden="true">
          <span>Espacio para imagen o video</span>
        </div>
      </section>

      <section className="landing-bloque landing-bloque-alterno reveal">
        <div className="landing-bloque-media" aria-hidden="true">
          <span>Espacio para imagen o video</span>
        </div>
        <div className="landing-bloque-texto">
          <span className="landing-bloque-etiqueta">Espacio 02</span>
          <h2>Otro punto clave</h2>
          <p>
            Usa esta sección para un beneficio, un testimonio o un dato que
            refuerce la confianza en el producto.
          </p>
        </div>
      </section>

      <section className="landing-tarjetas reveal">
        <div className="landing-tarjetas-encabezado">
          <span className="landing-bloque-etiqueta">Espacio 03</span>
          <h2>Características</h2>
        </div>
        <div className="landing-tarjetas-lista">
          <article className="landing-tarjeta">
            <div className="landing-tarjeta-icono" aria-hidden="true" />
            <h3>Característica uno</h3>
            <p>Descripción breve de esta característica.</p>
          </article>
          <article className="landing-tarjeta">
            <div className="landing-tarjeta-icono" aria-hidden="true" />
            <h3>Característica dos</h3>
            <p>Descripción breve de esta característica.</p>
          </article>
          <article className="landing-tarjeta">
            <div className="landing-tarjeta-icono" aria-hidden="true" />
            <h3>Característica tres</h3>
            <p>Descripción breve de esta característica.</p>
          </article>
        </div>
      </section>

      {/* ---------- LLAMADO A LA ACCIÓN FINAL ---------- */}
      <section className="landing-cta-final reveal">
        <h2>¿Listo para tu botón SCILD?</h2>
        <p>Una alerta a todo tu equipo, al instante.</p>
        <button type="button" onClick={abrirPedido}>
          Pedir tu botón ahora
        </button>
      </section>

      <footer className="landing-footer">
        <span>{/* espacio para nota legal / redes */}© {new Date().getFullYear()} SCILD</span>
      </footer>

      {/* ---------- PANEL DE PEDIDO (aparece sin cambiar de página) ---------- */}
      <div
        className={`landing-overlay ${pedidoAbierto ? "landing-overlay-abierto" : ""}`}
        aria-hidden={!pedidoAbierto}
      >
        <div className="landing-overlay-fondo" onClick={() => setPedidoAbierto(false)} />
        <div className="landing-overlay-panel" ref={panelRef} role="dialog" aria-modal="true">
          <button
            type="button"
            className="landing-overlay-cerrar"
            onClick={() => setPedidoAbierto(false)}
            aria-label="Cerrar"
          >
            ×
          </button>
          {pedidoAbierto && <HacerPedido mostrarBarra={false} />}
        </div>
      </div>
    </div>
  );
}
