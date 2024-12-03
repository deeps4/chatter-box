# Chatter-Box

Chatter-Box is a React Native chat application that allows users to communicate seamlessly through text, images, and shared locations. This app is built with Expo and leverages the Gifted Chat library for implementing chat functionality.

## Features

- **Real-Time Chat**: Send and receive text messages in real-time.
- **Image Sharing**: Capture photos or select images from your device and share them instantly.
- **Location Sharing**: Share your current location with other users, displayed on an interactive map view.
- **Cross-Platform Compatibility**: Use the app on both iOS and Android devices.

## Prerequisites

To run the application locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Install Xcode (for ios emulator) or Android Studio (for android emulator) or use a physical device for testing.

## Installation

Follow these steps to get started:

1. Clone the repository:

   ```bash
   git clone https://github.com/deeps4/chatter-box.git
   cd chatter-box
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npm start
   ```

## Libraries and Tools

This app utilizes the following libraries and tools:

- **[Expo](https://expo.dev/):** Simplifies the development of React Native applications.
- **[React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat):** A powerful library for building chat UIs.
- **Firebase:** For anonymous authentication, data and image storage.

## How to Use

1. Launch the app on your device or emulator.
2. Start a chat by typing a message and sending it.
3. Use the plus icon on the left hand side of the message input box to see actions to pick a photo from gallery, to take a photo with camera and to share you current location in a map view.
