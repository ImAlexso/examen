// pedidos.js

const contenedorPedidos = document.getElementById("pedidos-container");

function renderizarPedidos() {
  contenedorPedidos.innerHTML = "";
  const pedidosLocales = JSON.parse(localStorage.getItem("pedidos")) || [];

  if (pedidosLocales.length === 0) {
    contenedorPedidos.innerHTML = "<p class='text-center w-100 mt-4'>No hay pedidos aún.</p>";
    return;
  }

  pedidosLocales.forEach((nombre, index) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-12 col-sm-6 col-md-4 mb-4";

    tarjeta.innerHTML = `
      <div class="card h-100">
        <div class="card-body text-center">
          <h5 class="card-title">${nombre}</h5>
          <button class="btn btn-danger btn-sm eliminar-pedido" data-indice="${index}">Eliminar</button>
        </div>
      </div>
    `;

    contenedorPedidos.appendChild(tarjeta);
  });
}

// Evento para manejar clics en botones de eliminar
contenedorPedidos.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar-pedido")) {
    const indice = parseInt(e.target.dataset.indice);
    const pedidosLocales = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidosLocales.splice(indice, 1);
    localStorage.setItem("pedidos", JSON.stringify(pedidosLocales));
    renderizarPedidos();
  }
});

renderizarPedidos();