let actividadIndex = 0;
let apartadoActual = null;
let correctos = 0;
const LIMITE = 3; // límite global de correctos por apartado
let apartadosCompletados = 0;
const TOTAL_APARTADOS = 6;

/********************
 * Sonidos
 ********************/
const sonidos = {
  correcto: new Audio("Sounds/correcto.mp3"),
  incorrecto: new Audio("Sounds/incorrecto.mp3"),
  fin: new Audio("Sounds/fin.mp3")
};

function reproducirSonido(tipo) {
  const audio = sonidos[tipo];
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(err => console.error("Error sonido:", err));
}

/********************
 * Modo principal
 ********************/
function mostrarModo() {
  document.getElementById("pantalla-inicial").hidden = true;
  document.getElementById("vista-actividad").hidden = false;

  cargarApartados("Discalculia", [
    "Contar objetos",
    "Asociar número–cantidad",
    "Sumas visuales",
    "Comparar cantidades",
    "Series numéricas",
    "Mayor o menor que"
  ]);
}

function cargarApartados(titulo, apartados) {
  const vista = document.getElementById("vista-actividad");
  vista.innerHTML = `
    <h2 id="instruccion">${titulo}</h2>
    <div class="menu-opciones">
      ${apartados
        .map(
          (a, i) => `
        <div class="categoria">
          <h3>${a}</h3>
          <button onclick="iniciarApartado(${i}, '${titulo}')">Iniciar</button>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function iniciarApartado(indice, titulo) {
  actividadIndex = 0;
  correctos = 0;
  apartadoActual = indice;
  cargarActividades(indice, titulo);
}

/********************
 * Actividades
 ********************/
function cargarActividades(indice, titulo) {
  const actividades = [
    // CONTAR OBJETOS
    [
      { tipo: "contar", texto: "Cuenta cuántas manzanas hay 🍎🍎🍎", correcta: 3 },
      { tipo: "contar", texto: "Cuenta los perritos 🐶🐶🐶🐶", correcta: 4 },
      { tipo: "contar", texto: "Cuenta los soles ☀️☀️", correcta: 2 }
    ],
    // ASOCIAR NÚMERO – CANTIDAD
    [
      { tipo: "asociar", texto: "Une el número con las estrellas ⭐⭐⭐ (3)", correcta: 3 },
      { tipo: "asociar", texto: "Elige el número para 🐠🐠🐠🐠", correcta: 4 },
      { tipo: "asociar", texto: "Asocia el 2 con 🍌🍌", correcta: 2 }
    ],
    // SUMAS VISUALES
    [
      { tipo: "suma", texto: "🍎 + 🍎 = ?", correcta: 2 },
      { tipo: "suma", texto: "🐶🐶 + 🐶 = ?", correcta: 3 },
      { tipo: "suma", texto: "🌼🌼🌼 + 🌼 = ?", correcta: 4 }
    ],
    // COMPARAR CANTIDADES
    [
      { tipo: "comparar", texto: "¿Dónde hay más? 🍓🍓🍓 vs 🍌🍌", correcta: "izquierda" },
      { tipo: "comparar", texto: "Elige el grupo con menos 🐱🐱 vs 🐱🐱🐱", correcta: "izquierda" },
      { tipo: "comparar", texto: "¿Qué grupo es mayor? 🌟🌟🌟🌟 vs 🌟", correcta: "izquierda" }
    ],
    // SERIES NUMÉRICAS
    [
      { tipo: "serie", texto: "1, 2, 3, ?", correcta: 4 },
      { tipo: "serie", texto: "2, 4, 6, ?", correcta: 8 },
      { tipo: "serie", texto: "5, 6, 7, ?", correcta: 8 }
    ],
    // MAYOR O MENOR
    [
      { tipo: "mayorMenor", texto: "¿Qué número es mayor? 3 o 5", correcta: 5 },
      { tipo: "mayorMenor", texto: "¿Qué número es menor? 8 o 2", correcta: 2 },
      { tipo: "mayorMenor", texto: "Elige el mayor: 9 o 7", correcta: 9 }
    ]
  ];

  if (correctos >= LIMITE) {
    reproducirSonido("fin");
    mostrarFeedback(`¡Completaste ${LIMITE} actividades! 🎉`, "correcto");
    setTimeout(() => mostrarModo(), 2000);
    return;
  }

  if (actividadIndex >= actividades[indice].length) {
    reproducirSonido("fin");
    mostrarFeedback("¡Has terminado este apartado! 🎉", "correcto");
    setTimeout(() => mostrarModo(), 2000);
    return;
  }

  mostrarActividad(actividades[indice][actividadIndex], indice, titulo);
}

function mostrarActividad(actividad, indice, titulo) {
  const vista = document.getElementById("vista-actividad");
  let opciones = "";

  if (["contar","asociar","suma","serie","mayorMenor"].includes(actividad.tipo)) {
    let posibles = [actividad.correcta - 1, actividad.correcta, actividad.correcta + 1];
    posibles = [...new Set(posibles)].sort((a, b) => a - b);
    opciones = posibles
      .map(
        num =>
          `<button class="tarjeta-bonita" onclick="validarRespuesta(${num}, ${actividad.correcta}, ${indice}, '${titulo}')">${num}</button>`
      )
      .join("");
  }

  if (actividad.tipo === "comparar") {
    opciones = `
      <button class="tarjeta-bonita" onclick="validarRespuesta('izquierda', '${actividad.correcta}', ${indice}, '${titulo}')">Izquierda</button>
      <button class="tarjeta-bonita" onclick="validarRespuesta('derecha', '${actividad.correcta}', ${indice}, '${titulo}')">Derecha</button>
    `;
  }

  vista.innerHTML = `
    <button class="btn-regresar" onclick="mostrarModo()">⬅ Regresar</button>
    <p id="marcador">Correctos: ${correctos}/${LIMITE}</p>

    <div class="tarjeta-instruccion">
      <p>${actividad.texto}</p>
    </div>

    <div class="opciones">
      ${opciones}
    </div>
  `;
}

function validarRespuesta(respuesta, correcta, indice, titulo) {
  if (respuesta == correcta) {
    reproducirSonido("correcto");
    mostrarFeedback("¡Muy bien! 🎉", "correcto");
    correctos++;
    siguienteActividad(indice, titulo);
  } else {
    reproducirSonido("incorrecto");
    mostrarFeedback("Intenta otra vez ❌", "incorrecto");
  }
}

function siguienteActividad(indice, titulo) {
  actividadIndex++;
  setTimeout(() => cargarActividades(indice, titulo), 800);
}

/********************
 * Feedback bonito
 ********************/
function mostrarFeedback(mensaje, tipo) {
  const fb = document.createElement("div");
  fb.className = `feedback ${tipo}`;
  fb.textContent = mensaje;
  fb.setAttribute("aria-live", "assertive");
  document.body.appendChild(fb);
  setTimeout(() => fb.remove(), 1200);
}
