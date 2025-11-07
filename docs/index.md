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

### Module 2: Input/Output พื้นฐาน

#### [บทที่ 5: Button - การรับสัญญาณจากปุ่มกด](esp32/05-button.md)
เรียนรู้การใช้ปุ่มกดและการอ่าน Digital Input
- Pull-up และ Pull-down Resistor
- Edge Detection
- การใช้ `millis()` จับเวลา

#### [บทที่ 5.5: Analog Input - การอ่านค่าแบบต่อเนื่อง](esp32/05.5-analog-input.md)
เรียนรู้การอ่านสัญญาณ Analog ด้วย ADC
- ความแตกต่างระหว่าง Digital และ Analog
- Potentiometer - ปรับค่าแบบต่อเนื่อง
- IR Sensor - ตรวจจับวัตถุ/เส้น
- Passive Buzzer - สร้างเสียงตามค่า Analog

#### [บทที่ 6: LED - การควบคุมความสว่างและสี](esp32/06-led.md)
ควบคุม LED ขั้นสูงด้วย PWM
- PWM และการปรับความสว่าง
- RGB LED และการผสมสี
- เอฟเฟกต์แสงต่างๆ

#### [บทที่ 6.5: Servo Motor - ควบคุมมอเตอร์เซอร์โว](esp32/06.5-servo-motor.md)
เรียนรู้การควบคุม Servo Motor แบบ Manual PWM
- PWM Timing สำหรับ Servo (500-2500μs)
- Serial Command Control
- Multi-servo Coordination

#### [บทที่ 7: Timing - การจัดการเวลาและ Library](esp32/07-timing-basics.md)
เรียนรู้การจัดการเวลาและความสำคัญของ Library
- ความแตกต่างระหว่าง `delay()` และ `millis()`
- สร้างโปรแกรมที่ทำหลายอย่างพร้อมกัน
- โปรเจค: เกมส่งสัญญาณมอร์ส
- ทำความเข้าใจ Protocol และ Library

#### [บทที่ 7.5: LCD Display - จอแสดงผล 16x2](esp32/07.5-lcd-display.md)
แสดงข้อมูลด้วย LCD I2C
- LiquidCrystal_I2C Library
- Custom Characters
- Menu System และ Bar Graph

#### [บทที่ 7.6: HTU21D Sensor - วัดอุณหภูมิและความชื้น](esp32/07.6-htu21d-sensor.md)
เซนเซอร์วัดอุณหภูมิและความชื้น
- SparkFun HTU21D Library
- LCD Integration
- Alert System และ Data Logging

#### [บทที่ 7.7: Relay Module - ควบคุมอุปกรณ์ไฟฟ้า](esp32/07.7-relay-module.md)
ควบคุมอุปกรณ์ไฟฟ้าแรงดันสูง
- Relay Module 2CH
- Home Automation
- Safety Features

#### [🎯 โปรเจค: ระบบประตูจอดรถอัตโนมัติ](esp32/07.8-project-parking-gate.md)
โปรเจคประยุกต์ใช้ความรู้ทั้งหมด
- HC-SR04 Ultrasonic Distance Sensor
- State Machine Design
- Multi-sensor Coordination
- NewPing Library และ Internal Pull-up

### Module 3: การเขียนโค้ดขั้นสูง

#### [บทที่ 8: #define และ const - การใช้ค่าคงที่](esp32/08-define-const.md)
เรียนรู้การใช้ค่าคงที่เพื่อให้โค้ดอ่านง่ายและแก้ไขสะดวก
- ความแตกต่างระหว่าง `#define` และ `const`
- การตั้งชื่อค่าคงที่ที่มีความหมาย
- ปรับปรุงโค้ดให้อ่านง่าย

#### [บทที่ 9: Array และ Enum - จัดการข้อมูลหลายค่า](esp32/09-array-enum.md)
จัดการกับข้อมูลหลายๆ ค่าอย่างมีประสิทธิภาพ
- การใช้ Array เก็บข้อมูลหลายค่า
- การใช้ Enum ทำให้โค้ดอ่านง่าย
- การใช้ for loop กับ Array และ Enum

#### [บทที่ 10: การแยกไฟล์ Header - จัดระเบียบโปรเจค](esp32/10-header-files.md)
จัดระเบียบโค้ดให้เป็นระบบและใช้งานซ้ำได้
- การแยกไฟล์ .h และ .cpp
- Header Guards (#ifndef #define #endif)
- การสร้าง library ของตัวเอง

#### [บทที่ 11: Class เบื้องต้น - Object-Oriented Programming](esp32/11-class-basics.md)
เรียนรู้การเขียนโปรแกรมเชิงวัตถุ (OOP) พื้นฐาน
- เข้าใจแนวคิด Class และ Object
- เปรียบเทียบ Class กับตัวแปรธรรมดา
- สร้าง Class สำหรับ LED และ Button
- Encapsulation และการซ่อนข้อมูล

---

## 🎯 ความคืบหน้าของหลักสูตร

### เนื้อหาที่พร้อมใช้แล้ว ✅

**Module 1: เริ่มต้นกับ ESP32**
- ✅ บทที่ 1: Download IDE
- ✅ บทที่ 2: Setup ESP32
- ✅ บทที่ 3: First Program
- ✅ บทที่ 4: Serial Monitor

**Module 2: Input/Output พื้นฐาน**
- ✅ บทที่ 5: Button (Digital Input)
- ✅ บทที่ 5.5: Analog Input (Potentiometer, IR Sensor, Passive Buzzer)
- ✅ บทที่ 6: LED (PWM, RGB)
- ✅ บทที่ 6.5: Servo Motor (Manual PWM)
- ✅ บทที่ 7: Timing และ Library (Morse Code Game)
- ✅ บทที่ 7.5: LCD Display (16x2 I2C)
- ✅ บทที่ 7.6: HTU21D Sensor (Temperature/Humidity)
- ✅ บทที่ 7.7: Relay Module (2CH)
- ✅ 🎯 โปรเจค: ระบบประตูจอดรถอัตโนมัติ (HC-SR04 + State Machine)

**Module 3: การเขียนโค้ดขั้นสูง**
- ✅ บทที่ 8: #define และ const
- ✅ บทที่ 9: Array และ Enum (Button Dash Game)
- ✅ บทที่ 10: การแยกไฟล์ Header
- ✅ บทที่ 11: Class เบื้องต้น (OOP)

### เนื้อหาที่กำลังพัฒนา 🚧
- 🚧 Module 4: Network & Communication
- 🚧 WiFi Basics
- 🚧 Web Server

### เนื้อหาที่วางแผนไว้ 📋

#### Module 4: Network & Communication
- [ ] WiFi Connection และ Web Server
- [ ] HTTP Client และ API Integration
- [ ] MQTT Protocol
- [ ] WebSocket Real-time Communication
- [ ] NTP Time Synchronization
- [ ] Google Sheets Integration

#### Module 5: Advanced Projects
- [ ] IoT Dashboard with Chart.js
- [ ] Multi-player Game (TCP/IP)
- [ ] Smart Home Control System
- [ ] Weather Station with Cloud Logging

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

