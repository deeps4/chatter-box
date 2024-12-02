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
    apiKey: "AIzaSyDP4gCI40psjlwlztgpYmm_UzETTXEmf8o",
    authDomain: "chatter-box-2ae0a.firebaseapp.com",
    projectId: "chatter-box-2ae0a",
    storageBucket: "chatter-box-2ae0a.firebasestorage.app",
    messagingSenderId: "1031412477150",
    appId: "1:1031412477150:web:ce55d4cab0ca2a273ea64f"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Initialize database
  const db = getFirestore(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      // Show alert and disabled firestore network when user is offline.
      Alert.alert("Connection Lost!")
      disableNetwork(db)
    } else if (connectionStatus.isConnected === true) {
      // Enable firestore network when user is online.
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