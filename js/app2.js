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
//var tabla = document.getElementById("tabla");
//var buscar = document.getElementById("buscar");


btnGuardar2 = document.getElementById("guardar2").addEventListener("click", guardarMedicamento);

//************************************** */
// AGREGAR DATOS A FIREBASE
//************************************** */



function guardarMedicamento(){
   var nombre = document.getElementById('Medicamento').value;
   var precio = document.getElementById('Precio').value;
   var farmacia = document.getElementById('farmacia').value;

   db.collection("medicamentos").add({
       dnombre: nombre,
       dprecio: precio,
       dfarmacia:farmacia
   }).then(function() {
    
    swal("Registro guardado");
    document.getElementById('Medicamento').value = '';
    document.getElementById('Precio').value = '';
    document.getElementById('farmacia').value = '';
   }).catch(function() {
       swal("Error al agregar medicamento");
   });
}


//************************************** */
// LEER LOS DATOS DE FIRESTORE
//************************************** */

var tabla = document.getElementById('tabla');
db.collection("medicamentos").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        tabla.innerHTML += `
        <tr>
            <td>${doc.data().dnombre}</td>
            <td>${doc.data().dprecio}</td>
            <td class="center">${doc.data().dfarmacia}</td>
            <td>
                <button onclick="borrar('${doc.id}')"><i class="material-icons blue-text">delete</i></button>
                <button onclick="editar('${doc.id}','${doc.data().dnombre}','${doc.data().dprecio}','${doc.data().dfarmacia}')"><i class="material-icons red-text">edit</i></button>
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
                db.collection("medicamentos").doc(id).delete().then(function() {
                    swal("Poof! Registro eliminado!", {
                        icon: "success",
                    });
                })
            } else {
                swal("Su registro esta a salvo!");
            }
        });

  

}

//************************************** */
// EDITAR LOS DATOS DE FIRESTORE
//************************************** */


function editar(id, n, t, d) {
    $('#modal1').modal('open');
    document.getElementById('mnombre').value = n;
    document.getElementById('mprecio').value = t;
    document.getElementById('mfarmacia').value = d;
    document.getElementById('editar').addEventListener('click', edita);

    function edita() {
        var datosRef = db.collection("medicamentos").doc(id);

        return datosRef.update({
                dnombre: document.getElementById('mnombre').value,
                dprecio: document.getElementById('mprecio').value,
                dfarmacia: document.getElementById('mfarmacia').value,
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


document.querySelector("#buscar").onkeyup = function () {
    $filtro_tabla("#tabla-datos", this.value);
}

$filtro_tabla = function (id, value) {
    var filas= document.querySelectorAll(id + ' tbody tr');

    for (var i = 0; i < filas.length; i++) {
        var mostrarFila = false;

        var fila= filas[i];
        fila.style.display = 'none';

        for (var x = 0; x < fila.childElementCount; x++) {
            if (fila.children[x].textContent.toLowerCase().indexOf(value.toLowerCase().trim()) > -1) {
                mostrarFila = true;
                break;
            }
        }

        if (mostrarFila ) {
            fila.style.display = null;
        }
    }
}




