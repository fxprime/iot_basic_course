# IoT Basic Course

ยินดีต้อนรับสู่หลักสูตร IoT Basic!

ในหลักสูตรนี้ คุณจะได้เรียนรู้พื้นฐานของการพัฒนา Internet of Things (IoT) โดยใช้บอร์ด ESP32 ซึ่งเป็นแพลตฟอร์มที่ได้รับความนิยมอย่างมากในชุมชน IoT ผ่านการเขียนโปรแกรมและการเชื่อมต่ออุปกรณ์ต่าง ๆ คุณจะได้เรียนรู้วิธีการสร้างโครงการ IoT ที่สามารถสื่อสารและทำงานร่วมกับอุปกรณ์อื่น ๆ ได้

โดยหลักสูตรนี้จะเน้นในการเรียนรู้ผ่านการปฏิบัติจริง คุณจะได้ลงมือเขียนโค้ดและทดลองใช้งานอุปกรณ์ต่าง ๆ เพื่อเสริมสร้างความเข้าใจและทักษะในการพัฒนา IoT

---

## 📚 เนื้อหาหลักสูตร

### Module 1: เริ่มต้นกับ ESP32

#### [บทที่ 1: ดาวน์โหลดและติดตั้ง Arduino IDE](esp32/01-download-ide.md)
เริ่มต้นด้วยการติดตั้งเครื่องมือที่จำเป็นสำหรับการพัฒนา ESP32
- ดาวน์โหลด Arduino IDE
- ติดตั้งบน Windows, macOS, และ Linux
- รู้จักส่วนประกอบของ Arduino IDE

#### [บทที่ 2: ติดตั้ง ESP32 Board](esp32/02-setup-esp32.md)
เตรียม ESP32 ให้พร้อมใช้งาน
- เพิ่ม ESP32 Board Manager
- ติดตั้ง USB Driver
- ทดสอบการเชื่อมต่อ

#### [บทที่ 3: โปรแกรมแรก](esp32/03-first-program.md)
เรียนรู้โครงสร้างโปรแกรม Arduino และเขียนโปรแกรมแรก
- โครงสร้าง `setup()` และ `loop()`
- การใช้ Serial Monitor
- ตัวแปรและประเภทข้อมูล

#### [บทที่ 4: Serial Monitor - การสื่อสารสองทาง](esp32/04-serial-monitor.md)
สร้างโปรแกรมที่โต้ตอบได้
- รับข้อมูลจาก Serial Monitor
- ประมวลผล String
- สร้าง Menu System

### Module 2: Input/Output และโปรเจคประยุกต์ (⭐ ปรับปรุงใหม่)

#### [บทที่ 5: Floating Input - ทำไม Input ถึงไม่เสถียร](esp32/05-floating-input.md)
เข้าใจปัญหาของสัญญาณที่ลอย
- Floating Input คืออะไร
- ทดลองด้วยการแตะนิ้ว
- Serial Plotter สำหรับดูพฤติกรรม

#### [บทที่ 6: Pull-up/Pull-down และ Button Bounce](esp32/06-button-pullup.md)
เรียนรู้การต่อปุ่มกดอย่างถูกต้อง
- Pull-up vs Pull-down Resistor
- Internal Pull-up (ไม่ต้องใช้ตัวต้านทานภายนอก)
- Button Bounce และการสังเกตบน Serial Plotter

#### [บทที่ 7: Debouncing - แก้ปัญหา Button Bounce](esp32/07-debouncing.md)
แก้ปัญหา Button Bounce ด้วย Software
- Debouncing ด้วย delay()
- Debouncing ด้วย millis() (Non-blocking)
- Long Press Detection

#### [บทที่ 8: PWM และการควบคุมความสว่าง LED](esp32/08-pwm-led.md)
ควบคุมความสว่าง LED ด้วย PWM
- PWM และ Duty Cycle
- ledcWrite() function
- ควบคุมความสว่างตามระยะเวลาที่กดปุ่ม

#### [บทที่ 9: Servo Motor และการควบคุมมุม](esp32/09-servo-motor.md)
ควบคุม Servo Motor ด้วย ledcWrite()
- PWM สำหรับ Servo (50Hz, 500-2500μs)
- ควบคุมด้วยปุ่มกด
- โปรเจค: ระบบล็อคอย่างง่าย

#### [บทที่ 10: Ultrasonic Sensor และถังขยะอัตโนมัติ](esp32/10-ultrasonic-sensor.md)
วัดระยะทางด้วย Ultrasonic (HC-SR04)
- NewPing Library
- โปรเจค: ถังขยะอัตโนมัติ (Ultrasonic + Servo)

#### [บทที่ 11: Analog Input และตู้ให้อาหารปลา](esp32/11-analog-input.md)
อ่านค่า Analog ด้วย ADC
- Potentiometer ควบคุม Servo
- โปรเจค: ตู้ให้อาหารปลา (ควบคุมปริมาณด้วย Potentiometer)

#### [🎯 บทที่ 12: โปรเจคประตูโรงจอดรถอัตโนมัติ](esp32/12-parking-gate-project.md)
โปรเจคฝึกหัดสำหรับนักเรียน
- Template พร้อมฟังก์ชัน
- ให้นักเรียนเติม Logic เอง
- Ultrasonic + IR Sensor + Servo

#### [บทที่ 13: LCD Display และการแสดงผล](esp32/13-lcd-display.md)
แสดงข้อมูลบนจอ LCD 16x2 I2C
- Hello World (Run ครั้งเดียว)
- แสดงค่า Potentiometer
- แก้ปัญหาตัวอักษรค้าง
- แสดงสถานะปุ่มกด (YES/NO)

#### [บทที่ 14: Relay Module และโปรเจครวม](esp32/14-relay-module.md)
ควบคุมอุปกรณ์ไฟฟ้า 220V
- Relay Module 1 Channel
- โปรเจครวม: Relay + LCD + Potentiometer + Button
- โจทย์: ควบคุม Relay ตามค่า Potentiometer

#### [บทที่ 15: WiFi และ NTP Time](esp32/15-wifi-ntp.md)
เชื่อมต่ออินเทอร์เน็ตและดึงเวลา
- WiFi Scan และ Connect
- ดึงเวลาจาก NTP Server
- แสดงเวลาบน LCD แบบเสถียร (ไม่กะพริบ)

#### [บทที่ 16: Google Sheets Integration](esp32/16-google-sheets.md)
ส่งข้อมูลขึ้น Cloud
- Google Apps Script
- บันทึก Timestamp
- เก็บข้อมูลเพื่อวิเคราะห์

---

## 🎯 ความคืบหน้าของหลักสูตร

### เนื้อหาที่พร้อมใช้แล้ว ✅

**Module 1: เริ่มต้นกับ ESP32** (4 บท)
- ✅ บทที่ 1: Download IDE
- ✅ บทที่ 2: Setup ESP32
- ✅ บทที่ 3: First Program
- ✅ บทที่ 4: Serial Monitor

**Module 2: Input/Output และโปรเจคประยุกต์** (12 บท - ⭐ ปรับปรุงใหม่สำหรับการสอนพรุ่งนี้)
- ✅ บทที่ 5: Floating Input (ทดลองแตะนิ้ว, Serial Plotter)
- ✅ บทที่ 6: Pull-up/Pull-down (Internal Pull-up, Button Bounce)
- ✅ บทที่ 7: Debouncing (แก้ปัญหา Bounce)
- ✅ บทที่ 8: PWM LED (ledcWrite, ควบคุมตามเวลาที่กด)
- ✅ บทที่ 9: Servo Motor (ledcWrite, ระบบล็อค)
- ✅ บทที่ 10: Ultrasonic Sensor (NewPing Library, ถังขยะอัตโนมัติ)
- ✅ บทที่ 11: Analog Input (Potentiometer, ตู้ให้อาหารปลา)
- ✅ บทที่ 12: 🎯 โปรเจคประตูโรงจอดรถ (Template สำหรับนักเรียน)
- ✅ บทที่ 13: LCD Display (Hello World, แก้ปัญหาตัวอักษรค้าง)
- ✅ บทที่ 14: Relay Module (โปรเจครวม LCD + Potentiometer)
- ✅ บทที่ 15: WiFi และ NTP (แสดงเวลาแบบเสถียร)
- ✅ บทที่ 16: Google Sheets (บันทึก Timestamp, วิเคราะห์ข้อมูล)

**Archive: เนื้อหาเก่า** (สำหรับอ้างอิง)
- Module 3: การเขียนโค้ดขั้นสูง (#define, Array, Enum, Header Files, Class)

### สถิติหลักสูตร 📊

- ✅ **เนื้อหาหลัก:** 16 บท
- 🎯 **โปรเจคครบวงจร:** 4 โปรเจค (ถังขยะ, ให้อาหารปลา, ประตูโรงจอดรถ, โปรเจครวม)
- � **Library ที่ใช้:** NewPing, LiquidCrystal_I2C, WiFi, HTTPClient
- � **Hardware:** ESP32, Ultrasonic, IR, Servo, LCD, Relay, Potentiometer

### เนื้อหาที่วางแผนไว้ (อนาคต) 📋

#### Module 3: Advanced Topics (Optional)
- [ ] MQTT Protocol
- [ ] WebSocket Real-time
- [ ] IoT Dashboard
- [ ] Multi-player Network Game

---

## 🚀 เริ่มต้นเรียนกันเลย!

พร้อมแล้วใช่ไหม? เริ่มต้นจากบทแรกกันเลย!

➡️ **[เริ่มเรียน: บทที่ 1 - ดาวน์โหลดและติดตั้ง Arduino IDE](esp32/01-download-ide.md)**

---

## 💡 คำแนะนำสำหรับผู้เรียน

- **เรียนตามลำดับ** - แต่ละบทต่อเนื่องกัน ไม่ควรข้าม
- **ลงมือทำจริง** - อย่าแค่อ่าน ต้องพิมพ์โค้ดและ upload จริง
- **ทำแบบฝึกหัด** - แต่ละบทมีแบบฝึกหัดให้ฝึกทักษะ
- **ใช้เวลา** - อย่าเร่งเกินไป ให้เวลาตัวเองเข้าใจ
- **ถามเมื่อสงสัย** - ไม่มีคำถามที่โง่

