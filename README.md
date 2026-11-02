# Smart Plant Watering System (स्मार्ट पौध सिंचाई प्रणाली)

A clean, presentation-ready agricultural dashboard prototype that provides real-time, weather-informed watering advice to help farmers optimize irrigation and save water.

---

## 🌟 Key Features

---

## 📱 Two-Page Architecture & Navigation

The application is structured into **ONLY TWO distinct pages** with seamless state synchronization:

### 1. Page 1: Dashboard (`डैशबोर्ड`)
- **Current Weather & GPS Location**: Real-time conditions via Open-Meteo, automatic GPS coordinates with Bhopal fallback.
- **7-Day Weather Forecast**: Daily max/min temperatures, precipitation chance, and interactive Recharts rainfall bar chart.
- **Soil Moisture Demo**: Interactive 0–100% moisture slider with *Dry (20%)*, *Normal (45%)*, and *Wet (75%)* presets.
- **Watering Recommendation**: 4 agricultural decisions (*WATER*, *SKIP*, *DELAY*, *MONITOR*) with agronomic explanations.
- **Hindi Voice Advisory**: Web Speech API audio speaking live recommendation, weather, and crop schedule in natural Hindi.

### 2. Page 2: Crop Scheduler (`फसल समय-सारणी`)
- **Crop Selection**: Searchable dropdown (*Wheat, Soybean, Chickpea, Paddy, Maize, Cotton, Mustard, Vegetables, Other*).
- **Soil Type Selection**: *Black Soil, Red Soil, Sandy Soil, Clay Soil, Loamy Soil, Alluvial Soil* with agronomic water retention factors.
- **Sowing Date**: Interactive date picker with quick presets (*Today, 15d Ago, 30d Ago, Clear*) and *Approximate Estimate* fallback.
- **Irrigation Methods**: *Drip Irrigation*, *Sprinkler System*, and *Flood / Traditional Furrow*.
- **Smart Growth Stages Timeline**: Visual schedule showing upcoming irrigation events and critical growth stages.
- **Water Requirement Calculator**:
  - Field area input with quick **Acre** and **Hectare** toggle.
  - Volumetric estimation per irrigation cycle in Litres, Thousand Litres ($kL$), and $m^3$.
- **Water Saving Tracker**:
  - Compares Drip and Sprinkler methods against traditional flood furrow baseline ($55\%$ efficiency).
  - Displays water volume conserved and percentage saved ($+40\%$ for Drip, $+25\%$ for Sprinkler).

### 🤖 Farmer AI Assistant (Floating Chatbot)
- **Floating Access**: Accessible on both **Dashboard** and **Crop Scheduler** via a floating action button without introducing a third page.
- **Farm Context Aware**: Real-time integration of active telemetry (selected crop, soil type, moisture, weather forecast, next irrigation date).
- **Suggested Question Chips**: Instant answers for irrigation timing, leaf yellowing causes, soil suitability, water conservation, and heavy rain management.
- **Agronomic Safety Notices**: Prominent disclaimer warnings on chemical pesticides, fertilizers, and disease diagnosis, advising consultation with local KVK and agricultural extension officers.
- **Demo Mode**: Explicitly labelled as an Agronomic Knowledge Engine with a clean API interface ready for backend integration without exposed client keys.
- **Bilingual**: Fully functional in English and Hindi.

### 🧭 Navigation
- **Desktop**: Clean top navigation pills in header highlighting the active page.
- **Mobile**: Compact bottom navigation bar with icons and clear labels.
- **State Synchronization**: Changes to crop, soil, weather, or moisture immediately update both pages and persist in `localStorage`.

4. **Section 4: Soil Moisture (Interactive Demo)**
   - Smooth 0% - 100% demo slider.
   - Categorized soil statuses: **Dry (< 30%)**, **Moderate (30% - 59%)**, and **Wet (≥ 60%)**.
   - One-click simulation buttons: **Dry Soil (20%)**, **Normal Soil (45%)**, and **Wet Soil (75%)**.
   - Clear demo note: *Simulated reading: No Wi-Fi controller connected yet*.
   - Slider value saved in `localStorage`.

5. **Section 5: Watering Recommendation Engine & 🎙️ Hindi Voice Advisory**
   - Four distinct agricultural decisions:
     - **WATER**: Soil is dry and no significant rain expected.
     - **SKIP**: Soil is already sufficiently moist (≥ 60%), preventing waterlogging.
     - **DELAY**: Significant rain (≥ 70% chance & ≥ 5 mm) is expected soon.
     - **MONITOR**: Moisture is in optimal balanced range.
   - Clear, farmer-friendly explanation for each state.
   - **Hindi Voice Advisory (`Listen to Advice / सलाह सुनें`)**:
     - Built using browser-native **Web Speech API** (`window.speechSynthesis`, `hi-IN` voice).
     - **Speaks the actual calculated crop schedule**:
       *"आपकी गेहूं की फसल काली मिट्टी में लगी है। अगली सिंचाई की अनुमानित तारीख 10 नवंबर है। आज पौधों को पानी देने की सलाह दी जाती है। मौसम के अनुसार बारिश की संभावना को भी ध्यान में रखा गया है।"*
     - Controls for **Play**, **Pause / Resume**, and **Stop Audio**.
     - Automatically cancels previous speech when settings change.
     - Voice toggle (`हिंदी / EN`) with Hindi as default.
   - Explicit advisory notice: *Hardware automation coming soon with ESP32*.

6. **🌐 Instant English & Hindi Language Toggle**
   - Small toggle in the top-right corner (`EN | हिंदी`).
   - Translates all interface text, labels, GPS prompts, error notices, explanations, and statuses into simple, natural Hindi.
   - Preserves numerical values, units, and dates.
   - Language choice persists in `localStorage`.

---

## 🛠️ Tech Stack

- **React 18** + **Vite 6** (JavaScript)
- **Tailwind CSS** (Agricultural theme: white background, dark green primary, light green accents, blue rainfall indicators)
- **Open-Meteo API** (Live weather data)
- **Browser Geolocation API + Reverse Geocoding** (GPS detection)
- **Recharts** (Rainfall bar chart)
- **Lucide React** (Clean weather and UI icons)
- **LocalStorage** (Persistent demo settings, coordinates, and language selection)

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### 3. Build for Production
```bash
npm run build
```
To preview the production bundle:
```bash
npm run preview
```
