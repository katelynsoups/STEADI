import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import React from 'react'
import { addUserAuto } from '../src/firebase'

const Home = () => {
  const handleCreateUser = async () => {
    const sample = {
      name: 'Test User',
      email: 'testuser@example.com',
      createdAt: new Date().toISOString(),
    }
    const res = await addUserAuto(sample)
    if (res.success) {
      Alert.alert('User created', `id: ${res.id}`)
    } else {
      Alert.alert('Error', String(res.error))
    }
  }

  return (
    <View style={styles.container}>
      <Text>This is the begining of Digital STEADI!</Text>
      <Button title="Create sample user" onPress={handleCreateUser} />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
    flex: 1,                  
    justifyContent: 'center', 
    alignItems: 'center',
    }    
})