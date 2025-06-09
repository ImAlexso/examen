document.addEventListener("DOMContentLoaded", function () {
  const db = window.db;

  // Leer alumnos desde Firestore al cargar
  db.collection("alumnos").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const alumno = doc.data();
      insertarFila(alumno.avatar, alumno.nombre, alumno.apellidos, alumno.dni, alumno.telefono, doc.id);
    });
  });

  function añadirAlumno() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    // Generar SVG localmente con multiavatar
    const svg = multiavatar(nombre); // Usando la librería local

    // Guardar en Firestore
    db.collection("alumnos").add({
      nombre,
      apellidos,
      dni,
      telefono,
      avatar: svg
    }).then((docRef) => {
      console.log("Alumno guardado con ID:", docRef.id);
      insertarFila(svg, nombre, apellidos, dni, telefono, docRef.id);
    });

    document.getElementById("formularioAlumno").reset();
  }

function insertarFila(avatarSVG, nombre, apellidos, dni, telefono, id) {
  const fila = document.createElement("tr");
  fila.setAttribute("data-id", id);

  const tdAvatar = document.createElement("td");
  tdAvatar.classList.add("align-middle"); // ✅ centra verticalmente el avatar
  tdAvatar.innerHTML = avatarSVG;

  const tdNombre = document.createElement("td");
  tdNombre.classList.add("align-middle");
  tdNombre.textContent = nombre;

  const tdApellidos = document.createElement("td");
  tdApellidos.classList.add("align-middle");
  tdApellidos.textContent = apellidos;

  const tdDNI = document.createElement("td");
  tdDNI.classList.add("align-middle");
  tdDNI.textContent = dni;

  const tdTelefono = document.createElement("td");
  tdTelefono.classList.add("align-middle");
  tdTelefono.textContent = telefono;

  const tdAsistencia = document.createElement("td");
  tdAsistencia.classList.add("align-middle");

  const btnPresente = document.createElement("button");
  btnPresente.innerHTML = `<i class="bi bi-check"></i>`;
  btnPresente.classList.add("btn", "btn-outline-primary", "btn-sm");
  btnPresente.setAttribute("type", "button");
  btnPresente.addEventListener("click", function () {
    this.textContent = "Presente";
    this.classList.remove("btn-outline-primary");
    this.classList.add("btn-success", "fw-bold");
    this.disabled = true;
  });

  const btnEliminar = document.createElement("button");
  btnEliminar.innerHTML = `<i class="bi bi-trash"></i>`;
  btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
  btnEliminar.setAttribute("type", "button");
  btnEliminar.addEventListener("click", function () {
    if (confirm("¿Seguro que quieres eliminar este alumno?")) {
      const idDoc = this.closest("tr").getAttribute("data-id");

      db.collection("alumnos").doc(idDoc).delete()
        .then(() => {
          console.log("Alumno eliminado de Firestore");
          this.closest("tr").remove();
        })
        .catch((error) => {
          console.error("Error al eliminar de Firestore:", error);
        });
    }
  });

    tdAsistencia.appendChild(btnPresente);
    tdAsistencia.appendChild(btnEliminar);

    fila.appendChild(tdAvatar);
    fila.appendChild(tdNombre);
    fila.appendChild(tdApellidos);
    fila.appendChild(tdDNI);
    fila.appendChild(tdTelefono);
    fila.appendChild(tdAsistencia);

    document.getElementById("listaAlumnos").appendChild(fila);
  }

  document.getElementById("formularioAlumno").addEventListener("submit", function (e) {
    e.preventDefault();
    añadirAlumno();
  });
});