import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import React from 'react'
import { addUserAuto } from '../src/firebase'
import { useRouter } from 'expo-router'

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
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text>This is the begining of Digital STEADI!</Text>
      <Button title="Create sample user" onPress={handleCreateUser} />
      <Button title="Go to Login" onPress={() => router.navigate('/login')} />
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