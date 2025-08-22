<!-- Banner -->
<p align="center">
  <img src="./Mockups/lentsu_banner.png" alt="Lentsu Banner" />
</p>

<h2 align="center">Lentsu — Your Voice is Your Shield</h2>
<p align="center">React Native (Expo) · TypeScript · Firebase · Voice · Location · One-Hand UX</p>

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
  <img src="https://img.shields.io/badge/Voice-@react--native--voice/voice-0B284A" />
  <img src="https://img.shields.io/badge/TTS-expo--speech-0B284A" />
  <img src="https://img.shields.io/badge/Location-expo--location-0B284A" />
  <img src="https://img.shields.io/badge/Maps-react--native--maps-0B284A" />
  <img src="https://img.shields.io/badge/Storage-AsyncStorage-0B284A" />
</p>

---

## Table of Contents
1. [Inspiration Cards](#inspiration-cards)
2. [What Lentsu Does (MVP)](#what-lentsu-does-mvp)
3. [Architecture](#architecture)
4. [Implementation Notes (Dev Level)](#implementation-notes-dev-level)
5. [Data Model](#data-model)
6. [Security Rules (Firestore)](#security-rules-firestore)
7. [Screens](#screens)
8. [Install & Run](#install--run)
9. [Env & Config](#env--config)
10. [Project Structure](#project-structure)
11. [Branching & Commits](#branching--commits)
12. [Demo Video](#demo-video)
13. [Roadmap](#roadmap)
14. [License](#license)
15. [Credits](#credits)

---

## Inspiration Cards
- **Goal**: Stay Safe  
- **Device Interaction**: Audio  
- **Constraint**: One-hand usage only

> The app is voice-first and puts all critical actions in the thumb zone.

---

## What Lentsu Does (MVP)
- **Voice Router**: Say “emergency”, “share location”, or “contacts” → app navigates to the correct screen.
- **Emergency SOS**: Single tap (or voice) captures GPS, writes an `alert` to Firestore, and prepares a shareable Google Maps link.
- **Location Share**: Share current coordinates with trusted contacts (Share Sheet).
- **Trusted Contacts (local-first)**: Quick add/remove list via `AsyncStorage` for speed and offline resilience.
- **TTS Feedback**: `expo-speech` confirms actions (“Emergency activated…”).
- **Auth**: Email/password with persistent session.

---

## Architecture

```mermaid
flowchart LR
  subgraph App [React Native (Expo, TS)]
    Home-->VoiceSvc
    Home-->TTSSvc
    Home-->Nav
    Home-->Perms
    Home-->"EmergencyScreen"
    Home-->"MapShare"
    Home-->"TrustedContacts"
  end

  subgraph Services
    VoiceSvc["@react-native-voice/voice"]
    TTSSvc["expo-speech"]
    Loc["expo-location"]
  end

  subgraph Firebase
    Auth["Auth (email/password)"]
    FS["Firestore (alerts, locations)"]
  end

  EmergencyScreen-->Loc
  EmergencyScreen-->FS
  MapShare-->Loc
  MapShare-->FS
  Home-->Auth
