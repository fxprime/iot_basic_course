# บทที่ 14: Google Sheets Integration (บันทึกข้อมูลลง Cloud)

## วัตถุประสงค์
- ส่งข้อมูลจาก ESP32 ไปยัง Google Sheets
- บันทึก Timestamp (เวลา)
- เก็บข้อมูลเพื่อวิเคราะห์
- ใช้ Google Apps Script เป็น API

---

## อุปกรณ์ที่ใช้
- ESP32 Development Board
- Sensor (Potentiometer, Ultrasonic, ฯลฯ)
- บัญชี Google (Gmail)

---

## ขั้นตอนที่ 1: สร้าง Google Sheet

1. เข้า [https://sheets.google.com](https://sheets.google.com)
2. คลิก **Blank** สร้าง Sheet ใหม่
3. ตั้งชื่อ: **"ESP32_Data"**
4. สร้างหัวตาราง (แถวที่ 1):
   - A1: `Timestamp`
   - B1: `Sensor`
   - C1: `Value`

---

## ขั้นตอนที่ 2: สร้าง Google Apps Script

1. ใน Google Sheet คลิก **Extensions → Apps Script**
2. ลบโค้ดเดิม แล้ววางโค้ดนี้:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // รับข้อมูลจาก ESP32
  var timestamp = e.parameter.timestamp;
  var sensor = e.parameter.sensor;
  var value = e.parameter.value;
  
  // เพิ่มข้อมูลลงในแถวใหม่
  sheet.appendRow([timestamp, sensor, value]);
  
  // ตอบกลับ
  return ContentService.createTextOutput("Success");
}
```

3. คลิก **Save** (💾)
4. คลิก **Deploy → New deployment**
5. เลือก **Web app**
6. ตั้งค่า:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. คลิก **Deploy**
8. **คัดลอก URL** (เช่น `https://script.google.com/...`)

---

## ขั้นตอนที่ 3: โค้ด ESP32

### ติดตั้ง Library

1. **Sketch → Include Library → Manage Libraries**
2. ค้นหา **"HTTPClient"** (มีอยู่แล้วใน ESP32)

### โค้ด

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_PASSWORD";

// Google Apps Script URL (จากขั้นตอนที่ 2)
const char* scriptURL = "https://script.google.com/macros/s/.../exec";

const char* ntpServer = "time.navy.mi.th";
const long gmtOffset_sec = 7 * 3600;
const int daylightOffset_sec = 0;

const int POT_PIN = 34;

void setup() {
  Serial.begin(115200);
  
  // เชื่อมต่อ WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
  
  // ตั้งค่าเวลา
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  delay(2000);
}

void loop() {
  // อ่านค่า Sensor
  int potValue = analogRead(POT_PIN);
  
  // ดึงเวลาปัจจุบัน
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)) {
    Serial.println("Failed to get time");
    return;
  }
  
  // สร้าง Timestamp (DD/MM/YYYY HH:MM:SS)
  char timestamp[30];
  sprintf(timestamp, "%02d/%02d/%04d %02d:%02d:%02d",
          timeinfo.tm_mday,
          timeinfo.tm_mon + 1,
          timeinfo.tm_year + 1900,
          timeinfo.tm_hour,
          timeinfo.tm_min,
          timeinfo.tm_sec);
  
  // ส่งข้อมูลไป Google Sheets
  sendToGoogleSheets(timestamp, "Potentiometer", String(potValue));
  
  delay(10000);  // ส่งทุกๆ 10 วินาที
}

void sendToGoogleSheets(String timestamp, String sensor, String value) {
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // สร้าง URL พร้อมพารามิเตอร์
    String url = String(scriptURL) + "?timestamp=" + timestamp +
                 "&sensor=" + sensor + "&value=" + value;
    
    // แปลงช่องว่างเป็น %20
    url.replace(" ", "%20");
    
    Serial.print("Sending data: ");
    Serial.println(url);
    
    http.begin(url);
    int httpCode = http.GET();
    
    if(httpCode > 0) {
      String payload = http.getString();
      Serial.print("Response: ");
      Serial.println(payload);
    }
    else {
      Serial.print("Error: ");
      Serial.println(httpCode);
    }
    
    http.end();
  }
  else {
    Serial.println("WiFi not connected");
  }
}
```

---

## ผลลัพธ์ใน Google Sheets

```
| Timestamp           | Sensor        | Value |
|---------------------|---------------|-------|
| 08/11/2025 14:35:20 | Potentiometer | 2048  |
| 08/11/2025 14:35:30 | Potentiometer | 3120  |
| 08/11/2025 14:35:40 | Potentiometer | 1024  |
```

---

## ตัวอย่าง: ส่งหลาย Sensor

### โค้ด

```cpp
void loop() {
  int potValue = analogRead(POT_PIN);
  int distance = sonar.ping_cm();
  int irState = digitalRead(IR_PIN);
  
  struct tm timeinfo;
  getLocalTime(&timeinfo);
  
  char timestamp[30];
  sprintf(timestamp, "%02d/%02d/%04d %02d:%02d:%02d",
          timeinfo.tm_mday,
          timeinfo.tm_mon + 1,
          timeinfo.tm_year + 1900,
          timeinfo.tm_hour,
          timeinfo.tm_min,
          timeinfo.tm_sec);
  
  // ส่งข้อมูลแยกแต่ละ Sensor
  sendToGoogleSheets(timestamp, "Potentiometer", String(potValue));
  delay(1000);
  
  sendToGoogleSheets(timestamp, "Ultrasonic", String(distance));
  delay(1000);
  
  sendToGoogleSheets(timestamp, "IR_Sensor", String(irState));
  
  delay(10000);  // รอ 10 วินาทีก่อนอ่านครั้งถัดไป
}
```

---

## การวิเคราะห์ข้อมูล

### สร้างกราฟใน Google Sheets

1. เลือกข้อมูล (คอลัมน์ A, B, C)
2. **Insert → Chart**
3. เลือกประเภทกราฟ:
   - **Line Chart** - ดูแนวโน้มเมื่อเวลาผ่านไป
   - **Bar Chart** - เปรียบเทียบค่า
4. ปรับแต่ง Chart editor:
   - X-axis: Timestamp
   - Y-axis: Value

### ตัวอย่างการใช้งาน

1. **ตรวจสอบอุณหภูมิ** - บันทึกอุณหภูมิทุก 5 นาที
2. **วิเคราะห์การใช้ไฟฟ้า** - เก็บข้อมูลการเปิด-ปิดอุปกรณ์
3. **ติดตามการเข้า-ออก** - นับจำนวนคนที่เข้า-ออกจากห้อง
4. **แจ้งเตือน** - ถ้าค่าผิดปกติ → ส่ง Email แจ้งเตือน

---

## สรุป

| หัวข้อ | รายละเอียด |
|--------|-----------|
| **Google Apps Script** | สร้าง Web App รับข้อมูล |
| **doPost()** | ฟังก์ชันรับข้อมูลจาก HTTP POST |
| **HTTPClient** | ส่ง HTTP Request จาก ESP32 |
| **Timestamp** | บันทึกเวลาเพื่อวิเคราะห์ |
| **การวิเคราะห์** | สร้างกราฟและหาแนวโน้ม |

---

## 🎯 ความท้าทาย

### Challenge 1: Auto Alert

ถ้าค่า Sensor > 3000 → เพิ่มคอลัมน์ "Alert" ใน Google Sheet แสดง "⚠️ WARNING"

**Hint:** แก้ไข Apps Script ให้ตรวจสอบค่าก่อนเขียนลง Sheet

### Challenge 2: Data Logging with Button

เพิ่มปุ่ม → กดแล้วส่งข้อมูลทันที (ไม่ต้องรอ 10 วินาที)

### Challenge 3: Multiple Sheets

สร้าง Sheet แยกตาม Sensor (Sheet1: Potentiometer, Sheet2: Ultrasonic)

**Hint:** เพิ่มพารามิเตอร์ `sheet` ใน URL

---

## ❓ คำถามท้ายบท

1. Google Apps Script คืออะไร?
2. ทำไมต้องบันทึก Timestamp?
3. HTTPClient ใช้สำหรับอะไร?
4. การส่งข้อมูลบ่อยเกินไปมีปัญหาอะไร?
5. นอกจาก Google Sheets แล้ว ยังมีบริการอะไรรับข้อมูลจาก ESP32 ได้บ้าง?

---

## 🎓 จบหลักสูตร

**🎉 ยินดีด้วย!** คุณได้เรียนรู้:
- ✅ การเขียนโปรแกรม ESP32
- ✅ Digital และ Analog Input/Output
- ✅ เซนเซอร์ (Ultrasonic, IR, Potentiometer)
- ✅ Actuator (Servo, Relay, LED)
- ✅ LCD Display
- ✅ WiFi และ Internet
- ✅ Cloud Integration (Google Sheets)

**ต่อไปคุณสามารถ:**
- สร้างโปรเจค IoT ของตัวเอง
- เชื่อมต่อกับ Cloud Platform (AWS, Azure, Firebase)
- ศึกษา MQTT, WebSocket, HTTP API
- พัฒนาแอปมือถือควบคุม ESP32

**Happy Coding! 🚀**
