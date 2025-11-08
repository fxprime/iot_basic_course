# บทที่ 10: โปรเจค Parking Gate (ไม้กั้นรถ)

## วัตถุประสงค์
- บูรณาการความรู้จากบทที่ผ่านมา
- ใช้ Ultrasonic, IR Sensor, และ Servo ร่วมกัน
- ฝึกเขียนเงื่อนไขและควบคุม Logic
- พัฒนาทักษะการแก้ปัญหา

---

## อุปกรณ์ที่ใช้
- ESP32 Development Board
- HC-SR04 Ultrasonic Sensor
- IR Sensor (Infrared Obstacle Detection)
- Servo Motor SG90
- LED 2 ดวง (แดง, เขียว)
- ตัวต้านทาน 470Ω x2
- สายจัมเปอร์

---

## ทฤษฎี: ประตูโรงจอดรถอัตโนมัติ

### การทำงาน

```
                 ประตู (Servo)
                     │
    ┌────────────────┴────────────────┐
    │      🚗  → →                    │
    │   [Ultrasonic]         [IR]     │
    └─────────────────────────────────┘
         ด้านนอก          ด้านใน
```

**Logic:**
1. **รถเข้า:**
   - Ultrasonic ตรวจจับรถด้านนอก (ใกล้กว่า 20cm)
   - เปิดประตู (Servo 90°)
   - รอจน IR ตรวจจับรถเข้าด้านใน
   - ปิดประตูอัตโนมัติ

2. **สถานะ:**
   - LED เขียว = ประตูเปิด (รถสามารถเข้าได้)
   - LED แดง = ประตูปิด (รถไม่สามารถเข้าได้)

---

## IR Sensor คืออะไร?

### Infrared Obstacle Detection Sensor

**IR Sensor** = เซนเซอร์ตรวจจับวัตถุด้วยแสง Infrared

```
     IR Sensor Module
    ┌─────────────┐
    │ LED  Photo  │
    │ ●●    ●●    │
    └─────────────┘
     TX    RX
     ส่ง   รับ
```

**หลักการทำงาน:**
1. LED IR ส่งแสง Infrared ออกไป
2. แสงสะท้อนกลับเมื่อชนวัตถุ
3. Photo Diode รับแสงสะท้อน
4. Output เป็น **Digital** (HIGH/LOW)

**การต่อ:**
- **VCC** → 3.3V หรือ 5V
- **GND** → GND
- **OUT** → GPIO (Digital Input)

**Output:**
- **LOW (0)** = มีวัตถุ (ตรวจจับได้)
- **HIGH (1)** = ไม่มีวัตถุ

**ปรับระยะ:** บิดสกรูปรับระยะตรวจจับ (3-80cm)

---

## การต่อวงจร

```
ESP32              HC-SR04
GPIO 5  ────────── TRIG
GPIO 18 ────────── ECHO
5V ────────────── VCC
GND ────────────── GND

ESP32              IR Sensor
GPIO 32 ────────── OUT
5V ────────────── VCC
GND ────────────── GND

ESP32              Servo
GPIO 25 ────────── Signal
5V ────────────── VCC
GND ────────────── GND

ESP32              LED
GPIO 26 ────┬───── LED แดง (+)
            │
           470Ω
            │
           GND

GPIO 27 ────┬───── LED เขียว (+)
            │
           470Ω
            │
           GND
```

---

## โค้ดตัวอย่าง (ฉบับเต็ม - สำหรับผู้สอน)

```cpp
#include <NewPing.h>

// === Pin Definitions ===
const int TRIG_PIN = 5;
const int ECHO_PIN = 18;
const int IR_PIN = 32;
const int SERVO_PIN = 25;
const int LED_RED = 26;
const int LED_GREEN = 27;

const int MAX_DISTANCE = 400;
const int DETECT_DISTANCE = 20;  // เปิดประตูเมื่อใกล้กว่า 20cm

const int PWM_CHANNEL = 0;

NewPing sonar(TRIG_PIN, ECHO_PIN, MAX_DISTANCE);

bool gateOpen = false;

void setup() {
  Serial.begin(115200);
  
  // Setup pins
  pinMode(IR_PIN, INPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  
  // Setup servo
  ledcSetup(PWM_CHANNEL, 50, 16);
  ledcAttachPin(SERVO_PIN, PWM_CHANNEL);
  
  // Initial state
  closeGate();
  
  Serial.println("🚗 Automatic Parking Gate System");
  Serial.println("Ready...");
}

void loop() {
  // 1. อ่านค่า Ultrasonic (ด้านนอก)
  int distance = sonar.ping_cm();
  
  // 2. อ่านค่า IR (ด้านใน)
  int irState = digitalRead(IR_PIN);
  bool carInside = (irState == LOW);  // LOW = มีรถ
  
  // 3. Logic การทำงาน
  if(distance > 0 && distance < DETECT_DISTANCE && !gateOpen) {
    // รถมาหน้าประตู → เปิดประตู
    Serial.println("🚗 Car detected outside!");
    openGate();
  }
  
  if(gateOpen && carInside) {
    // รถเข้าแล้ว → ปิดประตู
    Serial.println("✅ Car entered. Closing gate...");
    delay(1000);  // รอให้รถผ่านพ้น IR
    closeGate();
  }
  
  // 4. แสดงสถานะ
  if(!gateOpen) {
    if(distance > 0) {
      Serial.print("Distance: ");
      Serial.print(distance);
      Serial.println(" cm");
    }
  }
  
  delay(200);
}

void openGate() {
  Serial.println("🔓 Opening gate...");
  
  for(int angle = 0; angle <= 90; angle += 3) {
    servoWrite(angle);
    delay(15);
  }
  
  gateOpen = true;
  digitalWrite(LED_RED, LOW);
  digitalWrite(LED_GREEN, HIGH);
  
  Serial.println("✅ Gate OPEN");
}

void closeGate() {
  Serial.println("🔒 Closing gate...");
  
  for(int angle = 90; angle >= 0; angle -= 3) {
    servoWrite(angle);
    delay(15);
  }
  
  gateOpen = false;
  digitalWrite(LED_RED, HIGH);
  digitalWrite(LED_GREEN, LOW);
  
  Serial.println("✅ Gate CLOSED");
}

void servoWrite(int angle) {
  if(angle < 0) angle = 0;
  if(angle > 180) angle = 180;
  
  int pulseWidth = map(angle, 0, 180, 500, 2500);
  int duty = (pulseWidth * 65536) / 20000;
  
  ledcWrite(PWM_CHANNEL, duty);
}
```

---

## โค้ดแบบฝึกหัด (สำหรับนักเรียน) 📝

### ส่วนที่ 1: Template พร้อมฟังก์ชัน

ครูเตรียมฟังก์ชันไว้ให้ นักเรียนเติม **Logic ใน loop()** เท่านั้น

```cpp
#include <NewPing.h>

// === Pin Definitions ===
const int TRIG_PIN = 5;
const int ECHO_PIN = 18;
const int IR_PIN = 32;
const int SERVO_PIN = 25;
const int LED_RED = 26;
const int LED_GREEN = 27;

const int MAX_DISTANCE = 400;
const int DETECT_DISTANCE = 20;  // เปิดประตูเมื่อใกล้กว่า 20cm

const int PWM_CHANNEL = 0;

NewPing sonar(TRIG_PIN, ECHO_PIN, MAX_DISTANCE);

bool gateOpen = false;

// === ฟังก์ชันที่เตรียมไว้ให้ ===

// อ่านระยะทางจาก Ultrasonic (cm)
int getDistance() {
  return sonar.ping_cm();
}

// ตรวจสอบว่ามีรถด้านในหรือไม่
bool isCarInside() {
  int irState = digitalRead(IR_PIN);
  return (irState == LOW);  // LOW = มีรถ
}

// เปิดประตู
void openGate() {
  Serial.println("🔓 Opening gate...");
  
  for(int angle = 0; angle <= 90; angle += 3) {
    servoWrite(angle);
    delay(15);
  }
  
  gateOpen = true;
  digitalWrite(LED_RED, LOW);
  digitalWrite(LED_GREEN, HIGH);
  
  Serial.println("✅ Gate OPEN");
}

// ปิดประตู
void closeGate() {
  Serial.println("🔒 Closing gate...");
  
  for(int angle = 90; angle >= 0; angle -= 3) {
    servoWrite(angle);
    delay(15);
  }
  
  gateOpen = false;
  digitalWrite(LED_RED, HIGH);
  digitalWrite(LED_GREEN, LOW);
  
  Serial.println("✅ Gate CLOSED");
}

// ควบคุม Servo
void servoWrite(int angle) {
  if(angle < 0) angle = 0;
  if(angle > 180) angle = 180;
  
  int pulseWidth = map(angle, 0, 180, 500, 2500);
  int duty = (pulseWidth * 65536) / 20000;
  
  ledcWrite(PWM_CHANNEL, duty);
}

void setup() {
  Serial.begin(115200);
  
  pinMode(IR_PIN, INPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  
  ledcSetup(PWM_CHANNEL, 50, 16);
  ledcAttachPin(SERVO_PIN, PWM_CHANNEL);
  
  closeGate();
  
  Serial.println("🚗 Automatic Parking Gate");
  Serial.println("Ready...");
}

void loop() {
  // ============================================
  // 🎯 TODO: นักเรียนเขียน Logic ที่นี่
  // ============================================
  
  // 1. อ่านระยะทางจาก Ultrasonic
  int distance = getDistance();
  
  // 2. ตรวจสอบว่ามีรถด้านในหรือไม่
  bool carInside = isCarInside();
  
  // 3. เงื่อนไข: ถ้ารถมาหน้าประตู (ใกล้กว่า 20cm) และประตูยังปิดอยู่
  //    → เรียกฟังก์ชัน openGate()
  
  // TODO: เขียนเงื่อนไขที่นี่
  
  
  
  
  // 4. เงื่อนไข: ถ้าประตูเปิดอยู่ และมีรถเข้าด้านใน
  //    → รอ 1 วินาที แล้วเรียกฟังก์ชัน closeGate()
  
  // TODO: เขียนเงื่อนไขที่นี่
  
  
  
  
  // ============================================
  
  delay(200);
}
```

---

## คำแนะนำสำหรับนักเรียน 📚

### ขั้นตอนการทำงาน

**ขั้นตอนที่ 1:** อ่านค่าเซนเซอร์
```cpp
int distance = getDistance();
bool carInside = isCarInside();
```

**ขั้นตอนที่ 2:** เขียนเงื่อนไขเปิดประตู
```cpp
// ตรวจสอบ:
// - distance ใกล้กว่า DETECT_DISTANCE (20cm) หรือไม่?
// - gateOpen เป็น false (ประตูปิดอยู่) หรือไม่?
```

**ขั้นตอนที่ 3:** เขียนเงื่อนไขปิดประตู
```cpp
// ตรวจสอบ:
// - gateOpen เป็น true (ประตูเปิดอยู่) หรือไม่?
// - carInside เป็น true (มีรถเข้าด้านใน) หรือไม่?
```

---

## เฉลย (สำหรับนักเรียนที่ทำไม่ได้)

<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```cpp
void loop() {
  // 1. อ่านระยะทางจาก Ultrasonic
  int distance = getDistance();
  
  // 2. ตรวจสอบว่ามีรถด้านในหรือไม่
  bool carInside = isCarInside();
  
  // 3. เงื่อนไขเปิดประตู
  if(distance > 0 && distance < DETECT_DISTANCE && !gateOpen) {
    Serial.println("🚗 Car detected outside!");
    openGate();
  }
  
  // 4. เงื่อนไขปิดประตู
  if(gateOpen && carInside) {
    Serial.println("✅ Car entered. Closing gate...");
    delay(1000);  // รอให้รถผ่านพ้น IR
    closeGate();
  }
  
  delay(200);
}
```

</details>

---

## การทดสอบ

### ขั้นตอนการทดสอบ

1. **อัปโหลดโค้ด** ไปยัง ESP32
2. **เปิด Serial Monitor** (115200 baud)
3. **วางมือเข้าใกล้ Ultrasonic** (< 20cm)
   - ประตูควรเปิด
   - LED เขียวควรติด
4. **วางมือบัง IR Sensor**
   - หลังจาก 1 วินาที ประตูควรปิด
   - LED แดงควรติด
5. **ทดลองซ้ำหลายครั้ง**

### ผลลัพธ์ที่คาดหวัง

```
🚗 Automatic Parking Gate
Ready...
Distance: 45 cm
Distance: 30 cm
Distance: 15 cm
🚗 Car detected outside!
🔓 Opening gate...
✅ Gate OPEN
✅ Car entered. Closing gate...
🔒 Closing gate...
✅ Gate CLOSED
Distance: 50 cm
```

---

## ปรับปรุงโปรเจค (ขั้นสูง) 🚀

### ไอเดียเพิ่มเติม

1. **ปรับความเร็วประตู**
   - กดปุ่ม → ปรับความเร็วเปิด-ปิด

2. **นับจำนวนรถ**
   - เพิ่มตัวนับจำนวนรถที่เข้า-ออก

3. **หน่วงเวลาก่อนปิด**
   - ใช้ Potentiometer ปรับเวลารอก่อนปิด (1-10 วินาที)

4. **แจ้งเตือนเสียง**
   - เพิ่ม Buzzer เตือนเมื่อประตูกำลังปิด

5. **รีโมตควบคุม**
   - ใช้ปุ่ม IR Remote เปิด-ปิดแบบ Manual

---

## สรุป

| หัวข้อ | รายละเอียด |
|--------|-----------|
| **เซนเซอร์ที่ใช้** | Ultrasonic (ตรวจจับด้านนอก), IR (ตรวจจับด้านใน) |
| **Actuator** | Servo Motor (เปิด-ปิดประตู) |
| **Indicator** | LED แดง (ปิด), LED เขียว (เปิด) |
| **Logic** | เปิดเมื่อรถใกล้, ปิดเมื่อรถเข้าแล้ว |
| **ฟังก์ชันสำคัญ** | `openGate()`, `closeGate()`, `getDistance()`, `isCarInside()` |

---

## 🎯 ความท้าทาย

### Challenge 1: Two-Way Gate

เพิ่ม Ultrasonic อีก 1 ตัวด้านใน → รองรับการออกจากโรงจอดด้วย

### Challenge 2: Security PIN

เพิ่ม 4 ปุ่ม (0-3) → ต้องกดรหัส PIN ถูกต้อง (เช่น 1-2-3) ก่อนเปิดประตู

### Challenge 3: LCD Display

เพิ่มจอ LCD แสดง:
- สถานะประตู (OPEN/CLOSED)
- จำนวนรถในโรงจอด
- เวลาที่รถเข้า

---

## ❓ คำถามท้ายบท

1. IR Sensor ใช้หลักการอะไรในการตรวจจับวัตถุ?
2. ทำไม IR Sensor ถึงต้องปรับระยะด้วยสกรู?
3. ในโปรเจคนี้ มีการใช้เซนเซอร์กี่ตัว? แต่ละตัวทำหน้าที่อะไร?
4. ทำไมต้องมีตัวแปร `gateOpen` เก็บสถานะประตู?
5. ถ้าไม่มี `delay(1000)` หลังจาก IR ตรวจจับรถ จะเกิดอะไรขึ้น?

---

## 📚 เนื้อหาบทถัดไป

ในบทถัดไป เราจะเรียนรู้:
- 📟 LCD Display (จอแสดงผล 16x2)
- 📚 การใช้ LiquidCrystal_I2C Library
- 📝 แสดงข้อความและตัวเลข
- 🔄 อัปเดตข้อมูลแบบ Real-time

[→ ไปบทที่ 13: LCD Display และการแสดงผล](13-lcd-display.md)
