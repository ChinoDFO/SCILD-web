// src/pages/Landing.jsx

import { useEffect, useRef, useState } from "react";
import HacerPedido from "./HacerPedido";
import MenuGestion from "../components/MenuGestion";
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
          <MenuGestion onPedir={abrirPedido} />
        </nav>
        <span
          className="landing-nav-progreso"
          style={{ width: `${progresoDesplazamiento}%` }}
          aria-hidden="true"
        />
      </header>

      {/* ---------- HERO CON PARALLAX ---------- */}
      {/* El logo, "SCILD", la frase y el botón salen centrados. Para
          moverlos a la izquierda o a la derecha, eso se ajusta en
          Landing.css: ".landing-hero" y ".landing-hero-contenido"
          (align-items + text-align). */}
      <section className="landing-hero">
        <div
          className="landing-hero-capa landing-hero-capa-fondo"
          style={{ transform: `translate3d(0, ${desplazamiento * 0.35}px, 0)` }}
        />
        <div
          className="landing-hero-capa landing-hero-capa-brillo"
          style={{ transform: `translate3d(0, ${desplazamiento * 0.18}px, 0)` }}
        />
        <div className="landing-hero-destellos" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, indice) => {
            // Posiciones y tiempos "al azar" pero fijos (no cambian en cada
            // render): cada destello usa el índice para variar su lugar,
            // tamaño y ritmo de parpadeo.
            const izquierda = (indice * 53) % 100;
            const arriba = (indice * 31) % 100;
            const retraso = (indice % 6) * 0.6;
            const duracion = 3 + (indice % 4);
            const tamano = 2 + (indice % 3);
            return (
              <span
                key={indice}
                className="destello"
                style={{
                  left: `${izquierda}%`,
                  top: `${arriba}%`,
                  width: `${tamano}px`,
                  height: `${tamano}px`,
                  animationDelay: `${retraso}s`,
                  animationDuration: `${duracion}s`,
                }}
              />
            );
          })}
        </div>

        <div
          className="landing-hero-contenido"
          style={{
            transform: `translate3d(0, ${desplazamiento * 0.12}px, 0)`,
            opacity: Math.max(1 - desplazamiento / 420, 0),
          }}
        >
          <div className="landing-hero-logo" aria-hidden="true">
            <img src="/img-scild/logo_nf.png" alt="" className="landing-hero-logo" />
            {/* espacio para el logo de la empresa */}
          </div>
          <p className="landing-hero-eslogan">
            {/* espacio para el eslogan o frase de marca */}
            Imaginamos el riesgo. Diseñamos la respuesta.
          </p>

          <button type="button" className="landing-hero-cta" onClick={abrirPedido}>
            Pedir tu botón
          </button>
        </div>

        <div className="landing-hero-scroll" aria-hidden="true">
          Desliza para conocer más
          <svg
            className="landing-hero-scroll-flecha"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              d="M3 6 L9 12 L15 6"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* ---------- SECCIONES DE CONTENIDO (deslizantes al aparecer) ---------- */}
      {/* "El problema": toda la sección entra deslizándose de izquierda a
          derecha, como una ventana que se abre desde el borde izquierdo.

          El div que va PRIMERO aquí abajo (el texto) es el que queda del
          lado IZQUIERDO de la pantalla, y el segundo (la imagen) del lado
          DERECHO. Si los cambias de orden, cambian de lado.
          Para mover el texto/título DENTRO de su lado (centrado, pegado a
          la izq. o a la der.), eso se ajusta en Landing.css, en
          ".landing-bloque-texto" (align-items + text-align). */}
      <section className="landing-bloque">
        <div className="landing-bloque-texto reveal ">
          <span className="landing-bloque-etiqueta"></span>
          <h2>Los robos no avisan.</h2>
          <p>
            Cada día, negocios como el tuyo enfrentan robos sin tener forma de reaccionar a tiempo.
             Llamar a la policía tarda. Avisar a los vecinos es imposible en el momento.
             Pero solo necesitas presionar un boton, para poder imformar todos.
          </p>
        </div>
        <div className="landing-bloque-media reveal">
          <img src="/img-scild/robo.jpeg" alt="Negocio sufriendo un robo sin forma de pedir ayuda" />
        </div>
      </section>

      {/* "La explicación": entra de derecha a izquierda, en sentido
          contrario a la sección anterior, para que la página se sienta
          más dinámica al bajar.

          Aquí la imagen va PRIMERO (queda a la izquierda) y el texto
          SEGUNDO (queda a la derecha) — al revés que en la sección de
          arriba. Si quieres que también el texto quede a la izquierda
          en esta sección, solo cambia el orden de los dos <div> de aquí
          abajo (pon primero el que dice "landing-bloque-texto"). */}
      <section className="landing-bloque landing-bloque-alterno">
        <div className="landing-bloque-media landing-bloque-media-completa reveal ">
          <img src="/img-scild/alarma.jpeg" alt="Botón de pánico activando una alerta que llega a toda la comunidad de negocios" />
        </div>
        <div className="landing-bloque-texto reveal reveal">
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
      {/* Para mover este bloque a la izquierda/derecha: Landing.css,
          ".landing-cta-final" (text-align). */}
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
