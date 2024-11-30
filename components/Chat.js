import { GiftedChat, Bubble, Time } from "react-native-gifted-chat";
import { useEffect, useState } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
    const { name, bgColor, userId } = route.params
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

    useEffect(() => {
        // Update screen title with the given.
        navigation.setOptions({ title: name })

    }, []);

    useEffect(() => {
        const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

        // Listen to messages update in DB and set messages in component state.
        // Also define unsubscribe variable which is returned by onSnapshot.
        const unsubscribeToMessage = onSnapshot(messagesQuery, (updatedMessages) => {
            const messageList = [];

            // Loop on updatedMessages to access data from each messageObj using .data.
            updatedMessages.forEach((messageObj) => {
                const data = messageObj.data()

                // Update createdAt date to date object which GiftedChat can understand.
                messageList.push({ ...data, createdAt: data.createdAt.toDate() })
            })

            // Set messages in state so those can be passed in GiftedChat
            setMessages(messageList);
        })


        // unsubscribe from message collection listin on cleanup (component unmount)
        return () => {
            // Check if unsubscribeToMessage is present before calling.
            if (unsubscribeToMessage) unsubscribeToMessage();
        }
    }, [])

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
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})

export default Chat;