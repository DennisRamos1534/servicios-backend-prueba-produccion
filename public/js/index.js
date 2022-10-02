
document.addEventListener('DOMContentLoaded', async () => {

    // const pathUrl = 'http://31.220.31.215:3000';
    const pathUrl = 'http://localhost:3000';
    const urlPersonas = `${pathUrl}/api/reporte`;
    const urlLogin = `${pathUrl}/api/login/adminrenovar`;
    const token = localStorage.getItem('x-token');

    let nombreAdministrador = '';

    var resultadoReporte = [];
    var resultado = [];

    const sideMenu = document.querySelector("aside");
    const menuBtn = document.querySelector("#menu-btn");
    const closeBtn = document.querySelector("#close-btn");
    const selectNombreAdmin = document.querySelector("#nombreAdmin");

    const themeToggler = document.querySelector(".theme-toggler");
    
    const tbody = document.querySelector("#tBody"); // Aqui agregamos los tr que se generan dinamicamente

    const footerMostrar = document.querySelector('.mostrar-footer');
    const loading = document.querySelector('.contendor-loading');

    const nombreAdmin = localStorage.getItem('nombre-admin');
    selectNombreAdmin.innerHTML = nombreAdmin; // Agregamos el nombre del administrador

    // TRAEMOS TODAS LAS PESONAS ENCUESTADAS DE LA DB
    footerMostrar.style.display = 'none';
    loading.style.display = 'flex';

    try {
        const resp = await fetch(urlLogin, { 
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
            const nombreAdmin = resultado['admin']['usuario'];
            nombreAdministrador.innerHTML = nombreAdmin; // mostramos en la vista el nombre del administrador
            localStorage.setItem('nombre-admin', nombreAdmin);
            localStorage.setItem('x-token', resultado['token']);
            // peticionEstadisticas();

            try {
                const resp = await fetch(urlPersonas, { 
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                resultadoReporte = await resp.json();
                if(resultadoReporte['ok']) {
                    loading.style.display = 'none';
                    footerMostrar.style.display = 'block';
                    resultadoReporte['reportes'].forEach(per => {
                        // Creamos la tabla dinamicamente con la BD
                        const trBody = document.createElement('tr');
        
                        const tdBody1 = document.createElement('td');
                        const tdBody2 = document.createElement('td');
                        const tdBody3 = document.createElement('td');
                        const tdBody4 = document.createElement('td');
                        const tdBody5 = document.createElement('td');
                        const tdBody6 = document.createElement('td');
                        const tdBody7 = document.createElement('td');
        
                        tdBody1.innerHTML = `<a class="btnSeleccionar button ${(per['estado'] === false) ? 'pendiente seleccionar' : 'terminado'} pendiente" href="#" data-id="${per['uid']}">${(per['estado'] === false) ? 'terminar' : 'terminado'}</a>`;
                        // tdBody1.innerHTML = `<a>${per[estado]}</a>`;
                        tdBody2.innerHTML = per['nombre'];
                        tdBody3.innerHTML = per['numero'];
                        tdBody4.innerHTML = per['tipoServicio'];
                        tdBody5.innerHTML = per['direccion'];
                        tdBody6.innerHTML = per['descripcion'];
                        tdBody7.innerHTML = `<img class="seleccionoImagen imagen reducir" src="${(per['urlImagen'] === "no-imagen") ? "img/no-image.png" : per['urlImagen']}" alt="${per['descripcion']}" data-caption="${per['descripcion']}">`;
        
                        trBody.appendChild(tdBody1);
                        trBody.appendChild(tdBody2);
                        trBody.appendChild(tdBody3);
                        trBody.appendChild(tdBody4);
                        trBody.appendChild(tdBody5);
                        trBody.appendChild(tdBody6);
                        trBody.appendChild(tdBody7);
        
                        tbody.appendChild(trBody);
        
                    });
                }

                const imgLightBox = document.querySelectorAll('.seleccionoImagen');
                M.Materialbox.init(imgLightBox, {
                    inDuration: 500,
                    outDuration: 500,
                });

            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }

    cargarEventListener();

    // FUNCION DE TERMINAR UN REPORTE
    
    function cargarEventListener() {
        tbody.addEventListener('click', reporteCompletar);
    }

    function reporteCompletar(e) {
        e.preventDefault();
        if(e.target.classList.contains('btnSeleccionar')) {
            const id = e.target.getAttribute('data-id');
            const urlActualizar = `${pathUrl}/api/reporte/${id}`;

            Swal.fire({
                title: 'Estas seguro(a)?',
                text: "Deseas acompletar el reporte?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.isConfirmed) {
    
                    hacerPeticion(e, urlActualizar);

                    Swal.fire(
                    'Actualizado',
                    'El reporte se acompleto correctamente',
                    'success'
                    )
                }
            })
        }
    }

    async function hacerPeticion(e, urlActualizarPen) {
        try {
            const respActualizar = await fetch(urlActualizarPen, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            const resultadoActualizar = await respActualizar.json();
            if(resultadoActualizar["ok"] == true) {
    
                const cambiar = e.target.parentElement;
                const etiqueta = cambiar.querySelector('a');
                etiqueta.classList.remove("pendiente");
                etiqueta.classList.remove("btnSeleccionar");
                etiqueta.classList.add("terminado");
                etiqueta.innerHTML = 'terminado';
                // deshabilitamos el btn
                etiqueta.disabled = true;
                
                eliminarReporte(e);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function eliminarReporte(e) {
        tbody.innerHTML = '';
        const reporteId = e.target.getAttribute('data-id');
        resultado = resultadoReporte['reportes'].filter(reporte => reporte.uid !== reporteId);
        // console.log(resultado);
        resultado.forEach(element => {
            // console.log(element['nombre']);
            const row = document.createElement('tr');
            row.innerHTML += `
                
                <td><a class=" button ${(element['estado'] === false) ? 'pendiente seleccionar' : 'terminado'} pendiente" href="#" data-id="${element['uid']}">${(element['estado'] === false) ? 'terminar' : 'terminado'}</a></td> 
                <td>${element['nombre']}</td>
                <td>${element['numero']}</td>
                <td>${element['tipoServicio']}</td>
                <td>${element['direccion']}</td>
                <td>${element['descripcion']}</td>
                <td><img class="seleccionoImagen imagen reducir" src="${(element['urlImagen'] === "no-imagen") ? "img/no-image.png" : element['urlImagen']}" alt="${element['descripcion']}"></td>
                
            `;
            tbody.appendChild(row);
        });
    }
    

    // FIN DE TRAER TODAS LAS PESONAS ENCUESTADAS DE LA DB

    // mostrar aside
    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
    });

    // cerrar aside
    closeBtn.addEventListener('click', () => {
        sideMenu.style.display = 'none';
    });

    themeToggler.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme-variables');

        themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
        themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    }); 

    ////////////////////////////CONEXION CON SOCKET IO////////////////////////////

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
            
            <td><a class="btnSeleccionar seleccionar button pendiente" href="#" data-id="${payload.uid}">terminar</a></td> 
            <td>${payload.nombre}</td>
            <td>${payload.numero}</td>
            <td>${payload.tipoServicio}</td>
            <td>${payload.direccion}</td>
            <td>${payload.descripcion}</td>
            <td><img class="seleccionoImagen imagen reducir" src="${(payload.urlImagen === "no-imagen") ? "img/no-image.png" : payload.urlImagen}" alt="${payload.descripcion}"></td>
        `;
        tbody.prepend(row);

        const imgLightBox = document.querySelectorAll('.seleccionoImagen');
        M.Materialbox.init(imgLightBox, {
            inDuration: 500,
            outDuration: 500,
        });
    });

    //////////////////////////////////////////////////////////////////////////////

    $(document).ready(function() {    
        $('#example').DataTable({        
            language: {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron resultados",
                    "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sSearch": "Buscar:",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast":"Último",
                        "sNext":"Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "sProcessing":"Procesando...",
                },
            //para usar los botones   
            responsive: "true",
            dom: 'Bfrtilp',       
            buttons:[ 
                {
                    extend:    'excelHtml5',
                    text:      '<i class="fas fa-file-excel"></i> ',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success'
                },
                {
                    extend:    'pdfHtml5',
                    text:      '<i class="fas fa-file-pdf"></i> ',
                    titleAttr: 'Exportar a PDF',
                    className: 'btn btn-danger'
                },
                {
                    extend:    'print',
                    text:      '<i class="fa fa-print"></i> ',
                    titleAttr: 'Imprimir',
                    className: 'btn btn-info'
                },
            ]	        
        });     
    });
});