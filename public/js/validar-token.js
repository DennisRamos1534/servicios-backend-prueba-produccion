

// validarToken();


// async function validarToken() {
    
//     const token = localStorage.getItem('x-token');
//     const url = 'http://localhost:3000/api/login/adminrenovar';

//     try {
//         const resp = await fetch(url, {
        
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-token': token,
//             }
//         });
//         const resultado = await resp.json();
//         if(resultado['ok'] == true) {
//             localStorage.removeItem('x-token');
//             window.location.href = '/login.html';
//             console.log();
//         } else {
//             window.location.href = '/';
//         }
//         console.log(resultado['token']);
//     } catch (error) {
//         console.log(error);
//     }
// }