//************************************** */
//Autenticación de firebase
//************************************** */
firebase.initializeApp({
    apiKey: "AIzaSyAr60PNOotTw3SZP1K8HjbPQfrj4eYBQwk",
    authDomain: "farmaciajuigalpina.firebaseapp.com",
    projectId: "farmaciajuigalpina"
});

// Inicializar Firestore
var db = firebase.firestore();

btnGuardar = document.getElementById("guardar").addEventListener("click", guardar);

//************************************** */
// AGREGAR DATOS A FIREBASE
//************************************** */

function guardar() {
    var nombre = document.getElementById('nombre').value;
    var telefono = document.getElementById('telefono').value;
    var direccion = document.getElementById('direccion').value;
    var atencion = document.getElementById('atencion').value;

    db.collection("datos").add({
            dnombre: nombre,
            dtelefono: telefono,
            ddireccion: direccion,
            datencion: atencion
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            swal("Registro guardado");
            document.getElementById('nombre').value = '';
            document.getElementById('telefono').value = '';
            document.getElementById('direccion').value = '';
            document.getElementById('atencion').value = '';
        })
        .catch(function(error) {
            swal("Error al agregar documento", error);
        });

}

//************************************** */
// LEER LOS DATOS DE FIRESTORE
//************************************** */
var tabla = document.getElementById('tabla');
db.collection("datos").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().dnombre}`);
        tabla.innerHTML += `
        <tr>
            <td>${doc.id}</td>
            <td>${doc.data().dnombre}</td>
            <td>${doc.data().dtelefono}</td>
            <td>${doc.data().ddireccion}</td>
            <td>${doc.data().datencion}</td>
            <td>
                <button onclick="borrar('${doc.id}')"><i class="material-icons blue-text">delete</i></button>
                <button onclick="editar('${doc.id}','${doc.data().dnombre}','${doc.data().dtelefono}','${doc.data().ddireccion}','${doc.data().datencion}')"><i class="material-icons red-text">edit</i></button>
            </td>
            
        </tr>
        `;
    });
});

//************************************** */
// BORRAR LOS DATOS DE FIRESTORE
//************************************** */

function borrar(id) {

    swal({
            title: "Esta seguro?",
            text: "Una vez eliminado, no podra recuperar el registro!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                db.collection("datos").doc(id).delete().then(function() {
                    swal("Poof! Registro eliminado!", {
                        icon: "success",
                    });
                })
            } else {
                swal("Su registro esta a salvo!");
            }
        });

    // Hacerlo de manera basica puede utilizar estas sentencias

    /*db.collection("datos").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });*/

}

//************************************** */
// EDITAR LOS DATOS DE FIRESTORE
//************************************** */


function editar(id, pn, sn, edad) {
    $('#modal1').modal('open');
    document.getElementById('enombre').value = pn;
    document.getElementById('esnombre').value = sn;
    document.getElementById('ee').value = edad;
    document.getElementById('editar').addEventListener('click', edita);

    function edita() {
        var datosRef = db.collection("datos").doc(id);

        return datosRef.update({
                primerNombre: document.getElementById('enombre').value,
                segundoNombre: document.getElementById('esnombre').value,
                edad: document.getElementById('ee').value
            })
            .then(function() {
                swal("Registro Editado");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                swal("Error al actualizar", error);
            });

    }

}
