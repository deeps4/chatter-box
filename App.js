import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import Start from './components/Start';
import Chat from './components/Chat';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBdkcyaBbBOhGbiTxRI5DebeNIg2nuphSQ",
    authDomain: "chatterbox-32799.firebaseapp.com",
    projectId: "chatterbox-32799",
    storageBucket: "chatterbox-32799.firebasestorage.app",
    messagingSenderId: "338195724375",
    appId: "1:338195724375:web:4ffe239dc8785fdba10b12"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Initialize database
  const db = getFirestore(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!")
      disableNetwork(db)
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db)
    }
  }, [connectionStatus.isConnected])

  return <NavigationContainer>
    <Stack.Navigator initialRouteName='Start'>
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Chat">
        {(props) => {
          return <Chat {...props} db={db} isConnected={connectionStatus.isConnected} />
        }}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
}

export default App;