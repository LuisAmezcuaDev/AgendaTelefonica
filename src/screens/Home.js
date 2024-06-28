import { View, FlatList, StatusBar, TextInput, ToastAndroid, StyleSheet, Text, TouchableOpacity, Image, Modal} from 'react-native'
import {React, useEffect, useState} from 'react'
import {openDatabase} from 'react-native-sqlite-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'

const db = openDatabase({
  name:'rn_sqlite',
})

const Home = () => {


  // variables de estado para poder mostrar o esconder el modal que 
  // se abrira al querer agregar un nuevo contacto

  const [visible, setVisible] = useState(false)
  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  // Son las variables que nos van a permitir almacenar los datos de un nuevo contacto
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contactos, setContactos] = useState([])

  //mostrar toast al editar datos
  const toastUpdate = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Datos editados correctamente',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      10,
      25,
    );
  };
  //mostrar toast al editar datos
  const toastDelete = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Contacto eliminado',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      10,
      25,
    );
  };
  //mostrar toast al editar datos
  const toastSave = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Contacto agregado exitosamente',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      10,
      25,
    );
  };

  // nuevo estado para editar los datos
  const [editModalVisible, setEditModalVisible] = useState(false);

  // almacenar los datos del elemento seleccionado 
  const [selectedContact, setSelectedContact] = useState(null);

  //esta funcion permite limipar los datos de los formularios
  const clearData = () => {
    setNombre('')
    setApellido('')
    setTelefono('')
    setCorreo('')
  }

  //mediante el uso de esta funcion se crea una tabla dentro de la base de datos
  // la cual es la que tendra los datos de los nuevos contactos.
  const createTables = () => {
    //se crea una nueva transaccion
    db.transaction(txn => {
      txn.executeSql( //se escribe la sentencia SQL que es muy parecida a las que ya hemos trabajado
        `CREATE TABLE IF NOT EXISTS contacto (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), apellido VARCHAR(30), telefono INTEGER, correo VARCHAR(30))`,
        [],
        (SQLTransaction, SQLResultSet) => { //si la transaccion se realizo de manera correcta mostrara este mensaje en consola
          console.log('Tabla creada exitosamente');
        }, 
        error => { //si no mostrara el error correspondiente
          console.log('Error al crear la tabla: ' + error.message);
        },
      );
    });
  }

  //funcion que permite agregar los datos
  const addContacto = () => { 
    //Hacemos la validación de que el nombre y numero de telefono no esten vacios
    // para que se pueda agregar el contacto
    if (!nombre) {
      alert('Agrega Nombre');
      return false;
    }if (!telefono) {
      alert('Agrega un numero de Teléfono')
      return false;
    }

    db.transaction(txn => {
      txn.executeSql( //ponemos la sentencia dentro de la transacción
        'INSERT INTO contacto (name, apellido, telefono, correo) VALUES (?, ?, ?, ?)',
        [nombre, apellido, telefono, correo], //pasamos los valores que seran almacenados
        (SQLTransaction, SQLResultSet) => {
          // console.log(`${nombre}, ${apellido}, ${telefono}, ${correo} datos agregados correctamente`);
          GetContacts();  //mandamos llamar a la funcion que contiene la lista de los contactos
          toastSave() //mostramos un toast con el mensaje de que los datos se guardaron de manera exitosa
        },
        error => { //se muestra el error si la transacción falló
          console.log('Error al agregar información: ' + error.message);
        }
      );
    });
    // Ponemos los campos vacios nuevamente 
    clearData() //mandamos llamar a la funcion de limpiar los datos para vaciar los campos
  };

  //funcion para pactualizar los datos
  const saveChanges = () => {
    //Hacemos la validación de que el nombre y numero de telefono no esten vacios
    // para que se pueda agregar el contacto
    if (!nombre) {
      alert('Agrega Nombre');
      return;
    }
    if (!telefono) {
      alert('Agrega un número de Teléfono');
      return;
    }
  
    db.transaction((txn) => {
      txn.executeSql( //se crea la transaccion en la que se pone el codigo SQL para actualizar los datos
        'UPDATE contacto SET name=?, apellido=?, telefono=?, correo=? WHERE id=?',
        [nombre, apellido, telefono, correo, selectedContact.id],
        (SQLTransaction, SQLResultSet) => {
          setEditModalVisible(false); // Oculta el modal de edición
          GetContacts(); // Actualiza la lista de contactos
          toastUpdate() //se muestra el mensaje del toast para actualizar los datos
        },
        (error) => {
          console.log('Error al actualizar datos: ' + error.message);
        }
      );
    });
    clearData() //limpiamos los datos del formulario
  };
  

  // función para traer los datos de la base de datos
  const GetContacts = () => {
    db.transaction(txn => {
      txn.executeSql( //transaccion con el Query para traer los datos de la tabla de contacto
        `SELECT * FROM contacto ORDER BY id DESC`,
        [],
        (SQLTransaction, res) => {
          let len = res.rows.length; //se crea una variable que va a almacenar la cantidad de datos de la base de datos
          if (len > 0) {
            let results = []; //se crea un arreglo
            for (let i = 0; i < len; i++) { // se crea in FOR
              let item = res.rows.item(i); // se muestran y guardan los datos de la base de datos
              results.push({ id: item.id, name: item.name, apellido: item.apellido, telefono: item.telefono, correo: item.correo });
              //en lo anterior se guardan los datos dentro de results
              console.log(results) //mostramos los resultados en consola
            }
            setContactos(results); //almacenamos los datos dentro de la variable de estado
          }
        },
        error => {
          console.log('Error al obtener los datos: ' + error.message);
        }
      );
    });
  };

  const RenderContacts = ({item}) => {
    const handleEditClick = () => {
      setSelectedContact(item);
      setEditModalVisible(true);
      // Al hacer clic en un contacto, establecemos los valores de los campos de edición
      setNombre(item.name);
      setApellido(item.apellido);
      setTelefono(item.telefono.toString());
      setCorreo(item.correo);
    };

    return (
        <TouchableOpacity onPress={handleEditClick}>
          <View style={styles.contactItem}>
            <Image
                source={require('../images/avatar-de-usuario.png')} // Reemplaza esto con la ruta de tu imagen
                style={{ width: 50, height: 45}} // Ajusta el ancho y alto según tus preferencias
            />
            <Text style={styles.textI}>{item.name + ' '}</Text>
            <Text style={styles.textI}>{item.apellido + ' '}</Text>
          </View>
          </TouchableOpacity> 
    );
  }

  // funcion para elminar contactos
  const deleteContact = (id) => {
    db.transaction((txn) => {
      txn.executeSql(
        'DELETE FROM contacto WHERE id = ?',
        [id],
        (SQLTransaction, SQLResultSet) => {
          GetContacts(); // Actualiza la lista de contactos después de la eliminación
          toastDelete()
        },
        (error) => {
          console.log('Error al eliminar el contacto: ' + error.message);
        }
      );
    });
  };
  
  
  //permite que la tabla se cree al momento de ejecutar la base de datos
  // ademas de traer los datos cada vez que se inicie la palicación
  useEffect(() => {
    createTables();
    GetContacts();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'orange'} />

      <FlatList
        data={contactos}
        renderItem={RenderContacts}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity style={styles.boton1} onPress={show}>
        <Ionicons name="person-add" color={'white'} size={30} />
      </TouchableOpacity>

{/* modal para agregar los datos */}
      <Modal visible={visible} animationType='slide' onRequestClose={hide}>
        <TextInput
          placeholder="Nombre"
          maxLength={20}
          placeholderTextColor={'gray'}
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <TextInput
          placeholder="Apellido"
          placeholderTextColor={'gray'}
          maxLength={30}
          value={apellido}
          onChangeText={setApellido}
          style={styles.input}
        />
        <TextInput
          placeholder="Teléfono"
          keyboardType='phone-pad'
          keyboardAppearance='dark'
          maxLength={10}
          placeholderTextColor={'gray'}
          value={telefono}
          onChangeText={setTelefono}
          style={styles.input}
        />
        <TextInput
          placeholder="Correo electrónico"
          keyboardType='email-address'
          placeholderTextColor={'gray'}
          value={correo}
          onChangeText={setCorreo}
          style={styles.input}
        />

        {/* botones del modal para agregar datos */}
        <TouchableOpacity style={{padding:5, backgroundColor:'green', alignItems:'center', marginBottom:5}} onPress={()=>{addContacto(); hide}}>
            <Text style={{fontSize:20, color:'white'}}>Guardar cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{padding:5,backgroundColor:'red', alignItems:'center'}} onPress={hide}>
            <Text style={{fontSize:20, color:'white'}}>Cancelar</Text>
          </TouchableOpacity>
      </Modal>

      {/* Modal para editar los datos */}
      <Modal visible={editModalVisible} animationType='slide' onRequestClose={hide}>

      {selectedContact && (
        <View>
          <TextInput
            placeholder="Nombre"
            maxLength={20}
            placeholderTextColor={'gray'}
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            placeholder="Apellido"
            placeholderTextColor={'gray'}
            maxLength={30}
            value={apellido}
            onChangeText={setApellido}
            style={styles.input}
          />
          <TextInput
            placeholder="Teléfono"
            keyboardType='phone-pad'
            keyboardAppearance='dark'
            maxLength={10}
            placeholderTextColor={'gray'}
            value={telefono}
            onChangeText={setTelefono}
            style={styles.input}
          />
          <TextInput
            placeholder="Correo electrónico"
            keyboardType='email-address'
            placeholderTextColor={'gray'}
            value={correo}
            onChangeText={setCorreo}
            style={styles.input}
          />
          <TouchableOpacity style={{backgroundColor:'green', alignItems:'center', marginBottom:5}} onPress={saveChanges}>
            <Text style={{fontSize:20, color:'white'}}>Guardar cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'red', alignItems:'center', marginBottom:5}} onPress={() => {
            deleteContact(selectedContact.id)
            clearData();
            setEditModalVisible(false)
          }}>
            <Text style={{fontSize:20, color:'white'}}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'blue', alignItems:'center'}} onPress={() => 
            {setEditModalVisible(false);
            clearData();
            }}>
            <Text style={{fontSize:20, color:'white'}}>Cancelar</Text>
          </TouchableOpacity>
          
        </View>
      )}
    </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginHorizontal: 8,
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: '3%',
    marginTop:'3%'
  },
  boton1: {
    backgroundColor: 'blue',
    width: '14%',
    borderRadius: 30,
    padding: 12,
    position: 'absolute',
    bottom: '5%',
    right: '3%',
  },
  contactItem: {
    alignItems: 'center',
    marginVertical: 8,
    padding: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'lightblue',
  },
  textI: {
    color: 'white',
    fontSize: 15,
  },
});

export default Home;