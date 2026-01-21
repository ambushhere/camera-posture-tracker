# Posture Tracker 🎯

A real-time web application designed to help you maintain a healthy posture using AI-powered pose detection. The app monitors your head and shoulder alignment through your webcam and alerts you when you start to slouch or lean.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Technology](https://img.shields.io/badge/technology-MediaPipe-green.svg)

## ✨ Features

- **Real-time Monitoring**: Uses MediaPipe Pose to track your body alignment in real-time.
- **Custom Calibration**: Set your "perfect posture" as a reference point for personalized tracking.
- **Visual Feedback**: Real-time overlay of your skeleton on the camera feed.
- **Instant Notifications**: Audio and visual alerts when your posture deviates from the reference.
- **Adjustable Sensitivity**: Fine-tune head and shoulder tilt thresholds to suit your needs.
- **Privacy Focused**: All processing is done locally in your browser. No video data is sent to any server.

## 🚀 Getting Started

### Prerequisites

You only need a modern web browser (Chrome, Edge, or Firefox recommended) and a webcam.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ambushhere/camera-posture-tracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd camera-posture-tracker
   ```
3. Open `index.html` in your browser or serve it using a local server:
   ```bash
   # If you have Node.js installed
   npx serve .
   ```

## 🛠️ How to Use

1. **Initialize**: Allow the browser to access your camera.
2. **Calibrate**: Sit in your ideal healthy posture and click the **"Calibrate"** button. Wait for the 3-second countdown.
3. **Start**: Once calibrated, click **"Start"** to begin monitoring.
4. **Settings**: Adjust the sliders at the bottom if the alerts are too frequent or not sensitive enough.
5. **Toggle Skeleton**: Use the **"Hide Skeleton"** button if you prefer a cleaner view.

## 🧰 Tech Stack

- **Foundations**: HTML5, CSS3, JavaScript (Vanilla)
- **AI/ML**: [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose)
- **Styling**: Modern CSS with Glassmorphism effects

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
*Stay healthy and keep your back straight!* 🦴✨
