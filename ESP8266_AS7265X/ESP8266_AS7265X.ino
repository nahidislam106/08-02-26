#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Wire.h>
#include "SparkFun_AS7265X.h"
#include <Adafruit_AS7341.h>

/* ================= CONFIG ================= */
#define AP_SSID   "Spectral_Analyzer"
#define AP_PASS   "spectral123"
#define GRAPH_UPDATE_INTERVAL 2000  // 2 seconds

/* ================= OBJECTS ================= */
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

AS7265X as7265x;
Adafruit_AS7341 as7341;

/* ================= FLAGS ================= */
bool as7341_ok = false;
bool sensorsReady = false;
bool hasWebSocketClients = false;

/* ================= DATA ================= */
float as7265xData[18] = {0};
uint16_t as7341Data[10] = {0};
float combinedData[28] = {0};

/* ================= TIMERS ================= */
unsigned long lastRead = 0;
unsigned long lastBroadcast = 0;

/* ================= SIMPLIFIED HTML ================= */
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML>
<html>
<head>
    <title>Spectral Analyzer</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f0f0f0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .status {
            background: #e0e0e0;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .chart-container {
            position: relative;
            height: 400px;
            width: 100%;
        }
        #debug {
            background: #f8f8f8;
            padding: 10px;
            border-radius: 5px;
            margin-top: 20px;
            font-family: monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔬 Real-time Spectral Analyzer</h1>
        
        <div class="status">
            WiFi Status: <span id="wifiStatus" style="color: green;">Connected</span> | 
            Update Rate: <span id="updateRate">2 sec</span> | 
            Last Update: <span id="lastUpdate">Waiting...</span> |
            Clients: <span id="clientCount">0</span>
        </div>
        
        <div class="chart-container">
            <canvas id="spectralChart"></canvas>
        </div>
        
        <div id="debug">
            <div>Debug Console:</div>
            <div id="debugLog">Initializing...</div>
        </div>
    </div>

    <script>
        // Initialize debug log
        let debugLog = document.getElementById('debugLog');
        let logCount = 0;
        
        function addLog(message) {
            logCount++;
            const time = new Date().toLocaleTimeString();
            debugLog.innerHTML = `[${time}] ${message}<br>` + debugLog.innerHTML;
            if (logCount > 20) {
                debugLog.innerHTML = debugLog.innerHTML.split('<br>').slice(0, 20).join('<br>');
            }
        }
        
        addLog("Page loaded, initializing chart...");
        
        // Initialize Chart with wavelength labels
        const ctx = document.getElementById('spectralChart').getContext('2d');
        const wavelengthLabels = [
            '410nm','435nm','460nm','485nm','510nm','535nm',
            '560nm','585nm','610nm','645nm','680nm','705nm',
            '730nm','760nm','810nm','860nm','900nm','940nm',
            '415nm','445nm','480nm','515nm','555nm','590nm',
            '630nm','680nm','Clear','NIR'
        ];
        
        let spectralChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: wavelengthLabels,
                datasets: [{
                    label: 'Spectral Intensity',
                    data: Array(28).fill(0),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Intensity'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Wavelength'
                        },
                        ticks: {
                            maxRotation: 90,
                            minRotation: 90
                        }
                    }
                }
            }
        });
        
        addLog("Chart initialized, connecting WebSocket...");
        
        // WebSocket Connection
        let ws;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 10;
        
        function connectWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = protocol + '//' + window.location.host + '/ws';
            
            addLog(`Connecting to ${wsUrl}...`);
            
            ws = new WebSocket(wsUrl);
            
            ws.onopen = function() {
                addLog("✅ WebSocket connected successfully!");
                document.getElementById('wifiStatus').textContent = 'Connected';
                document.getElementById('wifiStatus').style.color = 'green';
                reconnectAttempts = 0;
            };
            
            ws.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    addLog(`📊 Received ${data.length} data points`);
                    
                    // Update chart
                    spectralChart.data.datasets[0].data = data;
                    spectralChart.update();
                    
                    // Update timestamp
                    const now = new Date();
                    const timeString = now.toLocaleTimeString();
                    document.getElementById('lastUpdate').textContent = timeString;
                    
                    // Update client count
                    document.getElementById('clientCount').textContent = '1';
                    
                } catch (error) {
                    addLog(`❌ Error parsing data: ${error}`);
                }
            };
            
            ws.onclose = function(event) {
                addLog(`❌ WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
                document.getElementById('wifiStatus').textContent = 'Disconnected';
                document.getElementById('wifiStatus').style.color = 'red';
                document.getElementById('clientCount').textContent = '0';
                
                // Try to reconnect
                if (reconnectAttempts < maxReconnectAttempts) {
                    reconnectAttempts++;
                    addLog(`🔄 Reconnecting (attempt ${reconnectAttempts}/${maxReconnectAttempts})...`);
                    setTimeout(connectWebSocket, 3000);
                } else {
                    addLog("❌ Max reconnection attempts reached. Please refresh the page.");
                }
            };
            
            ws.onerror = function(error) {
                addLog(`⚠️ WebSocket error: ${error}`);
            };
        }
        
        // Initial connection
        connectWebSocket();
        
        // Test button for manual data request (optional)
        document.addEventListener('DOMContentLoaded', function() {
            const testButton = document.createElement('button');
            testButton.textContent = 'Test Connection';
            testButton.style.margin = '10px';
            testButton.style.padding = '10px';
            testButton.onclick = function() {
                addLog("🔄 Manual connection test...");
                fetch('/data')
                    .then(response => response.json())
                    .then(data => {
                        addLog(`✅ GET /data received ${data.length} values`);
                        spectralChart.data.datasets[0].data = data;
                        spectralChart.update();
                    })
                    .catch(error => {
                        addLog(`❌ GET /data failed: ${error}`);
                    });
            };
            document.querySelector('.status').appendChild(testButton);
        });
        
        // Periodically check connection
        setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                // Connection is good
            } else {
                addLog("⚠️ WebSocket not connected, checking...");
            }
        }, 5000);
        
    </script>
</body>
</html>
)rawliteral";

/* ================= WIFI SETUP ================= */
void startWiFiAP() {
    Serial.println("\n=== Starting Access Point ===");
    
    WiFi.mode(WIFI_AP);
    WiFi.softAP(AP_SSID, AP_PASS);
    
    delay(100);  // Give AP time to start
    
    Serial.println("Access Point Started!");
    Serial.print("SSID: ");
    Serial.println(AP_SSID);
    Serial.print("Password: ");
    Serial.println(AP_PASS);
    Serial.print("IP Address: ");
    Serial.println(WiFi.softAPIP());
    Serial.print("MAC Address: ");
    Serial.println(WiFi.softAPmacAddress());
}

/* ================= SENSOR INITIALIZATION ================= */
bool initSensors() {
    Serial.println("\n=== Initializing Sensors ===");
    
    bool success = true;
    
    // Initialize AS7265X
    Serial.print("AS7265X: ");
    if (as7265x.begin()) {
        Serial.println("OK");
        as7265x.disableIndicator();
        as7265x.setIntegrationCycles(1);
        as7265x.setGain(3);  // Max gain
        as7265x.setMeasurementMode(3);  // Continuous mode
        
        // Set bulb current for all three bulbs
        as7265x.setBulbCurrent(12, 0);  // White bulb
        as7265x.setBulbCurrent(12, 1);  // UV bulb
        as7265x.setBulbCurrent(12, 2);  // IR bulb
        
        as7265x.enableBulb(0);  // Enable white bulb
        as7265x.enableBulb(1);  // Enable UV bulb
        as7265x.enableBulb(2);  // Enable IR bulb
        
        sensorsReady = true;
    } else {
        Serial.println("FAILED");
        success = false;
    }
    
    // Initialize AS7341
    Serial.print("AS7341: ");
    if (as7341.begin()) {
        Serial.println("OK");
        as7341.setATIME(100);
        as7341.setASTEP(999);
        as7341.setGain(AS7341_GAIN_256X);
        as7341_ok = true;
    } else {
        Serial.println("FAILED (optional)");
        // AS7341 is optional, don't fail initialization
    }
    
    return success;
}

/* ================= SENSOR READ ================= */
void readSensors() {
    if (sensorsReady) {
        // Take measurement with AS7265X
        as7265x.takeMeasurementsWithBulb();
        
        // Read AS7265X data
        as7265xData[0] = as7265x.getA();   // 410nm
        as7265xData[1] = as7265x.getB();   // 435nm
        as7265xData[2] = as7265x.getC();   // 460nm
        as7265xData[3] = as7265x.getD();   // 485nm
        as7265xData[4] = as7265x.getE();   // 510nm
        as7265xData[5] = as7265x.getF();   // 535nm
        as7265xData[6] = as7265x.getG();   // 560nm
        as7265xData[7] = as7265x.getH();   // 585nm
        as7265xData[8] = as7265x.getI();   // 610nm
        as7265xData[9] = as7265x.getJ();   // 645nm
        as7265xData[10] = as7265x.getK();  // 680nm
        as7265xData[11] = as7265x.getL();  // 705nm
        as7265xData[12] = as7265x.getR();  // 730nm
        as7265xData[13] = as7265x.getS();  // 760nm
        as7265xData[14] = as7265x.getT();  // 810nm
        as7265xData[15] = as7265x.getU();  // 860nm
        as7265xData[16] = as7265x.getV();  // 900nm
        as7265xData[17] = as7265x.getW();  // 940nm
    }
    
    if (as7341_ok) {
        // Read AS7341 data
        uint16_t rawData[12];
        if (as7341.readAllChannels(rawData)) {
            as7341Data[0] = rawData[AS7341_CHANNEL_415nm_F1];
            as7341Data[1] = rawData[AS7341_CHANNEL_445nm_F2];
            as7341Data[2] = rawData[AS7341_CHANNEL_480nm_F3];
            as7341Data[3] = rawData[AS7341_CHANNEL_515nm_F4];
            as7341Data[4] = rawData[AS7341_CHANNEL_555nm_F5];
            as7341Data[5] = rawData[AS7341_CHANNEL_590nm_F6];
            as7341Data[6] = rawData[AS7341_CHANNEL_630nm_F7];
            as7341Data[7] = rawData[AS7341_CHANNEL_680nm_F8];
            as7341Data[8] = rawData[AS7341_CHANNEL_CLEAR];
            as7341Data[9] = rawData[AS7341_CHANNEL_NIR];
        }
    }
    
    // Combine data
    for (int i = 0; i < 18; i++) combinedData[i] = as7265xData[i];
    for (int i = 0; i < 10; i++) combinedData[18 + i] = (float)as7341Data[i];
    
    // Debug print
    static int readCount = 0;
    if (++readCount % 5 == 0) {
        Serial.print("Sensors read: ");
        Serial.print(as7265xData[0], 2);
        Serial.print(" ... ");
        Serial.println(as7341Data[0]);
    }
}

/* ================= WEBSOCKET BROADCAST ================= */
void broadcastSpectralData() {
    if (ws.count() > 0) {
        // Create JSON array
        String json = "[";
        for (int i = 0; i < 28; i++) {
            json += String(combinedData[i], 2);
            if (i < 27) json += ",";
        }
        json += "]";
        
        // Broadcast to all clients
        ws.textAll(json);
        
        // Debug
        static int broadcastCount = 0;
        if (++broadcastCount % 10 == 0) {
            Serial.print("Broadcast #");
            Serial.print(broadcastCount);
            Serial.print(" to ");
            Serial.print(ws.count());
            Serial.println(" clients");
        }
    }
}

/* ================= SETUP ================= */
void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("\n==================================");
    Serial.println("     SPECTRAL ANALYZER BOOTUP     ");
    Serial.println("==================================");
    
    // Initialize I2C
    Serial.println("\nInitializing I2C...");
    Wire.begin(D2, D1);  // SDA=D2, SCL=D1
    Wire.setClock(100000);  // Start with 100kHz
    
    // Start WiFi AP
    startWiFiAP();
    
    // Initialize sensors
    if (!initSensors()) {
        Serial.println("\n⚠️  WARNING: Some sensors failed to initialize");
        Serial.println("Continuing with available sensors...");
    }
    
    // WebSocket event handler
    ws.onEvent([](AsyncWebSocket *server, AsyncWebSocketClient *client, 
                  AwsEventType type, void *arg, uint8_t *data, size_t len) {
        if (type == WS_EVT_CONNECT) {
            Serial.printf("WebSocket client #%u connected from %s\n", 
                         client->id(), client->remoteIP().toString().c_str());
            hasWebSocketClients = true;
            
            // Send initial data immediately
            String json = "[";
            for (int i = 0; i < 28; i++) {
                json += String(combinedData[i], 2);
                if (i < 27) json += ",";
            }
            json += "]";
            client->text(json);
            
        } else if (type == WS_EVT_DISCONNECT) {
            Serial.printf("WebSocket client #%u disconnected\n", client->id());
            hasWebSocketClients = (ws.count() > 0);
        }
    });
    
    // HTTP Routes
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
        Serial.println("Serving HTML page");
        request->send_P(200, "text/html", index_html);
    });
    
    server.on("/data", HTTP_GET, [](AsyncWebServerRequest *request) {
        Serial.println("GET /data request");
        String json = "[";
        for (int i = 0; i < 28; i++) {
            json += String(combinedData[i], 2);
            if (i < 27) json += ",";
        }
        json += "]";
        request->send(200, "application/json", json);
    });
    
    server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request) {
        String json = "{";
        json += "\"sensors\": {";
        json += "\"as7265x\": " + String(sensorsReady ? "true" : "false") + ",";
        json += "\"as7341\": " + String(as7341_ok ? "true" : "false");
        json += "}, ";
        json += "\"clients\": " + String(ws.count()) + ",";
        json += "\"heap\": " + String(ESP.getFreeHeap());
        json += "}";
        request->send(200, "application/json", json);
    });
    
    // Add WebSocket handler
    server.addHandler(&ws);
    
    // Start server
    server.begin();
    
    Serial.println("\n✅ HTTP server started!");
    Serial.println("📡 Connect to WiFi: " + String(AP_SSID));
    Serial.println("🔑 Password: " + String(AP_PASS));
    Serial.print("🌐 Open browser to: http://");
    Serial.println(WiFi.softAPIP());
    Serial.println("\n⏳ Initializing sensors, please wait...");
    
    // Initial sensor read
    delay(1000);
    readSensors();
    
    Serial.println("\n✅ System ready! Waiting for connections...");
}

/* ================= MAIN LOOP ================= */
void loop() {
    unsigned long currentMillis = millis();
    
    // Read sensors periodically
    if (currentMillis - lastRead >= GRAPH_UPDATE_INTERVAL) {
        lastRead = currentMillis;
        readSensors();
    }
    
    // Broadcast to WebSocket clients
    if (currentMillis - lastBroadcast >= GRAPH_UPDATE_INTERVAL) {
        lastBroadcast = currentMillis;
        broadcastSpectralData();
    }
    
    // Clean up WebSocket clients
    ws.cleanupClients();
    
    // Monitor system health
    static unsigned long lastHealthCheck = 0;
    if (currentMillis - lastHealthCheck >= 10000) {
        lastHealthCheck = currentMillis;
        
        Serial.print("System health - ");
        Serial.print("Clients: ");
        Serial.print(ws.count());
        Serial.print(" | Heap: ");
        Serial.print(ESP.getFreeHeap());
        Serial.print(" | Data[0]: ");
        Serial.println(combinedData[0], 2);
        
        // Restart if low memory
        if (ESP.getFreeHeap() < 6000) {
            Serial.println("⚠️  Low memory, restarting...");
            delay(100);
            ESP.restart();
        }
    }
    
    delay(10);  // Prevent watchdog reset
}