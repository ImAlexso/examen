// Importación de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBEPY6XmsbclZcKPmyyRuhaSSXiK6gutew",
  authDomain: "examenlenguaje-8a672.firebaseapp.com",
  projectId: "examenlenguaje-8a672",
  storageBucket: "examenlenguaje-8a672.firebasestorage.app",
  messagingSenderId: "292433981389",
  appId: "1:292433981389:web:647788b5346596feadde84"
};

// Inicialización Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pedidosRef = collection(db, "pedidos");

// Variables DOM
const contenedor = document.getElementById("cocteles-container");
const buscador = document.getElementById("buscador-cocteles");

// Función para renderizar los cócteles
function renderizarCocteles(lista) {
  contenedor.innerHTML = "";
  const limite = lista.slice(0, 20);
  limite.forEach(coctel => {
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100 tarjeta-seleccionable" data-nombre="${coctel.strDrink}">
        <img src="${coctel.strDrinkThumb}" class="card-img-top" alt="${coctel.strDrink}">
        <div class="card-body">
          <h5 class="card-title">${coctel.strDrink}</h5>
          <p class="card-text">Cóctel refrescante y popular.</p>
          <button class="btn btn-success w-100 mt-2 agregar-coctel">Añadir</button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// Carga inicial de 20 cócteles (buscando la letra 'a')
async function cargarIniciales() {
  try {
    const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a");
    const data = await res.json();
    if (data.drinks) {
      renderizarCocteles(data.drinks);
    } else {
      contenedor.innerHTML = "<p class='text-center'>No se encontraron cócteles.</p>";
    }
  } catch (error) {
    console.error("Error al conectar con la API:", error);
    contenedor.innerHTML = "<p class='text-danger text-center'>Error al conectar con la API.</p>";
  }
}

// Buscador de cócteles
buscador.addEventListener("input", async () => {
  const termino = buscador.value.trim();
  if (termino.length < 3) return;

  try {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${termino}`);
    const data = await res.json();
    if (data.drinks) {
      renderizarCocteles(data.drinks);
    } else {
      contenedor.innerHTML = "<p class='text-center'>No se encontraron cócteles con ese nombre.</p>";
    }
  } catch (error) {
    console.error("Error al buscar cócteles:", error);
    contenedor.innerHTML = "<p class='text-danger text-center'>Error al conectar con la API.</p>";
  }
});

// Manejador global para botones "Añadir"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("agregar-coctel")) {
    const tarjeta = e.target.closest(".tarjeta-seleccionable");
    const nombre = tarjeta.dataset.nombre;

    // Guardamos en Firebase
    addDoc(pedidosRef, { name: nombre })
      .then(() => console.log("Guardado en Firebase:", nombre))
      .catch(err => console.error("Error al guardar:", err));

    // Guardamos también en localStorage
    const pedidosLocales = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidosLocales.push(nombre);
    localStorage.setItem("pedidos", JSON.stringify(pedidosLocales));

    console.log("Guardado localmente:", nombre);
  }
});

// Ejecutamos carga inicial
cargarIniciales();