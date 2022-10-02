const formprincipal = document.querySelector('.form-principal');
const errorDiv = document.querySelector('.error');

formprincipal.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.querySelector('#usuario').value;
    const password = document.querySelector('#password').value;

    if(usuario == '' || password == '') {
        mostrarError('Ambos campos deben de ser obligatorios');
        return;
    }

    // consultar la api
    consultarApi(usuario, password);
});

function mostrarError(mensaje) {
    
    const alerta = document.querySelector('.eventoError');

    if(!alerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('eventoError');

        alerta.innerHTML = `
            <strong>Error!</strong>
            <br>
            <span class="">${mensaje}</span>
        `;

        errorDiv.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
}

const consultarApi = async (usuario, password) => {

    const data = {
        "usuario": usuario,
        "password": password
    }
   
    // const url = 'http://31.220.31.215:3000/api/login/admin';
    const url = 'http://localhost:3000/api/login/admin';

    try {
        const resp = await fetch(url, {
        
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resultado = await resp.json();
        if(!resultado['token']) {
            mostrarError('El usuario o la contraseña son incorrectos');
        } else {
            localStorage.setItem('x-token', resultado['token']); // guardar el localStorage
            window.location.href = '/'; // localStorage.getItem('x-token');
        }

    } catch (error) {
        console.log(error);
    }
    
}
