# บทที่ 13: WiFi และ NTP (เวลาจากอินเทอร์เน็ต) Time

## วัตถุประสงค์
- สแกนเครือข่าย WiFi
- เชื่อมต่ออินเทอร์เน็ต
- ดึงเวลาจาก NTP Server
- แสดงเวลาบน LCD แบบเสถียร

---

## อุปกรณ์ที่ใช้
- ESP32 Development Board
- LCD 16x2 I2C
- Router WiFi (SSID และ Password)

---

## ตัวอย่าง 1: สแกน WiFi

### โค้ด

```cpp
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  Serial.println("WiFi Scanner");
  
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
}

void loop() {
  Serial.println("Scanning...");
  
  int n = WiFi.scanNetworks();
  
  Serial.print("Found ");
  Serial.print(n);
  Serial.println(" networks:");
  
  for(int i = 0; i < n; i++) {
    Serial.print(i + 1);
    Serial.print(": ");
    Serial.print(WiFi.SSID(i));
    Serial.print(" (");
    Serial.print(WiFi.RSSI(i));
    Serial.println(" dBm)");
  }
  
  Serial.println();
  delay(5000);
}
```

### ผลลัพธ์

```
WiFi Scanner
Scanning...
Found 5 networks:
1: MyHome_WiFi (-45 dBm)
2: Neighbor_WiFi (-67 dBm)
3: Guest_Network (-72 dBm)
4: Office_5G (-85 dBm)
5: Public_WiFi (-90 dBm)
```

---

## ตัวอย่าง 2: เชื่อมต่อ WiFi

### โค้ด

```cpp
#include <WiFi.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_PASSWORD";

void setup() {
  Serial.begin(115200);
  Serial.println("Connecting to WiFi...");
  
  WiFi.begin(ssid, password);
  
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("✅ Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // ทำงานอื่นได้
}
```

### ผลลัพธ์

```
Connecting to WiFi...
......
✅ Connected!
IP Address: 192.168.1.100
```

---

## ตัวอย่าง 3: ดึงเวลาจาก NTP

### ทฤษฎี

**NTP (Network Time Protocol)** = โปรโตคอลดึงเวลาที่ถูกต้องจากเซิร์ฟเวอร์

**NTP Server สำหรับไทย:**
- `time.navy.mi.th` (กรมอุทกศาสตร์ ทหารเรือ)
- `pool.ntp.org` (Global)

### โค้ด

```cpp
#include <WiFi.h>
#include <time.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_PASSWORD";

const char* ntpServer = "time.navy.mi.th";
const long gmtOffset_sec = 7 * 3600;  // GMT+7 (ไทย)
const int daylightOffset_sec = 0;

void setup() {
  Serial.begin(115200);
  
  // เชื่อมต่อ WiFi
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
  
  // ดึงเวลาจาก NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  
  Serial.println("Getting time...");
  delay(2000);  // รอให้ดึงเวลาสำเร็จ
}

void loop() {
  struct tm timeinfo;
  
  if(!getLocalTime(&timeinfo)) {
    Serial.println("Failed to get time");
    return;
  }
  
  // แสดงเวลา
  Serial.print("Date: ");
  Serial.print(timeinfo.tm_mday);
  Serial.print("/");
  Serial.print(timeinfo.tm_mon + 1);
  Serial.print("/");
  Serial.println(timeinfo.tm_year + 1900);
  
  Serial.print("Time: ");
  Serial.print(timeinfo.tm_hour);
  Serial.print(":");
  Serial.print(timeinfo.tm_min);
  Serial.print(":");
  Serial.println(timeinfo.tm_sec);
  
  Serial.println();
  delay(1000);
}
```

### ผลลัพธ์

```
...
✅ WiFi Connected!
Getting time...
Date: 8/11/2025
Time: 14:35:20

Date: 8/11/2025
Time: 14:35:21
```

---

## ตัวอย่าง 4: แสดงเวลาบน LCD (เสถียร)

### ปัญหา

ถ้าใช้ `lcd.clear()` ทุกครั้ง → จอกะพริบ

### วิธีแก้

อัปเดตเฉพาะส่วนที่เปลี่ยน

### โค้ด

```cpp
#include <WiFi.h>
#include <time.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_PASSWORD";
const char* ntpServer = "time.navy.mi.th";
const long gmtOffset_sec = 7 * 3600;
const int daylightOffset_sec = 0;

void setup() {
  Serial.begin(115200);
  
  lcd.init();
  lcd.backlight();
  
  lcd.setCursor(0, 0);
  lcd.print("Connecting...");
  
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  
  lcd.clear();
  lcd.print("WiFi OK!");
  delay(1000);
  
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  delay(2000);
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Date:");
  lcd.setCursor(0, 1);
  lcd.print("Time:");
}

void loop() {
  struct tm timeinfo;
  
  if(!getLocalTime(&timeinfo)) {
    return;
  }
  
  // แสดงวันที่ (อัปเดตเฉพาะตัวเลข)
  lcd.setCursor(6, 0);
  if(timeinfo.tm_mday < 10) lcd.print("0");
  lcd.print(timeinfo.tm_mday);
  lcd.print("/");
  if(timeinfo.tm_mon + 1 < 10) lcd.print("0");
  lcd.print(timeinfo.tm_mon + 1);
  
  // แสดงเวลา (อัปเดตเฉพาะตัวเลข)
  lcd.setCursor(6, 1);
  if(timeinfo.tm_hour < 10) lcd.print("0");
  lcd.print(timeinfo.tm_hour);
  lcd.print(":");
  if(timeinfo.tm_min < 10) lcd.print("0");
  lcd.print(timeinfo.tm_min);
  lcd.print(":");
  if(timeinfo.tm_sec < 10) lcd.print("0");
  lcd.print(timeinfo.tm_sec);
  
  delay(1000);
}
```

### ผลลัพธ์

```
┌────────────────┐
│Date: 08/11     │
│Time: 14:35:20  │
└────────────────┘
```

**✨ ไม่กะพริบ!** เพราะอัปเดตเฉพาะตัวเลข

---

## สรุป

| หัวข้อ | รายละเอียด |
|--------|-----------|
| **WiFi.scanNetworks()** | สแกนหา WiFi |
| **WiFi.begin()** | เชื่อมต่อ WiFi |
| **configTime()** | ตั้งค่า NTP |
| **getLocalTime()** | ดึงเวลาปัจจุบัน |
| **Trick แสดงเวลา** | อัปเดตเฉพาะตัวเลข (ไม่ใช้ clear) |

---

## 📚 เนื้อหาบทถัดไป

ในบทถัดไป เราจะเรียนรู้:
- 📊 ส่งข้อมูลขึ้น Google Sheets
- 🕒 บันทึกเวลา (Timestamp)
- 📈 เอาข้อมูลไปวิเคราะห์ต่อ
- 🔗 ใช้ Google Apps Script

[→ ไปบทที่ 16: Google Sheets Integration](16-google-sheets.md)
