# บทที่ 9: การแยกไฟล์ Header (.h)

## วัตถุประสงค์
- เข้าใจการแยกโค้ดเป็นไฟล์ต่างๆ
- รู้จักการสร้างและใช้ไฟล์ header (.h)
- เข้าใจ header guards (#ifndef #define #endif)
- สามารถจัดระเบียบโปรเจคขนาดใหญ่ได้

## ปัญหาของไฟล์เดียวยาวๆ

เมื่อโปรเจคใหญ่ขึ้น ไฟล์ `.ino` จะยาวมากๆ:

```cpp
// ====== Constants ======
const int LED_RED = 25;
const int LED_GREEN = 26;
const int LED_BLUE = 27;
const int BUTTON1 = 32;
const int BUTTON2 = 33;
// ... อีก 20 บรรทัด

// ====== Global Variables ======
int currentMode = 0;
unsigned long lastTime = 0;
// ... อีก 10 บรรทัด

// ====== LED Functions ======
void setColor(int r, int g, int b) {
  // ... 20 บรรทัด
}

void fadeIn() {
  // ... 30 บรรทัด
}

void fadeOut() {
  // ... 30 บรรทัด
}

// ====== Button Functions ======
bool isButtonPressed(int pin) {
  // ... 20 บรรทัด
}

void handleButtons() {
  // ... 40 บรรทัด
}

// ====== Sensor Functions ======
float readTemperature() {
  // ... 30 บรรทัด
}

// ... ยาวไปอีก 500 บรรทัด

void setup() {
  // ...
}

void loop() {
  // ...
}
```

<details markdown="1">
<summary>😱 ปัญหาที่พบ</summary>

1. **หายากมาก** - ต้อง scroll หา function เป็นชั่วโมง
2. **แก้ไขยาก** - ไม่รู้ว่า function ไหนเกี่ยวข้องกัน
3. **ใช้ซ้ำไม่ได้** - ต้องการใช้ในโปรเจคอื่น ต้อง copy-paste
4. **ทำงานร่วมกันยาก** - หลายคนแก้ไฟล์เดียวกัน conflict แน่นอน
5. **Compile ช้า** - แก้ไฟล์นิดเดียว ต้อง compile ทั้งหมดใหม่

**ตัวอย่างการใช้งานจริง:**
- โปรเจค LED Matrix: มี function สำหรับ LED > 50 functions
- โปรเจค IoT: มี WiFi, MQTT, Sensors, Display แยกกันไม่ได้
- โปรเจค Robot: มี Motor, Sensor, Remote Control ปนกันหมด

</details>

---

## ทำไมต้องแยกไฟล์?

### ประโยชน์

1. **จัดระเบียบ** - แยกตาม function ชัดเจน
2. **ใช้ซ้ำได้** - นำไปใช้ในโปรเจคอื่นได้ทันที
3. **แก้ไขง่าย** - รู้ว่าต้องแก้ไฟล์ไหน
4. **ทำงานร่วมกันได้** - แต่ละคนดูแลไฟล์ของตัวเอง
5. **Compile เร็วขึ้น** - แก้ไฟล์เดียว compile แค่ไฟล์นั้น

### โครงสร้างโปรเจค

```
MyProject/
├── MyProject.ino        # ไฟล์หลัก (setup, loop)
├── led_control.h        # Header สำหรับ LED
├── led_control.cpp      # Implementation ของ LED
├── button.h             # Header สำหรับ Button
├── button.cpp           # Implementation ของ Button
├── config.h             # Configuration constants
└── utils.h              # Utility functions
```

---

## ไฟล์ Header (.h) คืออะไร?

**Header file** = ไฟล์ที่เก็บ**คำประกาศ** (declarations) ของ:
- Constants
- Function prototypes
- enum, struct definitions
- Class declarations

### โครงสร้างพื้นฐาน

```cpp
// ====== led_control.h ======
#ifndef LED_CONTROL_H  // Header guard (ป้องกัน include ซ้ำ)
#define LED_CONTROL_H

#include <Arduino.h>   // Include libraries ที่ต้องการ

// Constants
const int LED_PIN = 25;

// Function declarations (เฉพาะคำประกาศ ไม่มี body)
void initLED();
void setLEDBrightness(int brightness);
void blinkLED(int times, int duration);

#endif  // LED_CONTROL_H
```

### Header Guards คืออะไร?

**ปัญหา:** ถ้า include ไฟล์เดียวกันหลายครั้ง จะเกิด error "redefinition"

```cpp
// ในไฟล์ main.ino
#include "led_control.h"
#include "display.h"      // display.h ก็ include "led_control.h" ด้วย!
// ผลลัพธ์: led_control.h ถูก include 2 ครั้ง ❌
```

**วิธีแก้:** ใช้ **header guards**

```cpp
#ifndef LED_CONTROL_H   // ถ้ายังไม่ได้ define LED_CONTROL_H
#define LED_CONTROL_H   // ให้ define มัน

// ... โค้ดทั้งหมด ...

#endif  // ถ้า define แล้ว จะข้ามส่วนนี้ไป
```

**การทำงาน:**

1. ครั้งแรก: `LED_CONTROL_H` ยังไม่ถูก define → เข้ามาทำงาน → define มัน
2. ครั้งที่ 2: `LED_CONTROL_H` ถูก define แล้ว → ข้ามไป (ไม่ทำซ้ำ) ✅

### หลักการตั้งชื่อ Header Guard

```cpp
// ชื่อไฟล์: led_control.h
#ifndef LED_CONTROL_H    // ตัวพิมพ์ใหญ่ทั้งหมด + _H
#define LED_CONTROL_H

// ชื่อไฟล์: wifi_manager.h
#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

// ชื่อไฟล์: rgb_led.h
#ifndef RGB_LED_H
#define RGB_LED_H
```

**กฎ:** `<ชื่อไฟล์ตัวพิมพ์ใหญ่>_H`

---

## ไฟล์ Implementation (.cpp)

**Implementation file** = ไฟล์ที่เก็บ**การทำงานจริง** (implementations)

### โครงสร้าง

```cpp
// ====== led_control.cpp ======
#include "led_control.h"  // Include header ของตัวเอง

// Implementation ของ functions
void initLED() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
}

void setLEDBrightness(int brightness) {
  analogWrite(LED_PIN, brightness);
}

void blinkLED(int times, int duration) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(duration);
    digitalWrite(LED_PIN, LOW);
    delay(duration);
  }
}
```

⚠️ **สำคัญ:** ใน Arduino IDE ไฟล์ `.cpp` จะ compile อัตโนมัติถ้าอยู่ในโฟลเดอร์เดียวกับ `.ino`

---

## ตัวอย่างที่ 1: LED Control

### โครงสร้างโปรเจค

```
LEDProject/
├── LEDProject.ino
├── led_control.h
└── led_control.cpp
```

### led_control.h

```cpp
#ifndef LED_CONTROL_H
#define LED_CONTROL_H

#include <Arduino.h>

// ====== Pin Configuration ======
enum RGB {
  RED,
  GREEN,
  BLUE,
  NUM_RGB
};

extern const int RGB_PINS[];  // extern = ประกาศว่ามีอยู่ที่อื่น

// ====== PWM Configuration ======
extern const int PWM_CHANNELS[];
extern const int PWM_FREQ;
extern const int PWM_RESOLUTION;

// ====== Function Declarations ======
void initRGBLED();
void setColor(int r, int g, int b);
void turnOff();
void fadeIn(int duration);
void fadeOut(int duration);

#endif
```

<details markdown="1">
<summary>🤓 extern คืออะไร?</summary>

**extern** = บอกว่าตัวแปรนี้**มีอยู่จริง**ในไฟล์อื่น

```cpp
// ใน .h (ประกาศว่ามี)
extern const int LED_PIN;

// ใน .cpp (สร้างจริงๆ)
const int LED_PIN = 25;
```

**ทำไมต้องใช้?**

ถ้าไม่ใช้ `extern` จะสร้างตัวแปรใหม่ทุกครั้งที่ include → error "multiple definition"

**กฎ:**
- **ใน .h:** ใช้ `extern` (ประกาศ)
- **ใน .cpp:** ไม่ใช้ `extern` (สร้างจริง)

</details>

### led_control.cpp

```cpp
#include "led_control.h"

// ====== Pin Configuration (สร้างจริงๆ) ======
const int RGB_PINS[] = {25, 26, 27};

// ====== PWM Configuration ======
const int PWM_CHANNELS[] = {0, 1, 2};
const int PWM_FREQ = 5000;
const int PWM_RESOLUTION = 8;

// ====== Function Implementations ======
void initRGBLED() {
  for (int i = 0; i < NUM_RGB; i++) {
    ledcSetup(PWM_CHANNELS[i], PWM_FREQ, PWM_RESOLUTION);
    ledcAttachPin(RGB_PINS[i], PWM_CHANNELS[i]);
  }
  turnOff();
}

void setColor(int r, int g, int b) {
  ledcWrite(PWM_CHANNELS[RED], r);
  ledcWrite(PWM_CHANNELS[GREEN], g);
  ledcWrite(PWM_CHANNELS[BLUE], b);
}

void turnOff() {
  setColor(0, 0, 0);
}

void fadeIn(int duration) {
  for (int brightness = 0; brightness <= 255; brightness++) {
    setColor(brightness, brightness, brightness);
    delay(duration / 255);
  }
}

void fadeOut(int duration) {
  for (int brightness = 255; brightness >= 0; brightness--) {
    setColor(brightness, brightness, brightness);
    delay(duration / 255);
  }
}
```

### LEDProject.ino

```cpp
#include "led_control.h"

void setup() {
  Serial.begin(115200);
  initRGBLED();
  Serial.println("RGB LED Ready!");
}

void loop() {
  // แสดงสีต่างๆ
  setColor(255, 0, 0);    // แดง
  delay(1000);
  
  setColor(0, 255, 0);    // เขียว
  delay(1000);
  
  setColor(0, 0, 255);    // น้ำเงิน
  delay(1000);
  
  // Fade in/out
  fadeIn(1000);
  fadeOut(1000);
}
```

<details markdown="1">
<summary>💡 ข้อดีของการแยกไฟล์</summary>

**1. ไฟล์หลักสั้นมาก**
```cpp
// แค่ 20 บรรทัด แต่มี function ครบ!
void loop() {
  fadeIn(1000);
  fadeOut(1000);
}
```

**2. นำไปใช้ซ้ำได้ง่าย**
- Copy `led_control.h` และ `led_control.cpp` ไปโปรเจคใหม่
- `#include "led_control.h"` แล้วใช้ได้เลย!

**3. แก้ไขไม่กระทบส่วนอื่น**
- ต้องการเปลี่ยน pin? แก้แค่ใน `led_control.cpp`
- ไฟล์หลักไม่ต้องแก้เลย

**4. ทดสอบง่าย**
- สร้างโปรแกรมทดสอบ `led_control.h` แยกได้

</details>

---

## ตัวอย่างที่ 2: Button Handler

### button.h

```cpp
#ifndef BUTTON_H
#define BUTTON_H

#include <Arduino.h>

// ====== Button States ======
enum ButtonEvent {
  BUTTON_IDLE,
  BUTTON_PRESSED,
  BUTTON_RELEASED,
  BUTTON_HELD
};

// ====== Configuration ======
extern const int DEBOUNCE_DELAY;
extern const int HOLD_DURATION;

// ====== Button Class ======
class Button {
private:
  int pin;
  int lastState;
  int currentState;
  unsigned long lastDebounceTime;
  unsigned long pressStartTime;
  bool isHolding;

public:
  Button(int buttonPin);
  void begin();
  ButtonEvent update();
  bool isPressed();
};

#endif
```

### button.cpp

```cpp
#include "button.h"

// ====== Configuration ======
const int DEBOUNCE_DELAY = 50;    // milliseconds
const int HOLD_DURATION = 1000;   // milliseconds

// ====== Button Implementation ======
Button::Button(int buttonPin) {
  pin = buttonPin;
  lastState = HIGH;
  currentState = HIGH;
  lastDebounceTime = 0;
  pressStartTime = 0;
  isHolding = false;
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
        lastState = reading;
        return BUTTON_PRESSED;
      } else {
        // เพิ่งปล่อย
        isHolding = false;
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
  return BUTTON_IDLE;
}

bool Button::isPressed() {
  return (currentState == LOW);
}
```

### ตัวอย่างการใช้งาน

```cpp
#include "button.h"
#include "led_control.h"

// สร้าง object
Button button1(32);
Button button2(33);

void setup() {
  Serial.begin(115200);
  
  // เริ่มต้น
  button1.begin();
  button2.begin();
  initRGBLED();
}

void loop() {
  // อัพเดทสถานะปุ่ม
  ButtonEvent event1 = button1.update();
  ButtonEvent event2 = button2.update();
  
  // ตรวจสอบ event ของปุ่ม 1
  if (event1 == BUTTON_PRESSED) {
    Serial.println("Button 1 Pressed");
    setColor(255, 0, 0);  // แดง
  } else if (event1 == BUTTON_HELD) {
    Serial.println("Button 1 Held");
    fadeIn(500);
  } else if (event1 == BUTTON_RELEASED) {
    Serial.println("Button 1 Released");
    turnOff();
  }
  
  // ตรวจสอบ event ของปุ่ม 2
  if (event2 == BUTTON_PRESSED) {
    Serial.println("Button 2 Pressed");
    setColor(0, 255, 0);  // เขียว
  }
}
```

---

## ตัวอย่างที่ 3: Configuration File

บางทีเราต้องการแยกไฟล์ config ออกมาต่างหาก

### config.h

```cpp
#ifndef CONFIG_H
#define CONFIG_H

// ====== Hardware Configuration ======
// RGB LED Pins
#define RGB_RED_PIN 25
#define RGB_GREEN_PIN 26
#define RGB_BLUE_PIN 27

// Button Pins
#define BUTTON1_PIN 32
#define BUTTON2_PIN 33
#define BUTTON3_PIN 18

// Sensor Pins
#define DHT_PIN 4
#define ULTRASONIC_TRIG 5
#define ULTRASONIC_ECHO 16

// ====== PWM Configuration ======
#define PWM_FREQ 5000
#define PWM_RESOLUTION 8

// ====== Timing Configuration ======
#define DEBOUNCE_DELAY 50
#define HOLD_DURATION 1000
#define SENSOR_READ_INTERVAL 2000

// ====== WiFi Configuration ======
#define WIFI_SSID "MyNetwork"
#define WIFI_PASSWORD "mypassword123"
#define MQTT_SERVER "192.168.1.100"
#define MQTT_PORT 1883

// ====== Debug Configuration ======
#define DEBUG_MODE 1  // เปลี่ยนเป็น 0 เพื่อปิด debug

#if DEBUG_MODE
  #define DEBUG_PRINT(x) Serial.print(x)
  #define DEBUG_PRINTLN(x) Serial.println(x)
#else
  #define DEBUG_PRINT(x)
  #define DEBUG_PRINTLN(x)
#endif

#endif
```

<details markdown="1">
<summary>💡 เทคนิค: Conditional Compilation</summary>

**ปัญหา:** Serial.print() ทำให้โปรแกรมช้า แต่ต้องการใช้ตอน debug

**วิธีแก้:** ใช้ `#if` ปิด/เปิด debug

```cpp
#define DEBUG_MODE 1  // เปลี่ยนเป็น 0 เพื่อปิด

#if DEBUG_MODE
  #define DEBUG_PRINT(x) Serial.print(x)
#else
  #define DEBUG_PRINT(x)  // ไม่ทำอะไรเลย
#endif

// ใช้งาน
DEBUG_PRINT("Temperature: ");
DEBUG_PRINTLN(temp);
```

**ข้อดี:**
- Production: ตั้ง `DEBUG_MODE 0` → โค้ด debug จะหายไป
- Development: ตั้ง `DEBUG_MODE 1` → มี debug ปกติ
- แก้ไขแค่บรรทัดเดียว!

</details>

### การใช้งาน config.h

```cpp
#include "config.h"
#include "led_control.h"

void setup() {
  Serial.begin(115200);
  
  DEBUG_PRINTLN("Starting...");
  
  // ใช้ค่าจาก config.h
  pinMode(RGB_RED_PIN, OUTPUT);
  pinMode(BUTTON1_PIN, INPUT_PULLUP);
  
  DEBUG_PRINT("WiFi SSID: ");
  DEBUG_PRINTLN(WIFI_SSID);
}

void loop() {
  DEBUG_PRINTLN("Loop running...");
  delay(1000);
}
```

---

## 💻 แบบฝึกหัดที่ 1: Refactor โปรเจค RGB LED

### โจทย์

มีโค้ดยาวๆ ในไฟล์เดียว ให้แยกออกเป็น:
1. `config.h` - Pin และค่าคงที่
2. `rgb_led.h` และ `rgb_led.cpp` - ฟังก์ชัน LED
3. `main.ino` - เหลือแค่ setup และ loop

**โค้ดเดิม:**

```cpp
// ทั้งหมดอยู่ในไฟล์เดียว
const int RED_PIN = 25;
const int GREEN_PIN = 26;
const int BLUE_PIN = 27;
const int PWM_FREQ = 5000;

void setup() {
  ledcSetup(0, PWM_FREQ, 8);
  ledcSetup(1, PWM_FREQ, 8);
  ledcSetup(2, PWM_FREQ, 8);
  ledcAttachPin(RED_PIN, 0);
  ledcAttachPin(GREEN_PIN, 1);
  ledcAttachPin(BLUE_PIN, 2);
}

void setColor(int r, int g, int b) {
  ledcWrite(0, r);
  ledcWrite(1, g);
  ledcWrite(2, b);
}

void loop() {
  setColor(255, 0, 0);
  delay(1000);
  setColor(0, 255, 0);
  delay(1000);
}
```

<details markdown="1">
<summary>✅ เฉลย</summary>

**config.h**
```cpp
#ifndef CONFIG_H
#define CONFIG_H

// RGB LED Pins
#define RGB_RED_PIN 25
#define RGB_GREEN_PIN 26
#define RGB_BLUE_PIN 27

// PWM Settings
#define PWM_FREQ 5000
#define PWM_RESOLUTION 8

#endif
```

**rgb_led.h**
```cpp
#ifndef RGB_LED_H
#define RGB_LED_H

#include <Arduino.h>

void initRGB();
void setColor(int r, int g, int b);
void setRed();
void setGreen();
void setBlue();
void turnOff();

#endif
```

**rgb_led.cpp**
```cpp
#include "rgb_led.h"
#include "config.h"

enum RGB { RED, GREEN, BLUE };
const int channels[] = {0, 1, 2};

void initRGB() {
  ledcSetup(channels[RED], PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(channels[GREEN], PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(channels[BLUE], PWM_FREQ, PWM_RESOLUTION);
  
  ledcAttachPin(RGB_RED_PIN, channels[RED]);
  ledcAttachPin(RGB_GREEN_PIN, channels[GREEN]);
  ledcAttachPin(RGB_BLUE_PIN, channels[BLUE]);
  
  turnOff();
}

void setColor(int r, int g, int b) {
  ledcWrite(channels[RED], r);
  ledcWrite(channels[GREEN], g);
  ledcWrite(channels[BLUE], b);
}

void setRed() { setColor(255, 0, 0); }
void setGreen() { setColor(0, 255, 0); }
void setBlue() { setColor(0, 0, 255); }
void turnOff() { setColor(0, 0, 0); }
```

**main.ino**
```cpp
#include "rgb_led.h"

void setup() {
  initRGB();
}

void loop() {
  setRed();
  delay(1000);
  setGreen();
  delay(1000);
  setBlue();
  delay(1000);
}
```

**ข้อดี:**
- `main.ino` สั้นมาก อ่านง่าย
- ต้องการเปลี่ยน pin? แก้แค่ `config.h`
- ต้องการใช้ RGB LED ในโปรเจคอื่น? Copy 3 ไฟล์ไป

</details>

---

## 💻 แบบฝึกหัดที่ 2: สร้าง Timer Library

### โจทย์

สร้าง library สำหรับ non-blocking timer ที่มี features:
- ตั้งเวลาได้ (setInterval)
- ตรวจสอบว่าหมดเวลาหรือยัง (isExpired)
- Reset timer
- Pause/Resume

**ตัวอย่างการใช้งาน:**
```cpp
Timer timer1(1000);  // 1 วินาที

void setup() {
  timer1.start();
}

void loop() {
  if (timer1.isExpired()) {
    Serial.println("Timer expired!");
    timer1.reset();
  }
}
```

<details markdown="1">
<summary>💡 Hint</summary>

```cpp
class Timer {
private:
  unsigned long interval;
  unsigned long startTime;
  bool running;

public:
  Timer(unsigned long ms);
  void start();
  void stop();
  void reset();
  bool isExpired();
  unsigned long getElapsed();
};
```

</details>

<details markdown="1">
<summary>✅ เฉลย</summary>

**timer.h**
```cpp
#ifndef TIMER_H
#define TIMER_H

#include <Arduino.h>

class Timer {
private:
  unsigned long interval;
  unsigned long startTime;
  unsigned long pausedTime;
  bool running;
  bool paused;

public:
  Timer(unsigned long ms);
  
  void start();
  void stop();
  void reset();
  void pause();
  void resume();
  
  bool isExpired();
  bool isRunning();
  bool isPaused();
  
  unsigned long getElapsed();
  unsigned long getRemaining();
  
  void setInterval(unsigned long ms);
  unsigned long getInterval();
};

#endif
```

**timer.cpp**
```cpp
#include "timer.h"

Timer::Timer(unsigned long ms) {
  interval = ms;
  startTime = 0;
  pausedTime = 0;
  running = false;
  paused = false;
}

void Timer::start() {
  startTime = millis();
  running = true;
  paused = false;
}

void Timer::stop() {
  running = false;
  paused = false;
}

void Timer::reset() {
  startTime = millis();
  paused = false;
}

void Timer::pause() {
  if (running && !paused) {
    pausedTime = millis();
    paused = true;
  }
}

void Timer::resume() {
  if (running && paused) {
    // ปรับ startTime เพื่อชดเชยเวลาที่ pause
    unsigned long pauseDuration = millis() - pausedTime;
    startTime += pauseDuration;
    paused = false;
  }
}

bool Timer::isExpired() {
  if (!running || paused) {
    return false;
  }
  return (millis() - startTime >= interval);
}

bool Timer::isRunning() {
  return running;
}

bool Timer::isPaused() {
  return paused;
}

unsigned long Timer::getElapsed() {
  if (!running) {
    return 0;
  }
  if (paused) {
    return pausedTime - startTime;
  }
  return millis() - startTime;
}

unsigned long Timer::getRemaining() {
  unsigned long elapsed = getElapsed();
  if (elapsed >= interval) {
    return 0;
  }
  return interval - elapsed;
}

void Timer::setInterval(unsigned long ms) {
  interval = ms;
}

unsigned long Timer::getInterval() {
  return interval;
}
```

**ตัวอย่างการใช้งาน**
```cpp
#include "timer.h"

Timer ledTimer(500);      // กะพริบทุก 500ms
Timer printTimer(1000);   // พิมพ์ทุก 1 วินาที

const int LED_PIN = 25;
bool ledState = false;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  
  ledTimer.start();
  printTimer.start();
}

void loop() {
  // กะพริบ LED
  if (ledTimer.isExpired()) {
    ledState = !ledState;
    digitalWrite(LED_PIN, ledState);
    ledTimer.reset();
  }
  
  // พิมพ์ข้อความ
  if (printTimer.isExpired()) {
    Serial.print("Uptime: ");
    Serial.print(millis() / 1000);
    Serial.println(" seconds");
    printTimer.reset();
  }
}
```

</details>

---

## 📚 สรุป

### การแยกไฟล์

**1. ไฟล์ Header (.h)**
- เก็บ declarations (function prototypes, constants, classes)
- ใช้ header guards ป้องกัน include ซ้ำ
- ใช้ `extern` สำหรับตัวแปรที่จะสร้างใน .cpp

**2. ไฟล์ Implementation (.cpp)**
- เก็บ implementations (function bodies)
- Include header ของตัวเอง
- สร้างตัวแปรจริงๆ (ไม่ใช้ `extern`)

**3. ไฟล์ Config (.h)**
- เก็บค่าคงที่ทั้งหมด
- ใช้ #define สำหรับ pins และ settings
- รวม conditional compilation (#if DEBUG_MODE)

### Header Guards

```cpp
#ifndef FILE_NAME_H
#define FILE_NAME_H

// ... code ...

#endif
```

### โครงสร้างโปรเจคที่ดี

```
MyProject/
├── MyProject.ino       # หลัก (setup, loop)
├── config.h            # Configuration
├── module1.h           # Declarations
├── module1.cpp         # Implementations
├── module2.h
└── module2.cpp
```

### ข้อดี

1. **จัดระเบียบ** - แยกตามหน้าที่ชัดเจน
2. **ใช้ซ้ำได้** - Copy ไปโปรเจคอื่นง่าย
3. **แก้ไขง่าย** - รู้ว่าต้องแก้ไฟล์ไหน
4. **ทำงานร่วมกัน** - แต่ละคนดูแลไฟล์ตัวเอง
5. **Compile เร็ว** - แก้ไฟล์เดียว compile แค่นั้น

### เตรียมพร้อมบทถัดไป

บทถัดไปจะเรียนเรื่อง **Class เบื้องต้น** ซึ่งจะทำให้การสร้าง library และ module ของเราเองทำได้ง่ายและมีประสิทธิภาพมากขึ้น!

---

**หน้าถัดไป:** [บทที่ 11: Class เบื้องต้น →](11-class-basics.md)

**หน้าก่อน:** [← บทที่ 9: Array และ Enum](09-array-enum.md)

**กลับหน้าแรก:** [← กลับไปหน้าหลักสูตร](../index.md)
