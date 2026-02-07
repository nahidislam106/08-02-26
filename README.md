# 🌈 Multispectral Sensor System

Real-time monitoring system for AS7265X (18 channels) and AS7341 (11 channels) spectral sensors using ESP8266, Firebase, and Next.js.

## 📦 Components

- **ESP8266**: Reads sensors and sends data to Firebase
- **AS7265X**: SparkFun 18-channel spectral sensor
- **AS7341**: Adafruit 11-channel spectral sensor
- **Firebase Realtime Database**: Cloud data storage
- **Next.js Dashboard**: Real-time web interface

---

## 🔌 Hardware Setup

### Wiring (NodeMCU/ESP-12E)
- **SDA** → D2 (GPIO4)
- **SCL** → D1 (GPIO5)
- **VCC** → 3.3V
- **GND** → GND

*Both sensors share the same I2C bus.*

---

## 🚀 Arduino Setup

### 1. Install Required Libraries
Open Arduino IDE → Tools → Manage Libraries, then install:
- `SparkFun AS7265X`
- `Adafruit AS7341`
- `Firebase Arduino Client Library for ESP8266` (by Mobizt)

### 2. Configure WiFi Credentials
Edit `ESP8266_AS7265X.ino`:
```cpp
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
```

### 3. Upload Sketch
1. Select board: **NodeMCU 1.0 (ESP-12E Module)**
2. Select correct COM port
3. Click Upload
4. Open Serial Monitor (115200 baud) to verify connection

---

## 🌐 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📊 Dashboard Features

- **Real-time Updates**: Data refreshes automatically from Firebase
- **Live Status Indicator**: Green dot when receiving data
- **AS7265X Panel**: Displays all 18 spectral channels
- **AS7341 Panel**: Shows 11 channels with color-coded wavelengths
- **Timestamp**: Shows last data update time

---

## 🔥 Firebase Database Structure

```json
{
  "sensorData": {
    "AS7265X": {
      "A": 123.45,
      "B": 234.56,
      ...
      "W": 345.67
    },
    "AS7341": {
      "F1_415nm": 1234,
      "F2_445nm": 2345,
      ...
      "NIR": 3456
    },
    "timestamp": 1234567890
  }
}
```

---

## 🛠️ Troubleshooting

### ESP8266 Issues
- **Sensor not found**: Check I2C wiring and connections
- **WiFi connection failed**: Verify SSID and password
- **Firebase error**: Check database URL and API key

### Frontend Issues
- **No data showing**: Ensure ESP8266 is powered and connected
- **Firebase connection error**: Verify firebaseConfig in `lib/firebase.ts`

---

## 📝 Notes

- The ESP8266 sends data every 1 second
- Firebase database rules should allow read/write access
- Both sensors must be connected for full functionality
- The AS7341 initialization is non-blocking (allows system to run with only AS7265X)

---

## 🔗 Links

- [Firebase Console](https://console.firebase.google.com/project/multispectral-4fc9b)
- [Database URL](https://multispectral-4fc9b-default-rtdb.asia-southeast1.firebasedatabase.app/)

---

Built with ❤️ using ESP8266, Firebase, and Next.js
