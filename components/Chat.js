import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

const Chat = ({ route, navigation }) => {
    const { name, bgColor } = route.params

    useEffect(() => {
        // Update screen title with the given.
        navigation.setOptions({ title: name })
    }, []);

    return (
        <View style={styles.container} backgroundColor={bgColor}>
            <Text>Chat</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default Chat;