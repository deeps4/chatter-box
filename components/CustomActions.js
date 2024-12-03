import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as Location from 'expo-location';

const CustomActions = ({ storage, userId, onSend, wrapperStyle, iconTextStyle }) => {
    const actionSheet = useActionSheet();

    const getUniqueFileName = (imageUri) => {
        const splittedImageUri = imageUri.split('/')
        const fileName = splittedImageUri[splittedImageUri.length - 1];
        const timeStamp = (new Date()).getTime();

        // Creating a unique file name which will be stored in firebase storage using
        // userId, current time stamp and uploaded file name.
        return `${userId}-${timeStamp}-${fileName}`;
    }

    const uploadAndSendImage = async (imageUri) => {
        try {
            // Fetch image uri and change the response to blob format,
            // then upload the blob to firebase Storage and get the download url
            // then send the image download url to firestore.
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const uniqueFileName = getUniqueFileName(imageUri);
            const newUploadRef = ref(storage, uniqueFileName);

            const snapshot = await uploadBytes(newUploadRef, blob);
            const imageURL = await getDownloadURL(snapshot.ref);

            onSend({
                image: imageURL
            })
        } catch (e) {
            console.log(e);
        }

    }

    const pickPhoto = async () => {
        const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

        if (permission?.granted) {
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {
                await uploadAndSendImage(result.assets[0].uri);
            }
        }

    }

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (permission?.granted) {
            const result = await ImagePicker.launchCameraAsync();

            if (!result.canceled) {
                await uploadAndSendImage(result.assets[0].uri);
            }
        }
    }

    const getLocation = async () => {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission?.granted) {
            const location = await Location.getCurrentPositionAsync();
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude
                    }
                })
            }

        }
    }


    const showActionSheet = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        // Show action sheet with options on the screen when + icon is clicked.
        actionSheet.showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, async (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    await pickPhoto();
                    return;
                case 1:
                    await takePhoto();
                    return;
                case 2:
                    await getLocation();
                    return;
                default:
            }
        })
    }

    return <TouchableOpacity style={styles.container} onPress={showActionSheet}>
        <View style={[styles.wrapper, wrapperStyle]}>
            <Text style={[styles.iconText, iconTextStyle]}>+</Text>
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;