// Home.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { RenderContacts, addContacto, createTables, deleteDates, getContacts } from '../services/Consultas';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
const Home = () => {
  const [contactos, setContactos] = useState([]);
  const navigation = useNavigation(); // Obtiene la variable navigation
  
  useEffect(() => {
    createTables();
    // Cuando se carga la pantalla de inicio, obtén la lista de contactos.
    getContacts(setContactos);
  }, []);

  console.log(getContacts(setContactos))
  return (
    <View style={styles.container}>
      <FlatList
        data={contactos}
        renderItem
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.boton1} onPress={() => {navigation.navigate('Contacts')}}>
        <Ionicons name="person-add" color={'white'} size={30}/>      
      </TouchableOpacity>
      <TouchableOpacity style={styles.boton2} onPress={getContacts}>
        <Ionicons name="trash" color={'white'} size={30}/>      
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  contactItem: {
    alignItems:'center',
    marginVertical: 8,
    padding: 20,
    flexDirection:'row',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor:'lightblue'
  },
  textI:{
    color:'white',
    fontSize:15
  },
  boton1: {
    backgroundColor:'blue', 
    width:'14%', 
    borderRadius:30, 
    padding:10, 
    position:'absolute',
    bottom:'8%',
    right:'5%'
  },
  boton2: {
    backgroundColor:'blue', 
    width:'14%', 
    borderRadius:30, 
    padding:10, 
    position:'absolute',
    bottom:'15%',
    right:'5%'
  }
});

export default Home;
