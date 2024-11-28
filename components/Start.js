import { useState } from "react";
import { StyleSheet, Text, TextInput, View, ImageBackground, FlatList, TouchableOpacity } from "react-native";

// Image to display in the background
import homeImage from '../assets/home-image.png';

// Getting navigation object in props, passed from NavigationStack.
const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [bgColor, setBgColor] = useState('');

    // colors options to provide for chat screen background
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE']

    const shouldDisableChatBtn = !name || !bgColor;

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.image} source={homeImage} resizeMode="cover">
                <Text style={styles.title}>Chatter Box</Text>
                <View style={styles.formBox}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Your Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <View>
                        <Text style={styles.bgColorHeading}>Choose Background Color:</Text>

                        {/* Using flat list to display the background color options*/}
                        <FlatList horizontal data={colors} renderItem={({ key, item }) => {
                            const colorCircleStyles = {
                                ...styles.colorCicle,
                                backgroundColor: item,
                                borderWidth: bgColor === item ? 2 : 0,
                                borderColor: 'red',
                            };
                            return <TouchableOpacity
                                key={key}
                                style={colorCircleStyles}
                                onPress={() => {
                                    setBgColor(item);
                                }} />
                        }} />
                    </View>
                    {/* Using touchable opactity instead of button as it is easy to customise. */}
                    <TouchableOpacity
                        style={shouldDisableChatBtn ? styles.disabledBtn : {}}
                        // Disable button when name or bgColor is not selected
                        disabled={shouldDisableChatBtn}
                        onPress={() => {
                            navigation.navigate('Chat', { name, bgColor })
                        }}>
                        <Text style={styles.submitBtn}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        padding: '6%',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 45,
        fontWeight: 600,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: '20%'
    },
    textInput: {
        fontSize: 16,
        fontWeight: 300,
        opacity: 0.5,
        padding: 12,
        borderWidth: 2,
        borderColor: '#757083',
        borderRadius: 2
    },
    formBox: {
        backgroundColor: '#FFFFFF',
        padding: '6%',
        height: 300,
        justifyContent: 'space-between'
    },
    bgColorHeading: {
        fontSize: 16,
        fontWeight: 300,
        color: '#757083',
        opacity: 1,
        marginBottom: 12
    },
    colorCicle: {
        width: 50,
        height: 50,
        marginRight: 12,
        borderRadius: 25
    },
    submitBtn: {
        display: 'flex',
        fontSize: 16,
        fontWeight: 600,
        color: '#FFFFFF',
        backgroundColor: '#757083',
        padding: 16,
        textAlign: 'center'
    },
    disabledBtn: {
        opacity: 0.6
    }

})

export default Start;