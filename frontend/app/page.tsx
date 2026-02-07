'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';

interface AS7265XData {
  A: number; B: number; C: number; D: number; E: number; F: number;
  G: number; H: number; I: number; J: number; K: number; L: number;
  R: number; S: number; T: number; U: number; V: number; W: number;
}

interface AS7341Data {
  F1_415nm: number;
  F2_445nm: number;
  F3_480nm: number;
  F4_515nm: number;
  F5_555nm: number;
  F6_590nm: number;
  F7_630nm: number;
  F8_680nm: number;
  CLEAR: number;
  NIR: number;
}

interface SensorData {
  AS7265X?: AS7265XData;
  AS7341?: AS7341Data;
  timestamp?: number;
}

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sensorRef = ref(database, 'sensorData');
    
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(data);
        setConnected(true);
      } else {
        setConnected(false);
      }
    }, (error) => {
      console.error('Firebase error:', error);
      setConnected(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '2px solid #333', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}> Multispectral Sensor Dashboard</h1>
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: connected ? '#00ff00' : '#ff0000',
            display: 'inline-block'
          }} />
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {connected ? 'Live' : 'Disconnected'}
          </span>
          {sensorData?.timestamp && (
            <span style={{ fontSize: '0.9rem', color: '#999', marginLeft: '1rem' }}>
              Last updated: {new Date(sensorData.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      {!sensorData ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          <h2>Waiting for sensor data...</h2>
          <p>Make sure your ESP8266 is powered on and connected to WiFi.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* AS7265X Sensor */}
          {sensorData.AS7265X && (
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#f9f9f9'
            }}>
              <h2 style={{ marginTop: 0, color: '#333' }}>AS7265X (18 Channels)</h2>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                SparkFun Spectral Triad
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {Object.entries(sensorData.AS7265X).map(([key, value]) => (
                  <div key={key} style={{
                    padding: '0.75rem',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>
                      Channel {key}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>
                      {value.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AS7341 Sensor */}
          {sensorData.AS7341 && (
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#f9f9f9'
            }}>
              <h2 style={{ marginTop: 0, color: '#333' }}>AS7341 (11 Channels)</h2>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Adafruit Spectral Sensor
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {Object.entries(sensorData.AS7341).map(([key, value]) => {
                  const wavelengthMatch = key.match(/(\d+)nm/);
                  const wavelength = wavelengthMatch ? wavelengthMatch[1] : null;
                  const colors: {[key: string]: string} = {
                    '415': '#8b00ff', '445': '#4b0082', '480': '#0000ff',
                    '515': '#00ffff', '555': '#00ff00', '590': '#ffff00',
                    '630': '#ffa500', '680': '#ff0000'
                  };
                  const color = wavelength ? colors[wavelength] : '#888';
                  
                  return (
                    <div key={key} style={{
                      padding: '0.75rem',
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          backgroundColor: color,
                          border: '1px solid #ddd'
                        }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333' }}>
                            {key.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>
                        {value.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
