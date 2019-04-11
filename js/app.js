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

 btnGuardar = document.getElementById("guardar").addEventListener("click", guardar);

//btnGuardar2 = document.getElementById("guardar2").addEventListener("click", guardarMedicamento);

//************************************** */
// AGREGAR DATOS A FIREBASE
//************************************** */

function guardar() {
    var nombre = document.getElementById('nombre').value;
    var telefono = document.getElementById('telefono').value;
    var direccion = document.getElementById('direccion').value;
    var atencion = document.getElementById('atencion').value;

    db.collection("farmacias").add({
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
        .catch(function(err) {
            swal("Error al agregar documento", err);
        });

}

/*function guardarMedicamento(){
   var nombre = document.getElementById('Medicamento').value;
   var precio = document.getElementById('Precio').value;

   db.collection("medicamentos").add({
       dnombre: nombre,
       dprecio: precio
   }).then(function() {
    
    swal("Registro guardado");
    document.getElementById('Medicamento').value = '';
    document.getElementById('Precio').value = '';
   }).catch(function() {
       swal("Error al agregar medicamento");
   });
}*/


//************************************** */
// LEER LOS DATOS DE FIRESTORE
//************************************** */

console.log("Entrada de datos")
var tabla = document.getElementById('tabla');
db.collection("farmacias").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().dnombre}`);
        tabla.innerHTML += `
        <tr>
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
                db.collection("farmacias").doc(id).delete().then(function() {
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


function editar(id, n, t, d,a) {
    $('#modal1').modal('open');
    document.getElementById('mnombre').value = n;
    document.getElementById('mtelefono').value = t;
    document.getElementById('mdireccion').value = d;
    document.getElementById('matencion').value = a;
    document.getElementById('editar').addEventListener('click', edita);

    function edita() {
        var datosRef = db.collection("farmacias").doc(id);

        return datosRef.update({
                dnombre: document.getElementById('mnombre').value,
                dtelefono: document.getElementById('mtelefono').value,
                ddireccion: document.getElementById('mdireccion').value,
                datencion: document.getElementById('matencion').value
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




