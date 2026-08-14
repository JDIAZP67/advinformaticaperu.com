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
      <p class="precio">${c.precio} ${c.precioUS ? `<small>· ${c.precioUS}</small>` : ""} <small>· certificado incluido</small></p>
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
    const mod = $("#modal-" + id);
    mod.classList.add("abierto");
    document.body.style.overflow = "hidden";
    const primero = mod.querySelector("input, select, textarea, button");
    if (primero) primero.focus();
  };

  const cerrarModal = (id) => {
    $("#modal-" + id).classList.remove("abierto");
    document.body.style.overflow = "";
  };

  window.abrirMatricula = (id) => {
    const c = ADV.cursos.find((x) => x.id === id);
    const detalle = [c.nivel, c.modalidad, c.precio, c.precioUS].filter(Boolean).join(" · ");
    $("#modal-matricula .txt-curso").textContent = c.nombre;
    $("#modal-matricula .txt-detalle").textContent = detalle;
    $("#modal-matricula").dataset.cursoId = c.id;
    $("#modal-matricula").dataset.curso = c.nombre;
    $("#modal-matricula").dataset.precio = c.precio;
    $("#modal-matricula").dataset.precioUS = c.precioUS || "";
    $("#modal-matricula").dataset.modalidad = c.modalidad;
    mostrarPagoPais();
    abrirModal("matricula");
  };

  const pagosConfigurados = () => ({
    culqi: !!ADV.pagos.culqi.cursos[$("#modal-matricula").dataset.cursoId],
    paypal: !!ADV.pagos.paypal.handle
  });

  window.mostrarPagoPais = () => {
    const pais = $("#modal-matricula .select-pais").value;
    const cfg = pagosConfigurados();
    const culqi = pais === "Perú" || pais === "Otro";
    const paypal = pais === "Estados Unidos" || pais === "Otro";
    $("#btn-pago-culqi").style.display = cfg.culqi && culqi ? "" : "none";
    $("#btn-pago-paypal").style.display = cfg.paypal && paypal ? "" : "none";
    $("#pago-nota-culqi").style.display = cfg.culqi && culqi ? "" : "none";
    $("#pago-nota-paypal").style.display = cfg.paypal && paypal ? "" : "none";
    const hayPago = (cfg.culqi && culqi) || (cfg.paypal && paypal);
    $("#pago-opciones").style.display = hayPago ? "" : "none";
  };

  window.pagarMatricula = (metodo) => {
    const id = $("#modal-matricula").dataset.cursoId;
    if (metodo === "culqi") {
      const url = ADV.pagos.culqi.cursos[id];
      if (url) window.open(url, "_blank", "noopener");
      return;
    }
    if (metodo === "paypal") {
      const handle = ADV.pagos.paypal.handle;
      if (!handle) return;
      const monto = (($("#modal-matricula").dataset.precioUS || "").match(/\d+(\.\d+)?/) || [""])[0];
      const url = `https://paypal.me/${handle}/${monto}`.replace(/\/$/, "");
      window.open(url, "_blank", "noopener");
    }
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
    const precioUS = m.dataset.precioUS;
    const modalidad = m.dataset.modalidad;
    if (!nombre || !correo) {
      alert("Completa tu nombre y tu correo.");
      return;
    }
    const msg =
      `Hola ADV & Informática, quiero matricularme en "${curso}" (${precio}${precioUS ? " · " + precioUS : ""}, ${modalidad}).` +
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

  const conectar = (inputId) => {
    const link = $("#" + inputId).value.trim();
    if (!/^https:\/\/meet\.google\.com\/.+/.test(link)) {
      alert("Ingresa un link válido de Google Meet (https://meet.google.com/xxx-xxxx-xxx).");
      return;
    }
    const url = new URL(link);
    url.searchParams.set("authuser", "0");
    window.open(url.toString(), "_blank", "noopener");
  };

  window.cambiarSala = (nombre) => {
    $$(".sala-tabs button").forEach((b) => {
      b.classList.remove("activo");
      b.setAttribute("aria-selected", "false");
      b.tabIndex = -1;
    });
    $$(".sala-panel").forEach((p) => p.classList.remove("activo"));
    const tab = $("#tab-" + nombre);
    tab.classList.add("activo");
    tab.setAttribute("aria-selected", "true");
    tab.tabIndex = 0;
    $("#panel-" + nombre).classList.add("activo");
  };

  window.unirseClase = () => conectar("link-clase");
  window.unirseReunion = () => conectar("link-reunion");

  const tabKeys = (ev) => {
    if (!ev.target.closest(".sala-tabs")) return;
    const tabs = $$(".sala-tabs button");
    const idx = tabs.indexOf(ev.target);
    if (idx === -1) return;
    if (ev.key === "ArrowRight") cambiarSala(tabs[(idx + 1) % tabs.length].id.replace("tab-", ""));
    if (ev.key === "ArrowLeft") cambiarSala(tabs[(idx - 1 + tabs.length) % tabs.length].id.replace("tab-", ""));
  };
  document.addEventListener("keydown", tabKeys);

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

  $$("#nav-principal a").forEach((enlace) =>
    enlace.addEventListener("click", () => {
      $("#nav-principal").classList.remove("abierto");
    })
  );

  $("#modal-matricula .select-pais").addEventListener("change", mostrarPagoPais);

  render();
})();
