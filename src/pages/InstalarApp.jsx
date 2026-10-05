// src/pages/InstalarApp.jsx
//
// Página pública "Instalar la app": tutorial de cómo instalar la PWA del
// sistema de emergencia (scild-emergencia) según el dispositivo. Se abre en
// una pestaña nueva desde el menú "Gestionar pedidos" para no sacar a nadie
// de su pedido en curso.

import { Link } from "react-router-dom";
import MenuGestion from "../components/MenuGestion";
import "./InstalarApp.css";

const URL_APP = "https://scild-emergencia.vercel.app";

export default function InstalarApp() {
  return (
    <div className="pagina-instalar-wrap">
      <header className="barra-superior">
        <Link to="/" className="marca" aria-label="SCILD — inicio">
          <img src="/img-scild/logo-venado-blanco.png" alt="SCILD" className="marca-logo" />
        </Link>
        <MenuGestion />
      </header>

      <main className="pagina-instalar entrada">
        <h1>Instala la app de emergencia</h1>
        <p className="instrucciones">
          Ahí es donde tu negocio o tu casa recibe las alertas del botón.
          No hace falta Play Store ni App Store: se instala directo desde el
          navegador, en un par de pasos según tu dispositivo.
        </p>

        <section className="paso-instalar">
          <h2>En un celular Android</h2>
          <ol>
            <li>Abre el enlace de abajo en Chrome.</li>
            <li>
              Toca los tres puntos (⋮) de arriba a la derecha, o el aviso
              "Instalar aplicación" que puede aparecer solo.
            </li>
            <li>Toca "Instalar" y confirma.</li>
          </ol>
          <p className="nota-paso">
            Queda un ícono en tu pantalla de inicio como cualquier otra app.
          </p>
        </section>

        <section className="paso-instalar">
          <h2>En iPhone o iPad</h2>
          <ol>
            <li>Abre el enlace de abajo, pero en Safari (no funciona desde Chrome).</li>
            <li>Toca el ícono de compartir (el cuadro con la flecha hacia arriba).</li>
            <li>Baja y toca "Agregar a pantalla de inicio".</li>
            <li>Toca "Agregar" arriba a la derecha.</li>
          </ol>
          <p className="nota-paso">
            En iPhone las notificaciones de alerta solo llegan si la app
            quedó instalada así — abrirla siempre desde Safari no es
            suficiente.
          </p>
        </section>

        <section className="paso-instalar">
          <h2>En computadora</h2>
          <ol>
            <li>Abre el enlace de abajo en Chrome o Edge.</li>
            <li>
              Busca el ícono de instalar al final de la barra de
              direcciones (una pantalla con una flecha hacia abajo) y haz
              clic ahí.
            </li>
            <li>Haz clic en "Instalar".</li>
          </ol>
          <p className="nota-paso">
            Si no ves el ícono, abre el menú (⋮) y busca "Instalar SCILD
            Emergencia…".
          </p>
        </section>

        <div className="cta-instalar">
          <p>Con eso ya puedes abrir la app e iniciar sesión (o crear tu cuenta si todavía no tienes una):</p>
          <a href={URL_APP} target="_blank" rel="noopener noreferrer" className="boton-instalar">
            Abrir la app
          </a>
        </div>

        <p className="enlace-volver">
          <Link to="/">Volver al inicio</Link>
        </p>
      </main>
    </div>
  );
}
