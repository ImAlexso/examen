import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBEPY6XmsbclZcKPmyyRuhaSSXiK6gutew",
  authDomain: "examenlenguaje-8a672.firebaseapp.com",
  projectId: "examenlenguaje-8a672",
  storageBucket: "examenlenguaje-8a672.firebasestorage.app",
  messagingSenderId: "292433981389",
  appId: "1:292433981389:web:647788b5346596feadde84"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pedidosRef = collection(db, "pedidos");

function renderizarPlatos(platos, idContenedor){
    const contenedor = document.getElementById(idContenedor);

    platos.forEach(plato =>{
        const tarjeta = document.createElement("div");
        tarjeta.className= "col-12 col-sm-6 col-md-4 mb-4";

        tarjeta.innerHTML = `<div class="card h-100 tarjeta-seleccionable" data-nombre="${plato.name}">
        <img src="${plato.image}" class="card-img-top" alt="${plato.name}">
        <div class="card-body">
          <h5 class="card-title">${plato.name}</h5>
          <p class="card-text">${plato.description}</p>
          <button class="btn btn-primary w-100 agregar-al-pedido">Añadir</button>
        </div>
      </div>`;
        contenedor.appendChild(tarjeta);
    });
}
renderizarPlatos(appetizers, "appetizers-container");
renderizarPlatos(mainCourses, "main-courses-container");
renderizarPlatos(desserts, "desserts-container");

document.addEventListener("click", function(evento){
    if(evento.target.classList.contains("agregar-al-pedido")){
        const tarjeta = evento.target.closest(".tarjeta-seleccionable");
        const nombre = tarjeta.dataset.nombre;
        console.log("Has seleccionado:", nombre);
          const pedidosLocales = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidosLocales.push(nombre);
    localStorage.setItem("pedidos", JSON.stringify(pedidosLocales));
        addDoc(pedidosRef, {name: nombre})
    .then(() => {
      console.log("Pedido guardado en Firebase:", nombre);
    })
    .catch((error) => {
      console.error("Error al guardar en Firebase:", error);
    });
    }
});