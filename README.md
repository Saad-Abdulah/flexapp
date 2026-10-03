# FLEX - Student Academic Portal Reimagined (React Native)

## 📌 Proposed Solution
University students often struggle to accurately calculate their real-time grades and keep track of strict attendance requirements across multiple courses with varying assessment weightages. This application reimagines the traditional student portal (FLEX) by providing two powerful, interactive modules:
1. **Attendance Dashboard**: Visually tracks attendance percentages across the semester using interactive charts, calculates exact "Presents" needed to reach the safe 80% threshold, and provides a semester-wide progress overview.
2. **Grade Planner**: A dynamic, predictive grading calculator. It allows students to map out nested assessments (e.g., adding multiple individual quizzes inside a 'Quizzes' category), dynamically divides weightage according to raw marks, and predicts exact scaling factors or fixed marks needed to pass a failing course.

## 🚀 Major Features
- **Data-Driven Architecture**: The entire application is built on a single source of truth (React `useState`), demonstrating pure frontend array/object manipulation without external databases.
- **Dynamic Assessment Weightage**: Add nested sub-items effortlessly. The app mathematically scales the absolute marks proportionally based on the raw `Obtained/Total` ratio.
- **Predictive Grading Engine**: The app intelligently predicts if a student can pass. If failing, it calculates the required scaling factor or flat absolute marks needed. If no realistic factor (`<= 1.25`) can save them, it logically alerts the user instead of suggesting impossible metrics.
- **Interactive Dashboards**: Utilizes `react-native-chart-kit` for visual data representation, featuring both a `BarChart` for individual courses and a `ProgressChart` for the overall semester average.
- **State-Based Routing**: Achieves complete application navigation solely using conditional rendering and React state variables, adhering strictly to assignment constraints (no external navigation libraries like React Navigation).
- **Glassmorphism UI**: Designed with `expo-blur` and a sleek dark mode theme to provide a premium, modern, and highly interactive user experience.

## 🛠 Setup & Run Instructions

### Prerequisites
- Node.js installed on your machine.
- Expo Go app installed on your physical mobile device (Android/iOS) OR Android Studio/Xcode for emulators.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Saad-Abdulah/flexapp.git
   ```
2. Navigate into the project directory:
   ```bash
   cd flexapp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
1. Start the Expo development server, clearing the cache for best performance:
   ```bash
   npx expo start -c
   ```
2. **For Physical Device**: Open the **Expo Go** app on your phone and scan the QR code generated in the terminal.
3. **For Web**: Press `w` in the terminal to launch the app directly in your browser.
4. **For Emulator**: Press `a` (Android) or `i` (iOS) in the terminal to launch on a connected emulator.
