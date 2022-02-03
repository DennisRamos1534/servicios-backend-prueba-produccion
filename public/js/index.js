var tbody = document.querySelector('.tbody');

document.addEventListener('DOMContentLoaded', async () => {

    const url = 'http://31.220.31.215:3000/api/login/adminrenovar';
    const token = localStorage.getItem('x-token');

    try {
        const resp = await fetch(url, { 
            method: 'GET',
            headers: {
                'x-token': token,
                'Content-Type': 'application/json',
            }
        });
        const resultado = await resp.json();
        if(resultado['ok'] == false) {
            localStorage.removeItem('x-token');
            window.location.href = '/login.html';
            return;
        } else {
            localStorage.setItem('x-token', resultado['token']);
            // hacer el llamado al backend
            const urlReporte = 'http://31.220.31.215:3000/api/reporte';

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
        }
    } catch (error) {
        console.log(error);
    }
});

const socket = io();

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Perdimos comunicación con el servidor');
});

// socket.emit('mensaje', { nombre: 'Fernando' } );
// const direccion = document.querySelector('.socketh1');
// const reporte = document.querySelector('.socket3');

socket.on('prueba', function( payload ){
    // console.log('Escuchando:', payload );
    const row = document.createElement('tr');
    row.innerHTML += `
        
        <td><a class="seleccionar button pendiente" href="#" data-id="${payload.uid}">terminar</a></td> 
        <td>${payload.nombre}</td>
        <td>${payload.numero}</td>
        <td>${payload.tipoServicio}</td>
        <td>${payload.direccion}</td>
        <td>${payload.descripcion}</td>
        <td><img class="imagen" src="${(payload.urlImagen === "no-imagen") ? "img/no-image.png" : payload.urlImagen}" alt="${payload.descripcion}"></td>
    `;
    tbody.prepend(row);
    // tbody.appendChild(row);
});

cargarEventListener();

function cargarEventListener() {
    tbody.addEventListener('click', reporteCompletado);
}

async function reporteCompletado(e) {
    e.preventDefault();
    if(e.target.classList.contains('seleccionar')) {
        const id = e.target.getAttribute('data-id');
        const urlActualizar = `http://31.220.31.215:3000/api/reporte/${id}`;

        try {
            const respActualizar = await fetch(urlActualizar, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resultadoActualizar = await respActualizar.json();
            if(resultadoActualizar["ok"] == true) {
                Swal.fire(
                    'Actualizado',
                    'El reporte se acompleto correctamente',
                    'success'
                );
                const cambiar = e.target.parentElement;
                const etiqueta = cambiar.querySelector('a');
                etiqueta.classList.remove("pendiente");
                etiqueta.classList.remove("seleccionar");
                etiqueta.classList.add("terminado");
                etiqueta.innerHTML = 'terminado';
                // deshabilitamos el btn
                etiqueta.disabled = true;
            }
        } catch (error) {
            console.log(error);
        }
    }
}
