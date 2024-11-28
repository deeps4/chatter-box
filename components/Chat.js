import { GiftedChat, Bubble, Time } from "react-native-gifted-chat";
import { useEffect, useState } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import placeholderAvatar from '../assets/placeholder-avatar.png'

const Chat = ({ route, navigation }) => {
    const { name, bgColor } = route.params
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
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
        console.log(props);
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

        // Adding a dummy message just to check on the chat screen.
        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: placeholderAvatar,
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ]);

    }, []);

    return (
        <View style={styles.container} backgroundColor={bgColor}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: 1
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