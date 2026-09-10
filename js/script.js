const secciones = document.querySelectorAll("section, header");

const enlaces = document.querySelectorAll("menu, a");

function resaltarMenu() {
    let actual = "";

    secciones.forEach((seccion) => {
        const topSeccion = seccion.offsetTop - 100;
        if ( window.scrollY >= topSeccion ) {
            actual = seccion.getAttribute("id");
        }
    
});

    enlaces.forEach((enlace) => {
        enlace.classList.remove("activo");
        if (enlace.getAttribute("href") ==="#" + actual) {
            enlace.classList.add("activo");
        }

    });
}

window.addEventListener("scroll", resaltarMenu);

const botonTema = document.getElementById("toggle-tema");

const html = document.documentElement;

const temaGuardado = localStorage.getItem("tema");
if (temaGuardado){
    html.setAttribute("data-tema", temaGuardado);
    botonTema.textContent = temaGuardado === "oscuro" ? "☀️" : "🌙";
}

botonTema.addEventListener("click", () => {
    const temaActual = html.getAttribute("data-tema");

    if (temaActual === "oscuro"){
        html.removeAttribute("data-tema");
        localStorage.setItem("tema", "claro");
        botonTema.textContent = "🌙";
    } else{
        html.setAttribute("data-tema", "oscuro");
        localStorage.setItem("tema", "oscuro");
        botonTema.textContent = "☀️";
    }
});

const API_KEY = "AIzaSyBo98CemOWLf0pPAH5L9X04QU1tKs7i1JM";
const FOLDER_ID = "1TtzcgAO9OI1SpvRW9j9aLkU5NykC_Z8r";
const contenedorGaleria = document.getElementById("grid-fotos");

async function cargarFotosDeDrive() {
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&orderBy=createdTime+desc&fields=files(id,name)&key=${API_KEY}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.error) {
            throw new Error(datos.error.message);
        }

        if (!datos.files || datos.files.length === 0) {
            contenedorGaleria.innerHTML = "<p>Aún no hay fotos en la carpeta.</p>";
            return;
        }

        contenedorGaleria.innerHTML = "";

        datos.files.forEach((archivo) => {
            const img = document.createElement("img");
            img.src = `https://www.googleapis.com/drive/v3/files/${archivo.id}?alt=media&key=${API_KEY}`;
            img.alt = archivo.name;
            contenedorGaleria.appendChild(img);
        });

    } catch (error) {
        console.error("Error al cargar fotos de Drive:", error);
        contenedorGaleria.innerHTML = "<p>No se pudieron cargar las fotos. Revisa la consola (F12) para más detalles.</p>";
    }
}

cargarFotosDeDrive();