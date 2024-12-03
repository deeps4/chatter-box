import { GiftedChat, Bubble, Time, InputToolbar } from "react-native-gifted-chat";
import { useEffect, useState } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView, Button, TouchableOpacity, Text } from "react-native";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const { name, bgColor, userId } = route.params;

    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        const messagesCollection = collection(db, 'messages');

        addDoc(messagesCollection, newMessages[0]);
    }

    const renderTime = (timeProps) => {
        return <Time
            {...timeProps}
            timeTextStyle={{
                right: {
                    color: 'grey'
                },
                left: {
                    color: 'grey'
                }
            }}
        />
    }

    const renderMessageBubble = (props) => {
        return <Bubble {...props}
            renderTime={renderTime}
            textStyle={{
                right: {
                    color: '#000000',
                }
            }}
            wrapperStyle={{
                left: {
                    backgroundColor: '#FFFFFF',
                },
                right: {
                    backgroundColor: '#E3FBCC'
                }
            }} />
    }

    const renderInputToolbar = (props) => {
        // Show Input message toolbar only when user is online.
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    const renderActionSheet = (props) => {
        return <CustomActions storage={storage} userId={userId} {...props} />
    }

    const renderCustomView = ({ currentMessage }) => {
        if (currentMessage.location) {
            // Display custom map view with current message location
            return <MapView
                style={styles.mapMessage}
                region={{
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }} />
        }
        return null;
    }


    // Store messages in device using AsyncStorage
    const storeMessages = async (messageList) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messageList))
        } catch (error) {
            console.log(error.message);
        }
    }

    // Load messages from AsyncStorage and set in component state.
    const loadMessagesFromStorage = async () => {
        try {
            const messagesFromStorage = await AsyncStorage.getItem('messages');
            if (messagesFromStorage) {
                setMessages(JSON.parse(messagesFromStorage));
            } else {
                setMessages([]);
            }
        } catch (e) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        // Update screen title with the given.
        navigation.setOptions({ title: name })

    }, []);

    useEffect(() => {
        let unsubscribeToMessage;
        if (isConnected === true) {
            const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

            // Listen to messages update in DB and set messages in component state.
            // Also define unsubscribe variable which is returned by onSnapshot.
            unsubscribeToMessage = onSnapshot(messagesQuery, (updatedMessages) => {
                const messageList = [];

                // Loop on updatedMessages to access data from each messageObj using .data.
                updatedMessages.forEach((messageObj) => {
                    const data = messageObj.data()

                    // Update createdAt date to javascript date which GiftedChat can understand.
                    messageList.push({ ...data, createdAt: data.createdAt.toDate() })
                })

                // Store messages in device storage so that it can be used when user is offline.
                storeMessages(messageList);

                // Set messages in state so those can be passed in GiftedChat
                setMessages(messageList);
            })
        } else {
            // load messages from device storage
            loadMessagesFromStorage();
        }

        // unsubscribe from message collection listin on cleanup (component unmount)
        return () => {
            // Check if unsubscribeToMessage is present before calling.
            if (unsubscribeToMessage) unsubscribeToMessage();
        }
    }, [isConnected])

    return (
        <View style={styles.container} backgroundColor={bgColor}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: userId,
                    name,
                }}
                renderBubble={renderMessageBubble}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderActionSheet}
                renderCustomView={renderCustomView}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {Platform.OS === "ios" ? <KeyboardAvoidingView keyboardVerticalOffset={-210} behavior="padding" /> : null}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapMessage: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3
    }
})

export default Chat;