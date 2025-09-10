let correctos = 0;
const maxCorrectos = 10;

// 🔊 Sonidos (asegúrate de tenerlos en /sonidos/)
const sonidoCorrecto = new Audio("Sounds/correcto.mp3");
const sonidoIncorrecto = new Audio("Sounds/incorrecto.mp3");
const sonidoFin = new Audio("Sounds/fin.mp3");

// Feedback
function mostrarFeedback(texto, correcto = true) {
  const div = document.createElement("div");
  div.className = `feedback ${correcto ? 'correcto' : 'incorrecto'}`;
  div.textContent = texto;
  document.body.appendChild(div);

  // 🔊 Reproducir sonido según el caso
  if (texto.includes("¡Actividad terminada!")) {
    sonidoFin.play();
  } else {
    correcto ? sonidoCorrecto.play() : sonidoIncorrecto.play();
  }

  setTimeout(() => div.remove(), 1200);
}

function actualizarMarcador() {
  let marcador = document.getElementById("marcador");
  if (!marcador) {
    marcador = document.createElement("div");
    marcador.id = "marcador";
    document.getElementById("vista-actividad").appendChild(marcador);
  }
  marcador.textContent = `Correctos: ${correctos}/${maxCorrectos}`;
}

function finalizarActividad() {
  mostrarFeedback("¡Actividad terminada!", true);
  correctos = 0;
  setTimeout(mostrarMenu, 2000); // 🔹 volver al menú después de 2 seg
}

// TTS
function leerTexto(texto) {
  const msg = new SpeechSynthesisUtterance(texto);
  window.speechSynthesis.speak(msg);
}

// Mostrar menú
function mostrarMenu() {
  document.getElementById("menu-principal").style.display = "block";
  document.getElementById("vista-actividad").hidden = true;
  correctos = 0;
}

/********************
 * Actividad Sílabas
 ********************/
const silabas = [
  { id: 'ma', texto: 'ma' },{ id: 'me', texto: 'me' },{ id: 'mi', texto: 'mi' },
  { id: 'mo', texto: 'mo' },{ id: 'mu', texto: 'mu' },
  { id: 'pa', texto: 'pa' },{ id: 'pe', texto: 'pe' },{ id: 'pi', texto: 'pi' },
  { id: 'po', texto: 'po' },{ id: 'pu', texto: 'pu' }
];

function iniciarSilabas() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  document.getElementById("menu-principal").style.display = "none";
  contenedor.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.className = "btn-regresar";
  btnBack.textContent = "⬅ Regresar";
  btnBack.addEventListener("click", mostrarMenu);
  contenedor.appendChild(btnBack);

  actualizarMarcador();

  function mostrarSiguiente() {
    contenedor.querySelectorAll("#instruccion, .opciones").forEach(el => el.remove());

    const target = silabas[Math.floor(Math.random() * silabas.length)];
    const instruccion = document.createElement("div");
    instruccion.id = "instruccion";
    instruccion.textContent = `Selecciona la sílaba: ${target.texto}`;
    contenedor.appendChild(instruccion);

    const opcionesDiv = document.createElement("div");
    opcionesDiv.className = "opciones";

    silabas.forEach(s => {
      const btn = document.createElement("button");
      btn.className = "tarjeta-bonita";
      btn.textContent = s.texto;
      btn.addEventListener("click", () => {
        if (s.id === target.id) {
          mostrarFeedback("¡Correcto!");
          correctos++;
          actualizarMarcador();
          if (correctos >= maxCorrectos) {
            finalizarActividad(); // 🔹 vuelve al menú al terminar
          } else {
            setTimeout(mostrarSiguiente, 600);
          }
        } else {
          mostrarFeedback("Intenta otra vez", false);
        }
      });
      opcionesDiv.appendChild(btn);
    });

    contenedor.appendChild(opcionesDiv);
  }

  mostrarSiguiente();
}

/********************
 * Palabras con imagen
 ********************/
function iniciarVocabulario() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  document.getElementById("menu-principal").style.display = "none";
  contenedor.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.className = "btn-regresar";
  btnBack.textContent = "⬅ Regresar";
  btnBack.addEventListener("click", mostrarMenu);
  contenedor.appendChild(btnBack);

  const apartados = document.createElement("div");
  apartados.className = "opciones";
  apartados.style.justifyContent = "center";
  apartados.style.marginTop = "20px";

  const categorias = [
    { nombre: "Animales", key: "animales", icono: "🐾" },
    { nombre: "Objetos", key: "objetos", icono: "📦" }
  ];

  categorias.forEach(cat => {
    const item = document.createElement("div");
    item.className = "tarjeta-bonita";
    item.innerHTML = `<div style="font-size:3rem">${cat.icono}</div><p>${cat.nombre}</p>`;
    item.addEventListener("click", () => mostrarCategoriaVocabulario(cat.key, contenedor));
    apartados.appendChild(item);
  });

  contenedor.appendChild(apartados);
}

function mostrarCategoriaVocabulario(categoria, contenedor) {
  contenedor.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.className = "btn-regresar";
  btnBack.textContent = "⬅ Regresar";
  btnBack.addEventListener("click", iniciarVocabulario);
  contenedor.appendChild(btnBack);

  const datos = {
    animales: ["🐶","🐱","🦁","🐘","🐒","🐻","🐰","🐯","🐟","🐴","🐷","🐮","🐔","🦊","🐺"],
    objetos: ["📖","⚽","🏠","📱","🚗","⌚","🪑","🖥️","💻","🖊️","🎒","📷","📺","🎸","🎤"]
  };

  const nombres = {
    animales: ["Perro","Gato","León","Elefante","Mono","Oso","Conejo","Tigre","Pez","Caballo","Cerdo","Vaca","Gallina","Zorro","Lobo"],
    objetos: ["Libro","Pelota","Casa","Teléfono","Coche","Reloj","Mesa","Silla","Computador","Lapicero","Mochila","Cámara","Televisor","Guitarra","Micrófono"]
  };

  const grupoSize = 5;
  for (let i = 0; i < datos[categoria].length; i += grupoSize) {
    const grid = document.createElement("div");
    grid.className = "opciones";
    for (let j = i; j < i + grupoSize && j < datos[categoria].length; j++) {
      const item = document.createElement("div");
      item.className = "tarjeta-bonita";
      item.innerHTML = `
        <div style="font-size:3rem">${datos[categoria][j]}</div>
        <button class="btn-escuchar" style="margin-top:10px">🔊 Escuchar</button>
        <p>${nombres[categoria][j]}</p>
      `;
      item.querySelector(".btn-escuchar").addEventListener("click", () => leerTexto(nombres[categoria][j]));
      grid.appendChild(item);
    }
    contenedor.appendChild(grid);
  }
}

/********************
 * Historias
 ********************/
function iniciarHistorias() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  document.getElementById("menu-principal").style.display = "none";
  contenedor.innerHTML = "";

  let indice = 0;
  const historias = [
    { 
      texto: "El perro ____ la pelota", 
      respuesta: "muerde", 
      opciones: [
        { palabra: "muerde", imagen: "🦴" }, 
        { palabra: "duerme", imagen: "😴" }, 
        { palabra: "salta", imagen: "🤸‍♂️" }
      ] 
    },
    { 
      texto: "La niña ____ agua", 
      respuesta: "bebe", 
      opciones: [
        { palabra: "bebe", imagen: "🥤" }, 
        { palabra: "lee", imagen: "📖" }, 
        { palabra: "corre", imagen: "🏃‍♀️" }
      ] 
    },
    { 
      texto: "El gato ____ en la cama", 
      respuesta: "duerme", 
      opciones: [
        { palabra: "duerme", imagen: "😴" }, 
        { palabra: "salta", imagen: "🤸‍♂️" }, 
        { palabra: "bebe", imagen: "🥛" }
      ] 
    },
    { 
      texto: "El niño ____ un libro", 
      respuesta: "lee", 
      opciones: [
        { palabra: "lee", imagen: "📖" }, 
        { palabra: "come", imagen: "🍎" }, 
        { palabra: "corre", imagen: "🏃‍♂️" }
      ] 
    },
    { 
      texto: "La vaca ____ leche", 
      respuesta: "da", 
      opciones: [
        { palabra: "da", imagen: "🥛" }, 
        { palabra: "salta", imagen: "🤸‍♀️" }, 
        { palabra: "bebe", imagen: "🥤" }
      ] 
    },
    { 
      texto: "El pez ____ en el agua", 
      respuesta: "nada", 
      opciones: [
        { palabra: "nada", imagen: "🐟" }, 
        { palabra: "camina", imagen: "🚶‍♂️" }, 
        { palabra: "corre", imagen: "🏃‍♂️" }
      ] 
    },
    { 
      texto: "El pájaro ____ en el cielo", 
      respuesta: "vuela", 
      opciones: [
        { palabra: "vuela", imagen: "🕊️" }, 
        { palabra: "camina", imagen: "🚶" }, 
        { palabra: "duerme", imagen: "😴" }
      ] 
    },
    { 
      texto: "El niño ____ una pelota", 
      respuesta: "lanza", 
      opciones: [
        { palabra: "lanza", imagen: "⚽" }, 
        { palabra: "come", imagen: "🍎" }, 
        { palabra: "lee", imagen: "📖" }
      ] 
    },
    { 
      texto: "La mamá ____ comida", 
      respuesta: "cocina", 
      opciones: [
        { palabra: "cocina", imagen: "🍲" }, 
        { palabra: "bebe", imagen: "🥤" }, 
        { palabra: "lee", imagen: "📖" }
      ] 
    },
    { 
      texto: "El sol ____ de día", 
      respuesta: "brilla", 
      opciones: [
        { palabra: "brilla", imagen: "☀️" }, 
        { palabra: "duerme", imagen: "😴" }, 
        { palabra: "corre", imagen: "🏃‍♀️" }
      ] 
    }
  ];
  

  function mostrarHistoria() {
    contenedor.innerHTML = "";

    if (indice >= historias.length) {
      finalizarActividad(); // 🔹 vuelve al menú al terminar
      return;
    }

    const h = historias[indice];
    const btnBack = document.createElement("button");
    btnBack.className = "btn-regresar";
    btnBack.textContent = "⬅ Regresar";
    btnBack.addEventListener("click", mostrarMenu);
    contenedor.appendChild(btnBack);

    // 🔹 contador arriba
    actualizarMarcador();

    const texto = document.createElement("p");
    texto.id = "instruccion";
    texto.textContent = h.texto;
    contenedor.appendChild(texto);

    const grid = document.createElement("div");
    grid.className = "opciones";

    h.opciones.forEach(op => {
      const item = document.createElement("div");
      item.className = "tarjeta-bonita";
      item.innerHTML = `<div style="font-size:3rem">${op.imagen}</div><p>${op.palabra}</p>`;
      item.addEventListener("click", () => {
        if (op.palabra === h.respuesta) {
          mostrarFeedback("¡Correcto!");
          correctos++;
          actualizarMarcador();
          setTimeout(() => { indice++; mostrarHistoria(); }, 600);
        } else {
          mostrarFeedback("Intenta otra vez", false);
        }
      });
      grid.appendChild(item);
    });

    contenedor.appendChild(grid);
  }

  mostrarHistoria();
}

// --- Botones menú principal ---
document.querySelectorAll(".menu-actividades button").forEach(btn => {
  btn.addEventListener("click", () => {
    const act = btn.dataset.actividad;
    if (act === "silabas") iniciarSilabas();
    if (act === "palabras") iniciarVocabulario();
    if (act === "historias") iniciarHistorias();
  });
});
