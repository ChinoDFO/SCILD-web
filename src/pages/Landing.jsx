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

  // Progreso de lectura: qué tanto ha bajado la persona en la página,
  // para la barra fina de la barra superior.
  const alturaDesplazable =
    typeof document !== "undefined"
      ? document.documentElement.scrollHeight - window.innerHeight
      : 0;
  const progresoDesplazamiento =
    alturaDesplazable > 0
      ? Math.min(100, (desplazamiento / alturaDesplazable) * 100)
      : 0;

  return (
    <div className="landing">
      <header className={`landing-nav ${desplazamiento > 40 ? "landing-nav-desplazado" : ""}`}>
        <span className="landing-nav-marca">{/* espacio: nombre corto / logo de marca */}SCILD</span>
        <nav className="landing-nav-links">
          <Link to="/cancelar">Cancelar pedido</Link>
          <Link to="/admin/login">Administrador</Link>
        </nav>
        <span
          className="landing-nav-progreso"
          style={{ width: `${progresoDesplazamiento}%` }}
          aria-hidden="true"
        />
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
            {/* SCILD */}
            SCILD
          </h1>
          <p className="landing-hero-eslogan">
            {/* espacio para el eslogan o frase de marca */}
            Cuando más lo necesitas, un solo botón avisa a todos.
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
      <section className="landing-bloque">
        <div className="landing-bloque-texto reveal reveal-derecha">
          <span className="landing-bloque-etiqueta"></span>
          <h2>Los robos no avisan.</h2>
          <p>
            Cada día, negocios como el tuyo enfrentan robos sin tener forma de reaccionar a tiempo.
             Llamar a la policía tarda. Avisar a los vecinos es imposible en el momento.
             Pero solo necesitas presionar un boton, para poder imformar todos.


          </p>
        </div>
        <div className="landing-bloque-media reveal reveal-escala">
          <img src="/img-scild/robo.jpeg" alt="Negocio sufriendo un robo sin forma de pedir ayuda" />
        </div>
      </section>

      <section className="landing-bloque landing-bloque-alterno">
        <div className="landing-bloque-media landing-bloque-media-completa reveal reveal-escala">
          <img src="/img-scild/alarma.jpeg" alt="Botón de pánico activando una alerta que llega a toda la comunidad de negocios" />
        </div>
        <div className="landing-bloque-texto reveal reveal-derecha">
          <span className="landing-bloque-etiqueta"></span>
          <h2>Un dispositivo pequeño con un impacto enorme.</h2>
          <p>
          El botón de pánico comunitario es un dispositivo compacto que se instala en cualquier negocio.
          Para conectar toda la comunidad de negocios en tiempo real.
          </p>
        </div>
      </section>

      <section className="landing-tarjetas">
        <div className="landing-tarjetas-encabezado reveal">
          <span className="landing-bloque-etiqueta"></span>
          <h2>Cómo funciona</h2>
        </div>
        <div className="landing-tarjetas-lista">
          <article className="landing-tarjeta reveal reveal-escala">
            <div className="landing-tarjeta-icono">
              <img src="/img-scild/c1.jpeg" alt="" />
            </div>
            <h3>1. Presionas el botón</h3>
            <p>Un solo golpe al botón de pánico instalado en tu negocio.
              No necesitas sacar el celular ni marcar ningún número.</p>
          </article>
          <article className="landing-tarjeta reveal reveal-escala">
            <div className="landing-tarjeta-icono">
              <img src="/img-scild/c2.jpg" alt="" />
            </div>
            <h3>2. La alerta se manda</h3>
            <p>En un instante, todos los negocios del grupo reciben una notificación
              en su celular con el nombre de tu negocio y tu dirección exacta.</p>
          </article>
          <article className="landing-tarjeta reveal reveal-escala">
            <div className="landing-tarjeta-icono">
              <img src="/img-scild/c3.jpg" alt="" />
            </div>
            <h3>3. La comunidad reacciona</h3>
            <p>Tus vecinos están al tanto. Se cierran puertas, se llama a la policía, se actúa.
              juntos son más fuertes que solos.</p>
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
