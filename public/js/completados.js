var tbody = document.querySelector('.tbody');
const btnCierra = document.querySelector('#btn-cierra');
const lightbox = document.querySelector('#contenedor-principal');
const imagenActiva = document.querySelector('#imagen-activa');

document.addEventListener('DOMContentLoaded', async () => {

    const urlReporte = 'http://31.220.31.215:3000/api/reporte/completado';

    try {
        const respReporte = await fetch(urlReporte, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const resultadoReporte = await respReporte.json();
        if(resultadoReporte['ok'] == true) {
            
            resultadoReporte['reportes'].forEach(element => {
                // console.log(element['nombre']);
                const row = document.createElement('tr');
                row.innerHTML += `
                    
                    <td><a class=" button ${(element['estado'] === false) ? 'pendiente seleccionar' : 'terminado'} pendiente" href="#" data-id="${element['uid']}">${(element['estado'] === false) ? 'terminar' : 'terminado'}</a></td> 
                    <td>${element['nombre']}</td>
                    <td>${element['numero']}</td>
                    <td>${element['tipoServicio']}</td>
                    <td>${element['direccion']}</td>
                    <td>${element['descripcion']}</td>
                    <td><img class="imagen" src="${(element['urlImagen'] === "no-imagen") ? "img/no-image.png" : element['urlImagen']}" alt="${element['descripcion']}"></td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.log(error);
    }
});

cargarEventListener();

function cargarEventListener() {
    tbody.addEventListener('click', reporteCompletado);
}

async function reporteCompletado(e) {
    e.preventDefault();
    if(e.target.classList.contains('imagen')) {
        // aqui va la funcionalidad de colorbox
        abreLightbox(e);
    }
}

// async function hacerPeticion(e, urlActualizarPen) {
//     try {
//         const respActualizar = await fetch(urlActualizarPen, { 
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         const resultadoActualizar = await respActualizar.json();
//         if(resultadoActualizar["ok"] == true) {
//             // Swal.fire(
//             //     'Actualizado',
//             //     'El reporte se acompleto correctamente',
//             //     'success'
//             // );
//             const cambiar = e.target.parentElement;
//             const etiqueta = cambiar.querySelector('a');
//             etiqueta.classList.remove("pendiente");
//             etiqueta.classList.remove("seleccionar");
//             etiqueta.classList.add("terminado");
//             etiqueta.innerHTML = 'terminado';
//             // deshabilitamos el btn
//             etiqueta.disabled = true;
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

const abreLightbox = (e) => {
    imagenActiva.src = e.target.src;
    lightbox.style.display = 'flex';  
}

btnCierra.addEventListener('click', () => {
    lightbox.style.display = 'none';
});