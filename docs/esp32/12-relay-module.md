# บทที่ 12: Relay Module และโปรเจครวม

## วัตถุประสงค์
- เข้าใจหลักการทำงานของ Relay
- ควบคุมอุปกรณ์ไฟฟ้า 220V อย่างปลอดภัย
- รวมโปรเจค: Relay + LCD + Potentiometer + Button

---

## อุปกรณ์ที่ใช้
- ESP32 Development Board
- Relay Module 1 Channel
- LCD 16x2 I2C
- Potentiometer 10kΩ
- ปุ่มกด
- หลอดไฟ 220V (สำหรับทดสอบ)

---

## ทฤษฎี: Relay คืออะไร?

**Relay** = สวิตช์ควบคุมด้วยแม่เหล็กไฟฟ้า สำหรับเปิด-ปิดวงจรไฟฟ้าแรงสูง

```
     Relay Module
    ┌─────────────┐
    │  VCC  IN   │
    │  GND  GND  │
    │            │
    │  COM NC NO │  ← ขาต่อ Load
    └─────────────┘
```

**ข้อดี:**
- ESP32 (3.3V) ควบคุมอุปกรณ์ 220V ได้
- แยกวงจรควบคุมกับวงจรไฟฟ้าหลัก
- ปลอดภัย

**การต่อ Load:**
- **COM** (Common) → ไฟเข้า
- **NO** (Normally Open) → ไฟออก (ใช้บ่อย)
- **NC** (Normally Closed) → ไฟออก (ปิดปกติ)

---

## ⚠️ ความปลอดภัย

**คำเตือน:**
- ⚡ 220V อันตราย! อาจถึงแก่ชีวิต
- ✋ ห้ามสัมผัสขา Relay ขณะเปิดไฟ
- 🔌 ถอดปลั๊กก่อนต่อสาย
- 👨‍🏫 ให้ครูตรวจสอบก่อนเปิดไฟ

---

## ตัวอย่าง 1: ควบคุม Relay ด้วยปุ่มกด

### วงจร

```
ESP32
GPIO 19 ────┬───╮
            │ SW│
           GND ╰─╯

GPIO 25 ───── IN (Relay)
5V     ───── VCC (Relay)
GND    ───── GND (Relay)

Relay
COM ───── ไฟเข้า 220V
NO  ───── หลอดไฟ (+)
        หลอดไฟ (-) ───── ไฟกลับ 220V
```

### โค้ด

```cpp
const int BUTTON_PIN = 19;
const int RELAY_PIN = 25;

int lastButtonState = HIGH;
bool relayState = false;

void setup() {
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);
  
  digitalWrite(RELAY_PIN, LOW);  // Relay OFF
  
  Serial.println("Relay Control");
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  if(buttonState == LOW && lastButtonState == HIGH) {
    delay(50);
    
    relayState = !relayState;
    digitalWrite(RELAY_PIN, relayState);
    
    Serial.print("Relay: ");
    Serial.println(relayState ? "ON" : "OFF");
  }
  
  lastButtonState = buttonState;
}
```

---

## โปรเจครวม: LCD + Potentiometer + Button + Relay

### เป้าหมาย

**โจทย์หลัก:** กดปุ่ม → แสดง "ON" บน LCD + Relay ทำงาน

**โจทย์ย่อย:**
- แสดงค่า Potentiometer
- ถ้าค่า Pot ≥ 500 → Relay ON เป็นเวลา 3 วินาที
- ถ้าค่า 500-700 → ON 5 วินาที
- ถ้าค่า > 900 → ON 6 วินาที

### Template สำหรับนักเรียน

```cpp
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int POT_PIN = 34;
const int BUTTON_PIN = 19;
const int RELAY_PIN = 25;

int lastButtonState = HIGH;

// ฟังก์ชันคำนวณเวลา ON
int calculateOnTime(int potValue) {
  // TODO: นักเรียนเขียนเงื่อนไข
  // ถ้า potValue >= 500 และ < 700 → return 3000 (3 วินาที)
  // ถ้า potValue >= 700 และ < 900 → return 5000 (5 วินาที)
  // ถ้า potValue >= 900 → return 6000 (6 วินาที)
  // ถ้าน้อยกว่า 500 → return 0 (ไม่เปิด)
  
  
  
  return 0;
}

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);
  
  lcd.init();
  lcd.backlight();
  
  digitalWrite(RELAY_PIN, LOW);
  
  lcd.setCursor(0, 0);
  lcd.print("Pot:");
  lcd.setCursor(0, 1);
  lcd.print("Status: OFF");
}

void loop() {
  int potValue = analogRead(POT_PIN);
  
  // แสดงค่า Pot
  lcd.setCursor(5, 0);
  lcd.print("     ");
  lcd.setCursor(5, 0);
  lcd.print(potValue);
  
  // ตรวจจับปุ่ม
  int buttonState = digitalRead(BUTTON_PIN);
  
  if(buttonState == LOW && lastButtonState == HIGH) {
    delay(50);
    
    int onTime = calculateOnTime(potValue);
    
    if(onTime > 0) {
      // แสดง ON
      lcd.setCursor(0, 1);
      lcd.print("Status: ON ");
      digitalWrite(RELAY_PIN, HIGH);
      
      delay(onTime);  // รอตามเวลาที่คำนวณ
      
      // แสดง OFF
      lcd.setCursor(0, 1);
      lcd.print("Status: OFF");
      digitalWrite(RELAY_PIN, LOW);
    }
  }
  
  lastButtonState = buttonState;
  delay(100);
}
```

<details>
<summary>เฉลย</summary>

```cpp
int calculateOnTime(int potValue) {
  if(potValue >= 900) {
    return 6000;  // 6 วินาที
  }
  else if(potValue >= 700) {
    return 5000;  // 5 วินาที
  }
  else if(potValue >= 500) {
    return 3000;  // 3 วินาที
  }
  else {
    return 0;  // ไม่เปิด
  }
}
```

</details>

---

## สรุป

| หัวข้อ | รายละเอียด |
|--------|-----------|
| **Relay** | สวิตช์ควบคุมด้วยแม่เหล็กไฟฟ้า |
| **ความปลอดภัย** | ⚡ ระวัง 220V! ให้ครูตรวจสอบ |
| **Active LOW** | บาง Relay เป็น LOW = ON |
| **การประยุกต์** | ควบคุมหลอดไฟ, พัดลม, ปั๊มน้ำ |

---

## 📚 เนื้อหาบทถัดไป

ในบทถัดไป เราจะเรียนรู้:
- 📡 WiFi - สแกนเครือข่าย
- 🌐 เชื่อมต่ออินเทอร์เน็ต
- ⏰ ดึงเวลาจาก NTP Server
- 📟 แสดงเวลาบน LCD

[→ ไปบทที่ 15: WiFi และ NTP Time](15-wifi-ntp.md)
