(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const iconos = {
    fundamentos: "🧩",
    python: "🐍",
    "python-ia": "🤖",
    web: "🌐",
    sql: "🗄️",
    csharp: "🖥️",
    ciberseguridad: "🔒",
    office: "📊"
  };

  const formatearWhatsapp = (n) => (n.startsWith("+") ? n : "+" + n);

  const tarjetaCurso = (c) => `
    <article class="curso">
      <div class="icono">${iconos[c.id] || "💻"}</div>
      <div class="chips">
        <span class="chip">${c.nivel}</span>
        <span class="chip">${c.modalidad}</span>
      </div>
      <h3>${c.nombre}</h3>
      <p class="meta">${c.descripcion}</p>
      <p class="meta"><strong>Duración:</strong> ${c.modulos}</p>
      <p class="precio">${c.precio} <small>· certificado incluido</small></p>
      <button class="btn btn-azul" onclick="abrirMatricula('${c.id}')">Matricúlate</button>
    </article>`;

  const tarjetaServicio = (s) => `
    <article class="servicio">
      <div class="icono">🛠️</div>
      <h4>${s.nombre}</h4>
      <p>${s.descripcion}</p>
    </article>`;

  const render = () => {
    $("#cursos-grid").innerHTML = ADV.cursos.map(tarjetaCurso).join("");
    $("#servicios-grid").innerHTML = ADV.servicios.map(tarjetaServicio).join("");
    $("#stat-cursos").textContent = ADV.estadisticas.cursos;
    $("#stat-anos").textContent = ADV.estadisticas.anos;
    $("#stat-estudiantes").textContent = ADV.estadisticas.estudiantes;
    $("#stat-proyectos").textContent = ADV.estadisticas.proyectos;
    $("#texto-whatsapp-pe").textContent = formatearWhatsapp(ADV.whatsapp);
    $("#texto-whatsapp-us").textContent = formatearWhatsapp(ADV.whatsappUS);
    $("#texto-correo").textContent = ADV.correo;
    $("#texto-correo").href = "mailto:" + ADV.correo;
    $("#link-youtube").href = ADV.youtube;
    $("#link-facebook").href = ADV.facebook;
    $(".whatsapp-float").href = "https://wa.me/" + ADV.whatsapp;
    $("#metodos-pago").textContent = ADV.metodosPago.join(" · ");
  };

  const abrirModal = (id) => {
    $("#modal-" + id).classList.add("abierto");
    document.body.style.overflow = "hidden";
  };

  const cerrarModal = (id) => {
    $("#modal-" + id).classList.remove("abierto");
    document.body.style.overflow = "";
  };

  window.abrirMatricula = (id) => {
    const c = ADV.cursos.find((x) => x.id === id);
    $("#modal-matricula .txt-curso").textContent = c.nombre;
    $("#modal-matricula .txt-detalle").textContent = c.nivel + " · " + c.modalidad + " · " + c.precio;
    $("#modal-matricula").dataset.curso = c.nombre;
    $("#modal-matricula").dataset.precio = c.precio;
    $("#modal-matricula").dataset.modalidad = c.modalidad;
    abrirModal("matricula");
  };

  window.abrirCotizacion = () => abrirModal("cotizacion");

  window.enviarMatricula = () => {
    const m = $("#modal-matricula");
    const nombre = $("#modal-matricula .input-nombre").value.trim();
    const correo = $("#modal-matricula .input-correo").value.trim();
    const whatsapp = $("#modal-matricula .input-whatsapp").value.trim();
    const pais = $("#modal-matricula .select-pais").value;
    const curso = m.dataset.curso;
    const precio = m.dataset.precio;
    const modalidad = m.dataset.modalidad;
    if (!nombre || !correo) {
      alert("Completa tu nombre y tu correo.");
      return;
    }
    const msg =
      `Hola ADV & Informática, quiero matricularme en "${curso}" (${precio}, ${modalidad}).` +
      ` Me llamo ${nombre}.` +
      (whatsapp ? ` Mi WhatsApp es ${whatsapp}.` : "") +
      ` País: ${pais}.` +
      ` Métodos de pago: ${ADV.metodosPago.join(", ")}.`;
    window.open("https://wa.me/" + ADV.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  };

  window.enviarCotizacion = () => {
    const nombre = $("#modal-cotizacion .input-nombre").value.trim();
    const correo = $("#modal-cotizacion .input-correo").value.trim();
    const whatsapp = $("#modal-cotizacion .input-whatsapp").value.trim();
    const servicio = $("#modal-cotizacion .select-servicio").value;
    const descripcion = $("#modal-cotizacion .input-descripcion").value.trim();
    const plazo = $("#modal-cotizacion .input-plazo").value.trim();
    if (!nombre || !descripcion) {
      alert("Completa tu nombre y la descripción del proyecto.");
      return;
    }
    const msg =
      `Hola ADV & Informática, solicito una cotización de "${servicio}".` +
      ` Descripción: ${descripcion}.` +
      (plazo ? ` Plazo deseado: ${plazo}.` : "") +
      ` Me llamo ${nombre}.` +
      (correo ? ` Mi correo es ${correo}.` : "") +
      (whatsapp ? ` Mi WhatsApp es ${whatsapp}.` : "");
    window.open("https://wa.me/" + ADV.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  };

  window.enviarContacto = () => {
    const nombre = $("#contacto-nombre").value.trim();
    const correo = $("#contacto-correo").value.trim();
    const mensaje = $("#contacto-mensaje").value.trim();
    if (!nombre || !mensaje) {
      alert("Completa tu nombre y tu mensaje.");
      return;
    }
    const msg = `Hola ADV & Informática, soy ${nombre}` + (correo ? ` (${correo})` : "") + `. ${mensaje}`;
    window.open("https://wa.me/" + ADV.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  };

  const conectar = (inputId, frameId) => {
    const link = $("#" + inputId).value.trim();
    if (link.includes("meet.google.com")) {
      $("#" + frameId).src = link;
    } else {
      alert("Ingresa un link válido de Google Meet (meet.google.com/xxx-xxxx-xxx).");
    }
  };

  window.cambiarSala = (nombre) => {
    $$(".sala-tabs button").forEach((b) => b.classList.remove("activo"));
    $$(".sala-panel").forEach((p) => p.classList.remove("activo"));
    $("#tab-" + nombre).classList.add("activo");
    $("#panel-" + nombre).classList.add("activo");
  };

  window.unirseClase = () => conectar("link-clase", "frame-clase");
  window.unirseReunion = () => conectar("link-reunion", "frame-reunion");

  $$(".cerrar").forEach((btn) =>
    btn.addEventListener("click", () => {
      const mod = btn.closest(".modal");
      mod.classList.remove("abierto");
      document.body.style.overflow = "";
    })
  );

  $$(".modal").forEach((mod) =>
    mod.addEventListener("click", (ev) => {
      if (ev.target === mod) {
        mod.classList.remove("abierto");
        document.body.style.overflow = "";
      }
    })
  );

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      $$(".modal.abierto").forEach((mod) => {
        mod.classList.remove("abierto");
        document.body.style.overflow = "";
      });
    }
  });

  $("#hamburguesa").addEventListener("click", () => {
    $("#nav-principal").classList.toggle("abierto");
  });

  render();
})();
