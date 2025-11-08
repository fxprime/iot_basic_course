# บทที่ 10: Class เบื้องต้น

## วัตถุประสงค์
- เข้าใจแนวคิด Object-Oriented Programming (OOP)
- เปรียบเทียบ Class กับตัวแปรธรรมดา
- สร้าง Class สำหรับ LED และ Button
- เข้าใจ Encapsulation และการซ่อนข้อมูล

## ปัญหาของการใช้ฟังก์ชันธรรมดา

สมมติเราต้องการควบคุม LED 3 ดวง แบบแยกอิสระ:

```cpp
// LED 1
int led1_pin = 25;
int led1_brightness = 0;
bool led1_fading = false;

// LED 2
int led2_pin = 26;
int led2_brightness = 0;
bool led2_fading = false;

// LED 3
int led3_pin = 27;
int led3_brightness = 0;
bool led3_fading = false;

void setLED1(int brightness) {
  analogWrite(led1_pin, brightness);
  led1_brightness = brightness;
}

void setLED2(int brightness) {
  analogWrite(led2_pin, brightness);
  led2_brightness = brightness;
}

void setLED3(int brightness) {
  analogWrite(led3_pin, brightness);
  led3_brightness = brightness;
}

// ... ต้องเขียนซ้ำอีก 3 ชุด 😫
```

<details markdown="1">
<summary>😱 ปัญหาที่พบ</summary>

1. **โค้ดซ้ำซากมาก** - ทำแบบเดิมซ้ำไปเรื่อยๆ
2. **ตัวแปรกระจาย** - ไม่รู้ว่าตัวแปรไหนเป็นของ LED ไหน
3. **เพิ่ม LED ยาก** - ต้องสร้างตัวแปรและฟังก์ชันใหม่ทั้งชุด
4. **แก้ไขยาก** - แก้ 1 LED ต้องแก้ทั้ง 3 LED
5. **ข้อมูลไม่ปลอดภัย** - ใครก็แก้ได้ทุกตัวแปร

**ต่างกับ Array:**
- Array ใช้ได้กับข้อมูลหลายตัวที่ทำงาน**เหมือนกัน**
- แต่ถ้าแต่ละตัวมี**สถานะแยก** Array ไม่เหมาะ

</details>

---

## Class คืออะไร?

**Class** = **แม่พิมพ์** (blueprint) สำหรับสร้าง Object  
**Object** = **ตัวอย่างจริง** (instance) ที่สร้างจาก Class

### อุปมา: บ้านและแบบบ้าน

```
Class (แบบบ้าน)          Object (บ้านจริง)
┌─────────────┐          ┌─────────────┐
│ แบบบ้าน     │  create  │ บ้านหลัง 1   │
│             │  ────>   │ - ที่อยู่: ...│
│ ห้องนอน: 3  │          │ - เจ้าของ:... │
│ ห้องน้ำ: 2  │          └─────────────┘
│             │  create  ┌─────────────┐
│             │  ────>   │ บ้านหลัง 2   │
└─────────────┘          │ - ที่อยู่: ...│
                         └─────────────┘
```

**Class = แบบบ้าน** (มีแค่แปลน มีคนอยู่ไม่ได้)  
**Object = บ้านจริง** (สร้างจากแบบ มีคนอยู่ได้)

### ในโลกโปรแกรม

```cpp
// Class = แม่พิมพ์
class LED {
  // คุณสมบัติและฟังก์ชัน
};

// Object = ตัวจริง
LED led1(25);  // LED ตัวที่ 1 ที่ pin 25
LED led2(26);  // LED ตัวที่ 2 ที่ pin 26
LED led3(27);  // LED ตัวที่ 3 ที่ pin 27
```

**ข้อดี:**
- แต่ละ LED มีข้อมูลของตัวเอง (pin, brightness, state)
- ใช้ function เดียวกัน แต่ทำงานกับข้อมูลของตัวเอง
- เพิ่ม LED ใหม่ง่าย: แค่ `LED led4(32);`

---

## โครงสร้าง Class

### ไวยากรณ์

```cpp
class ชื่อClass {
private:
  // ตัวแปรและฟังก์ชันที่ซ่อนไว้ (ใช้ภายในเท่านั้น)
  
public:
  // ตัวแปรและฟังก์ชันที่เปิดให้ใช้ได้
};
```

### ส่วนประกอบ

**1. Member Variables (ตัวแปรสมาชิก)**
```cpp
class LED {
private:
  int pin;           // เก็บหมายเลข pin
  int brightness;    // เก็บความสว่าง
  bool isOn;         // เก็บสถานะ
};
```

**2. Constructor (ตัวสร้าง)**
```cpp
class LED {
public:
  LED(int ledPin) {  // รันตอนสร้าง object
    pin = ledPin;
    brightness = 0;
    isOn = false;
    pinMode(pin, OUTPUT);
  }
};
```

**3. Member Functions (ฟังก์ชันสมาชิก)**
```cpp
class LED {
public:
  void on() {
    digitalWrite(pin, HIGH);
    isOn = true;
  }
  
  void off() {
    digitalWrite(pin, LOW);
    isOn = false;
  }
};
```

---

## ตัวอย่างที่ 1: LED Class

### LED.h

```cpp
#ifndef LED_H
#define LED_H

#include <Arduino.h>

class LED {
private:
  int pin;
  int brightness;
  bool state;

public:
  // Constructor
  LED(int ledPin);
  
  // เปิด/ปิด
  void on();
  void off();
  void toggle();
  
  // ความสว่าง (PWM)
  void setBrightness(int value);
  void fade(int targetBrightness, int duration);
  
  // อ่านสถานะ
  bool isOn();
  int getBrightness();
};

#endif
```

### LED.cpp

```cpp
#include "LED.h"

// Constructor
LED::LED(int ledPin) {
  pin = ledPin;
  brightness = 0;
  state = false;
  pinMode(pin, OUTPUT);
  off();
}

void LED::on() {
  digitalWrite(pin, HIGH);
  brightness = 255;
  state = true;
}

void LED::off() {
  digitalWrite(pin, LOW);
  brightness = 0;
  state = false;
}

void LED::toggle() {
  if (state) {
    off();
  } else {
    on();
  }
}

void LED::setBrightness(int value) {
  // จำกัดค่า 0-255
  if (value < 0) value = 0;
  if (value > 255) value = 255;
  
  brightness = value;
  analogWrite(pin, brightness);
  state = (brightness > 0);
}

void LED::fade(int targetBrightness, int duration) {
  int steps = abs(targetBrightness - brightness);
  int delayTime = duration / steps;
  
  if (targetBrightness > brightness) {
    // ค่อยๆ สว่างขึ้น
    for (int i = brightness; i <= targetBrightness; i++) {
      setBrightness(i);
      delay(delayTime);
    }
  } else {
    // ค่อยๆ มืดลง
    for (int i = brightness; i >= targetBrightness; i--) {
      setBrightness(i);
      delay(delayTime);
    }
  }
}

bool LED::isOn() {
  return state;
}

int LED::getBrightness() {
  return brightness;
}
```

### การใช้งาน

```cpp
#include "LED.h"

// สร้าง LED 3 ตัว
LED redLED(25);
LED greenLED(26);
LED blueLED(27);

void setup() {
  Serial.begin(115200);
  Serial.println("LED System Ready!");
}

void loop() {
  // LED 1: เปิด-ปิด
  redLED.on();
  delay(1000);
  redLED.off();
  delay(1000);
  
  // LED 2: Fade in/out
  greenLED.fade(255, 1000);  // สว่างขึ้น 1 วินาที
  greenLED.fade(0, 1000);    // มืดลง 1 วินาที
  
  // LED 3: Toggle
  blueLED.toggle();
  delay(500);
}
```

<details markdown="1">
<summary>💡 ข้อดีของการใช้ Class</summary>

**1. แต่ละ LED เป็นอิสระ**
```cpp
LED led1(25);
LED led2(26);

led1.setBrightness(100);  // LED 1 สว่าง 100
led2.setBrightness(200);  // LED 2 สว่าง 200 (ไม่กระทบ LED 1)
```

**2. ข้อมูลถูกซ่อนไว้ (Encapsulation)**
```cpp
// ❌ ไม่สามารถแก้โดยตรง
led1.pin = 99;        // Error: private member

// ✅ ต้องใช้ function
led1.setBrightness(100);  // ปลอดภัย มีการตรวจสอบค่า
```

**3. เพิ่ม LED ง่ายมาก**
```cpp
LED led4(32);  // แค่บรรทัดเดียว!
LED led5(33);
// ใช้ function เดิมได้เลย
led4.fade(255, 1000);
led5.toggle();
```

**4. โค้ดอ่านง่าย**
```cpp
// แทนที่จะเขียน
analogWrite(25, 128);
// เขียน
redLED.setBrightness(128);  // ชัดเจนว่าเป็น LED สีแดง!
```

**5. แก้ไขง่าย**
```cpp
// ต้องการเพิ่ม validation
void LED::setBrightness(int value) {
  if (value < 0) value = 0;      // เพิ่มบรรทัดนี้
  if (value > 255) value = 255;  // เพิ่มบรรทัดนี้
  analogWrite(pin, value);
}
// ทุก LED ที่ใช้ class นี้ได้ประโยชน์ทันที!
```

</details>

---

## ตัวอย่างที่ 2: Button Class

### Button.h

```cpp
#ifndef BUTTON_H
#define BUTTON_H

#include <Arduino.h>

enum ButtonEvent {
  BUTTON_NONE,
  BUTTON_PRESSED,
  BUTTON_RELEASED,
  BUTTON_HELD,
  BUTTON_CLICKED
};

class Button {
private:
  int pin;
  int lastState;
  int currentState;
  unsigned long lastDebounceTime;
  unsigned long pressStartTime;
  unsigned long releaseTime;
  bool isHolding;
  bool wasClicked;
  
  // Configuration
  static const int DEBOUNCE_DELAY = 50;
  static const int HOLD_DURATION = 1000;
  static const int DOUBLE_CLICK_TIME = 300;

public:
  Button(int buttonPin);
  void begin();
  ButtonEvent update();
  bool isPressed();
  unsigned long getPressedDuration();
};

#endif
```

### Button.cpp

```cpp
#include "Button.h"

Button::Button(int buttonPin) {
  pin = buttonPin;
  lastState = HIGH;
  currentState = HIGH;
  lastDebounceTime = 0;
  pressStartTime = 0;
  releaseTime = 0;
  isHolding = false;
  wasClicked = false;
}

void Button::begin() {
  pinMode(pin, INPUT_PULLUP);
}

ButtonEvent Button::update() {
  int reading = digitalRead(pin);
  unsigned long currentTime = millis();
  
  // Debounce
  if (reading != lastState) {
    lastDebounceTime = currentTime;
  }
  
  if (currentTime - lastDebounceTime > DEBOUNCE_DELAY) {
    // สถานะเสถียรแล้ว
    if (reading != currentState) {
      currentState = reading;
      
      if (currentState == LOW) {
        // เพิ่งกด
        pressStartTime = currentTime;
        isHolding = false;
        wasClicked = false;
        lastState = reading;
        return BUTTON_PRESSED;
        
      } else {
        // เพิ่งปล่อย
        releaseTime = currentTime;
        isHolding = false;
        
        // ตรวจสอบว่าเป็น click หรือไม่
        unsigned long pressDuration = releaseTime - pressStartTime;
        if (pressDuration < HOLD_DURATION) {
          wasClicked = true;
          lastState = reading;
          return BUTTON_CLICKED;
        }
        
        lastState = reading;
        return BUTTON_RELEASED;
      }
    }
    
    // ตรวจสอบว่ากดค้างหรือไม่
    if (currentState == LOW && !isHolding) {
      if (currentTime - pressStartTime > HOLD_DURATION) {
        isHolding = true;
        lastState = reading;
        return BUTTON_HELD;
      }
    }
  }
  
  lastState = reading;
  return BUTTON_NONE;
}

bool Button::isPressed() {
  return (currentState == LOW);
}

unsigned long Button::getPressedDuration() {
  if (currentState == LOW) {
    return millis() - pressStartTime;
  }
  return 0;
}
```

### การใช้งาน

```cpp
#include "LED.h"
#include "Button.h"

// สร้าง objects
LED redLED(25);
LED greenLED(26);
Button button1(32);
Button button2(33);

void setup() {
  Serial.begin(115200);
  button1.begin();
  button2.begin();
  Serial.println("System Ready!");
}

void loop() {
  // อัพเดทปุ่ม
  ButtonEvent event1 = button1.update();
  ButtonEvent event2 = button2.update();
  
  // ปุ่ม 1 ควบคุม LED แดง
  switch (event1) {
    case BUTTON_PRESSED:
      Serial.println("Button 1: Pressed");
      redLED.on();
      break;
      
    case BUTTON_RELEASED:
      Serial.println("Button 1: Released");
      redLED.off();
      break;
      
    case BUTTON_HELD:
      Serial.println("Button 1: Held");
      redLED.fade(255, 500);
      break;
      
    case BUTTON_CLICKED:
      Serial.println("Button 1: Clicked");
      redLED.toggle();
      break;
  }
  
  // ปุ่ม 2 ควบคุม LED เขียว
  switch (event2) {
    case BUTTON_PRESSED:
      greenLED.setBrightness(128);
      break;
      
    case BUTTON_RELEASED:
      greenLED.off();
      break;
      
    case BUTTON_HELD:
      // ปรับความสว่างตามระยะเวลากด
      int duration = button2.getPressedDuration();
      int brightness = map(duration, 0, 3000, 0, 255);
      greenLED.setBrightness(brightness);
      break;
  }
}
```

---

## เปรียบเทียบ: Class vs ตัวแปรธรรมดา

### ตัวแปรธรรมดา (Primitive Types)

```cpp
int number = 42;
float temperature = 25.5;
bool isOn = true;
```

**คุณสมบัติ:**
- เก็บข้อมูลเดียว (single value)
- ไม่มี function ติดมา
- Copy ง่าย (copy by value)

**ตัวอย่าง:**
```cpp
int a = 10;
int b = a;  // copy ค่า
b = 20;     // a ยังเป็น 10
```

### Object (จาก Class)

```cpp
LED led(25);        // object มี pin, brightness, state
Button btn(32);     // object มี pin, lastState, timing, etc.
```

**คุณสมบัติ:**
- เก็บข้อมูลหลายค่า (multiple values)
- มี function ติดมา (methods)
- Copy ซับซ้อน (ควรใช้ pointer/reference)

**ตัวอย่าง:**
```cpp
LED led1(25);
LED led2 = led1;  // ⚠️ ควรระวัง!

led1.on();
// led2 จะเป็นอย่างไร? ขึ้นอยู่กับว่า class มี copy constructor หรือไม่
```

### ตารางเปรียบเทียบ

| หัวข้อ | Primitive Type | Object (Class) |
|--------|----------------|----------------|
| **ขนาดข้อมูล** | เล็ก (1-8 bytes) | ใหญ่ (depends) |
| **ความซับซ้อน** | เก็บค่าเดียว | เก็บหลายค่า + functions |
| **การสร้าง** | `int x = 10;` | `LED led(25);` |
| **การใช้งาน** | `x + 5` | `led.setBrightness(100)` |
| **Memory** | Stack | Stack/Heap |
| **การ Copy** | Copy value | ควรระวัง (shallow/deep copy) |

---

## 💻 แบบฝึกหัดที่ 1: RGB LED Class

### โจทย์

สร้าง Class `RGBLED` ที่:
- รับ pin ทั้ง 3 สี (R, G, B) ตอน constructor
- มี function `setColor(r, g, b)` ตั้งสี
- มี function สีสำเร็จรูป: `red()`, `green()`, `blue()`, `white()`, `off()`
- มี function `rainbow()` วนสีรุ้ง

<details markdown="1">
<summary>💡 Hint</summary>

```cpp
class RGBLED {
private:
  int redPin, greenPin, bluePin;
  int redChannel, greenChannel, blueChannel;
  
public:
  RGBLED(int r, int g, int b);
  void begin();
  void setColor(int r, int g, int b);
  void red();
  void green();
  void blue();
  // ...
};
```

</details>

<details markdown="1">
<summary>✅ เฉลย</summary>

**RGBLED.h**
```cpp
#ifndef RGBLED_H
#define RGBLED_H

#include <Arduino.h>

class RGBLED {
private:
  int redPin, greenPin, bluePin;
  int redChannel, greenChannel, blueChannel;
  
  static const int PWM_FREQ = 5000;
  static const int PWM_RESOLUTION = 8;
  static int channelCounter;  // นับ channel อัตโนมัติ

public:
  RGBLED(int r, int g, int b);
  void begin();
  
  // สีพื้นฐาน
  void setColor(int r, int g, int b);
  void red();
  void green();
  void blue();
  void yellow();
  void cyan();
  void magenta();
  void white();
  void off();
  
  // Effects
  void rainbow(int duration);
  void fade(int r, int g, int b, int duration);
};

#endif
```

**RGBLED.cpp**
```cpp
#include "RGBLED.h"

// Static variable สำหรับนับ channel
int RGBLED::channelCounter = 0;

RGBLED::RGBLED(int r, int g, int b) {
  redPin = r;
  greenPin = g;
  bluePin = b;
  
  // กำหนด channel อัตโนมัติ
  redChannel = channelCounter++;
  greenChannel = channelCounter++;
  blueChannel = channelCounter++;
}

void RGBLED::begin() {
  // ตั้งค่า PWM
  ledcSetup(redChannel, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(greenChannel, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(blueChannel, PWM_FREQ, PWM_RESOLUTION);
  
  // ผูก pin กับ channel
  ledcAttachPin(redPin, redChannel);
  ledcAttachPin(greenPin, greenChannel);
  ledcAttachPin(bluePin, blueChannel);
  
  off();
}

void RGBLED::setColor(int r, int g, int b) {
  ledcWrite(redChannel, r);
  ledcWrite(greenChannel, g);
  ledcWrite(blueChannel, b);
}

void RGBLED::red() { setColor(255, 0, 0); }
void RGBLED::green() { setColor(0, 255, 0); }
void RGBLED::blue() { setColor(0, 0, 255); }
void RGBLED::yellow() { setColor(255, 255, 0); }
void RGBLED::cyan() { setColor(0, 255, 255); }
void RGBLED::magenta() { setColor(255, 0, 255); }
void RGBLED::white() { setColor(255, 255, 255); }
void RGBLED::off() { setColor(0, 0, 0); }

void RGBLED::rainbow(int duration) {
  int delayTime = duration / 360;
  
  for (int hue = 0; hue < 360; hue++) {
    // แปลง HSV เป็น RGB
    float h = hue / 60.0;
    float x = (1 - abs(fmod(h, 2) - 1)) * 255;
    
    int r, g, b;
    if (h < 1) { r = 255; g = x; b = 0; }
    else if (h < 2) { r = x; g = 255; b = 0; }
    else if (h < 3) { r = 0; g = 255; b = x; }
    else if (h < 4) { r = 0; g = x; b = 255; }
    else if (h < 5) { r = x; g = 0; b = 255; }
    else { r = 255; g = 0; b = x; }
    
    setColor(r, g, b);
    delay(delayTime);
  }
}

void RGBLED::fade(int targetR, int targetG, int targetB, int duration) {
  // อ่านค่าปัจจุบัน (ต้องเก็บไว้ใน class)
  // สำหรับความเรียบง่าย ใช้ 100 steps
  int steps = 100;
  int delayTime = duration / steps;
  
  // คำนวณการเปลี่ยนแปลงต่อ step
  // (แบบง่าย ไม่เก็บค่าปัจจุบัน)
  for (int i = 0; i <= steps; i++) {
    int r = (targetR * i) / steps;
    int g = (targetG * i) / steps;
    int b = (targetB * i) / steps;
    setColor(r, g, b);
    delay(delayTime);
  }
}
```

**ตัวอย่างการใช้งาน**
```cpp
#include "RGBLED.h"

// สร้าง RGB LED 2 ตัว
RGBLED led1(25, 26, 27);
RGBLED led2(32, 33, 18);

void setup() {
  led1.begin();
  led2.begin();
}

void loop() {
  // LED 1: วนสีพื้นฐาน
  led1.red();
  delay(1000);
  led1.green();
  delay(1000);
  led1.blue();
  delay(1000);
  
  // LED 2: rainbow effect
  led2.rainbow(3000);
  
  // ทั้ง 2 ตัว fade เป็นสีม่วง
  led1.fade(255, 0, 255, 1000);
  led2.fade(255, 0, 255, 1000);
  delay(1000);
}
```

</details>

---

## 💻 แบบฝึกหัดที่ 2: Servo Motor Class

### โจทย์

สร้าง Class `ServoMotor` ที่:
- รับ pin ตอน constructor
- มี function `setAngle(angle)` หมุนไปมุม (0-180)
- มี function `sweep(start, end, speed)` กวาดไปมา
- มี function `getCurrentAngle()` คืนมุมปัจจุบัน

<details markdown="1">
<summary>💡 Hint</summary>

ใช้ `ESP32Servo` library:
```cpp
#include <ESP32Servo.h>

class ServoMotor {
private:
  int pin;
  int currentAngle;
  Servo servo;  // object ของ Servo
  
public:
  ServoMotor(int servoPin);
  // ...
};
```

</details>

<details markdown="1">
<summary>✅ เฉลย</summary>

**ServoMotor.h**
```cpp
#ifndef SERVOMOTOR_H
#define SERVOMOTOR_H

#include <Arduino.h>
#include <ESP32Servo.h>

class ServoMotor {
private:
  int pin;
  int currentAngle;
  Servo servo;
  
  static const int MIN_ANGLE = 0;
  static const int MAX_ANGLE = 180;
  static const int DEFAULT_SPEED = 50;  // ms per degree

public:
  ServoMotor(int servoPin);
  void begin();
  
  void setAngle(int angle);
  void setAngleSmooth(int angle, int speed = DEFAULT_SPEED);
  void sweep(int startAngle, int endAngle, int speed = DEFAULT_SPEED);
  void center();
  
  int getCurrentAngle();
};

#endif
```

**ServoMotor.cpp**
```cpp
#include "ServoMotor.h"

ServoMotor::ServoMotor(int servoPin) {
  pin = servoPin;
  currentAngle = 90;  // เริ่มที่กลาง
}

void ServoMotor::begin() {
  servo.attach(pin);
  setAngle(90);  // ตั้งไว้กลาง
}

void ServoMotor::setAngle(int angle) {
  // จำกัดค่า
  if (angle < MIN_ANGLE) angle = MIN_ANGLE;
  if (angle > MAX_ANGLE) angle = MAX_ANGLE;
  
  servo.write(angle);
  currentAngle = angle;
}

void ServoMotor::setAngleSmooth(int angle, int speed) {
  // จำกัดค่า
  if (angle < MIN_ANGLE) angle = MIN_ANGLE;
  if (angle > MAX_ANGLE) angle = MAX_ANGLE;
  
  // หมุนทีละองศา
  if (angle > currentAngle) {
    for (int i = currentAngle; i <= angle; i++) {
      servo.write(i);
      currentAngle = i;
      delay(speed);
    }
  } else {
    for (int i = currentAngle; i >= angle; i--) {
      servo.write(i);
      currentAngle = i;
      delay(speed);
    }
  }
}

void ServoMotor::sweep(int startAngle, int endAngle, int speed) {
  setAngleSmooth(startAngle, speed);
  delay(500);
  setAngleSmooth(endAngle, speed);
}

void ServoMotor::center() {
  setAngleSmooth(90, DEFAULT_SPEED);
}

int ServoMotor::getCurrentAngle() {
  return currentAngle;
}
```

**ตัวอย่างการใช้งาน**
```cpp
#include "ServoMotor.h"

ServoMotor servo1(13);
ServoMotor servo2(14);

void setup() {
  Serial.begin(115200);
  servo1.begin();
  servo2.begin();
}

void loop() {
  // Servo 1: กวาด 0-180
  servo1.sweep(0, 180, 10);
  delay(1000);
  servo1.sweep(180, 0, 10);
  delay(1000);
  
  // Servo 2: หมุนทีละ 45 องศา
  for (int angle = 0; angle <= 180; angle += 45) {
    servo2.setAngleSmooth(angle, 20);
    Serial.print("Servo 2 at: ");
    Serial.println(servo2.getCurrentAngle());
    delay(1000);
  }
  
  // กลับกลาง
  servo1.center();
  servo2.center();
  delay(2000);
}
```

</details>

---

## 📚 สรุป

### Object-Oriented Programming (OOP)

**แนวคิด:** จัดระเบียบโค้ดเป็น "Objects" ที่มีข้อมูลและ function ของตัวเอง

**คำศัพท์:**
- **Class** = แม่พิมพ์ (blueprint)
- **Object** = ตัวอย่างจริง (instance)
- **Member Variables** = ตัวแปรใน class
- **Member Functions** = function ใน class (methods)
- **Constructor** = function พิเศษที่รันตอนสร้าง object
- **Encapsulation** = การซ่อนข้อมูล (private/public)

### โครงสร้าง Class

```cpp
class ClassName {
private:
  // ซ่อนไว้ ใช้ภายในเท่านั้น
  int privateVariable;
  void privateFunction();

public:
  // เปิดให้ใช้ได้
  ClassName(int param);  // Constructor
  void publicFunction();
  int getVariable();
};
```

### การใช้งาน

```cpp
// สร้าง object
LED led(25);

// เรียกใช้ function
led.on();
led.setBrightness(128);

// อ่านสถานะ
if (led.isOn()) {
  Serial.println("LED is on!");
}
```

### ข้อดีของ OOP

1. **จัดระเบียบดี** - ข้อมูลและ function อยู่ด้วยกัน
2. **ใช้ซ้ำได้** - สร้าง object หลายตัวจาก class เดียว
3. **ปลอดภัย** - ซ่อนข้อมูล (private) ป้องกันการแก้ไขผิด
4. **แก้ไขง่าย** - แก้ที่ class เดียว ทุก object ได้ประโยชน์
5. **อ่านง่าย** - `led.on()` ชัดเจนกว่า `digitalWrite(25, HIGH)`

### เปรียบเทียบ Class vs Primitive

| หัวข้อ | int, float, bool | LED, Button (Class) |
|--------|------------------|---------------------|
| ข้อมูล | ค่าเดียว | หลายค่า (pin, state, ...) |
| Function | ไม่มี | มี (on, off, ...) |
| การสร้าง | `int x = 10;` | `LED led(25);` |
| การใช้งาน | `x + 5` | `led.on()` |

### Tips สำหรับมือใหม่

1. **เริ่มจากง่าย** - สร้าง class สำหรับสิ่งที่ใช้บ่อย (LED, Button, Sensor)
2. **ตั้งชื่อให้ดี** - ชื่อ class ขึ้นต้นด้วยตัวพิมพ์ใหญ่: `LED`, `Button`, `ServoMotor`
3. **แยกไฟล์** - ใช้ .h และ .cpp แยกกัน
4. **ซ่อนข้อมูล** - ใช้ `private` สำหรับตัวแปรภายใน
5. **เปิด function** - ใช้ `public` สำหรับ function ที่ต้องการให้ใช้

---

**หน้าก่อน:** [← บทที่ 10: การแยกไฟล์ Header](10-header-files.md)

**กลับหน้าแรก:** [← กลับไปหน้าหลักสูตร](../index.md)
