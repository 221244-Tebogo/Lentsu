<!-- Banner -->
<p align="center">
  <img src="./Mockups/lentsu_banner.png" alt="Lentsu Banner" />
</p>

<h2 align="center">Lentsu — Your Voice is Your Shield</h2>
<p align="center">React Native (Expo) · TypeScript · Firebase · Google Auth · Voice · Location · One-Hand UX</p>

<!-- Badges -->
<p align="center">
  <a href="https://github.com/YOUR_GH_USER/lentsu/fork" target="_blank">
    <img src="https://img.shields.io/github/forks/YOUR_GH_USER/lentsu" alt="Forks"/>
  </a>
  <a href="https://github.com/YOUR_GH_USER/lentsu/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/YOUR_GH_USER/lentsu" alt="Stars"/>
  </a>
  <a href="https://github.com/YOUR_GH_USER/lentsu/commits/main" target="_blank">
    <img src="https://img.shields.io/github/commit-activity/m/YOUR_GH_USER/lentsu" alt="Commit Activity"/>
  </a>
  <a href="https://github.com/YOUR_GH_USER/lentsu/commits/main" target="_blank">
    <img src="https://img.shields.io/github/last-commit/YOUR_GH_USER/lentsu" alt="Last Commit"/>
  </a>
  <a href="https://github.com/YOUR_GH_USER/lentsu/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/YOUR_GH_USER/lentsu" alt="Issues"/>
  </a>
  <a href="https://github.com/YOUR_GH_USER/lentsu/pulls" target="_blank">
    <img src="https://img.shields.io/github/issues-pr/YOUR_GH_USER/lentsu" alt="PRs"/>
  </a>
  <a href="https://github.com/YOUR_GH_USER/lentsu/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/YOUR_GH_USER/lentsu?color=f85149" alt="License">
  </a>
</p>

<!-- Tech Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Expo-000000?logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Native-61DAFB?logo=react&logoColor=000" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=000" />
  <img src="https://img.shields.io/badge/Auth-Google%20Sign--In-DB4437" />
  <img src="https://img.shields.io/badge/Voice-@react--native--voice/voice-0B284A" />
  <img src="https://img.shields.io/badge/TTS-expo--speech-0B284A" />
  <img src="https://img.shields.io/badge/Location-expo--location-0B284A" />
  <img src="https://img.shields.io/badge/Maps-react--native--maps-0B284A" />
  <img src="https://img.shields.io/badge/Storage-AsyncStorage-0B284A" />
</p>

---

## Table of Contents
1. [Inspiration Cards](#inspiration-cards)  
2. [About Lentsu] 
3. [Screens](#screens)  
4. [Architecture](#architecture)  
5. [Implementation Notes](#implementation-notes)  
6. [Install & Run](#install--run)  
7. [Env & Config](#env--config)  
8. [Project Structure](#project-structure)  
9. [Demo Video](#demo-video)  
10. [Roadmap](#roadmap)  
11. [Credits](#credits)  

---

## Inspiration Cards
- **Goal**: Stay Safe  
- **Device Interaction**: Audio  
- **Constraint**: One-hand usage only  

---

## About Lentsu
- **Google Authentication** — Secure sign-in via Expo Auth Session + Firebase.  
- **Voice Router** — Commands like “emergency” or “share location” navigate instantly.  
- **Emergency SOS** — One tap/voice sends GPS + logs an alert in Firestore.  
- **Location Share** — Share current coordinates with a trusted contact.  
- **Trusted Contacts** — Local-first via `AsyncStorage`.  
- **TTS Feedback** — `expo-speech` confirms actions.  

<!-- Hero () -->
<p align="center">
  <img src="./Mockups/cover.png" alt="Lentsu — Home · Login · Emergency" />
</p>

---

## Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>Home</h3>
      <p>A one-hand, thumb-first home with a big mic CTA and clear tiles for Emergency, Share Location, Camera, and Profile.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Google Auth</h3>
      <p>Sign in with Google; Firebase keeps your session synced. Minimal friction, fast resume.</p>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top">
      <h3>Share Location</h3>
      <p>Tap to share a Google Maps link with precise coordinates to your trusted contacts.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Camera</h3>
      <p>Quick capture to save plates/faces. Save locally or share with your ICE contact.</p>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top">
      <h3>Voice</h3>
      <p>Hands-free transcription to route actions: emergency, location, or call for help.</p>
    </td> 
    <td width="50%" valign="top"></td>
  </tr>
</table>


---

## Install & Run

### Prerequisites

Node 18+ & npm
Xcode (iOS) / Android SDK (Android)
Firebase project (Auth + Firestore enabled)

### Clone & Install
git clone
cd lentsu
npm install

----
<p align="center"> <video width="600" controls> <source src="Lentsu-Audio_Demonstration.mp4" type="video/mp4"> Your browser does not support the video tag. </video> </p>

## Install Expo Modules
npx expo install expo-auth-session expo-location expo-camera expo-av expo-video
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-gesture-handler react-native-screens react-native-safe-area-context react-native-reanimated

### Configure Environment

Create a .env (see Env & Config).
npx expo start   # press i to open simulator

Android
npx expo run:android

#### Expo Go
npx expo start

press: w (web), i (iOS), a (Android)
Use not npm expo start.
.env & Config
Create .env in the project root (add these into dot env):

##### Google OAuth (Expo Auth Session)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com

EXPO_PUBLIC_FIREBASE_API_KEY=xxxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxx.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxx
EXPO_PUBLIC_FIREBASE

## Credits
https://gluestack.io/ui/docs/guides/recipes/linear-gradient

https://github.com/firebase/firebase-ios-sdk

https://docs.expo.dev/versions/latest/sdk/localization/

https://docs.expo.dev/versions/latest/sdk/splash-screen/

https://pixabay.com/sound-effects/search/success/

https://mixkit.co/free-sound-effects/discover/success/

https://www.zedge.net/ringtones/3f874506-bdf1-4e9f-900b-fb5588e887aa

https://www.youtube.com/watch?v=xNaGYGDZ2JU&t=8s

https://youtu.be/U5aeM5dvUpA?si=xrJZjKmFGhBXY3h4

https://www.youtube.com/watch?v=pP7quzFmWBY

https://www.smashingmagazine.com/2020/02/design-mobile-apps-one-hand-usage/