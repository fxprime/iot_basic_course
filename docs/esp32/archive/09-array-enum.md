# บทที่ 8: Array และ Enum

## วัตถุประสงค์
- เข้าใจการใช้ array สำหรับเก็บข้อมูลหลายค่า
- รู้จักการใช้ enum เพื่อให้โค้ดอ่านง่ายขึ้น
- สามารถใช้ for loop กับ array และ enum ได้
- ประยุกต์ใช้กับโปรเจคจริง

## ปัญหาของการใช้ตัวแปรหลายตัว

สมมติเราต้องการควบคุม LED 5 ดวง:

```cpp
const int LED1_PIN = 25;
const int LED2_PIN = 26;
const int LED3_PIN = 27;
const int LED4_PIN = 32;
const int LED5_PIN = 33;

void setup() {
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(LED4_PIN, OUTPUT);
  pinMode(LED5_PIN, OUTPUT);
}

void loop() {
  // เปิดทีละดวง
  digitalWrite(LED1_PIN, HIGH);
  delay(200);
  digitalWrite(LED1_PIN, LOW);
  
  digitalWrite(LED2_PIN, HIGH);
  delay(200);
  digitalWrite(LED2_PIN, LOW);
  
  // ... ต้องเขียนอีก 3 ดวง 😫
}
```

<details markdown="1">
<summary>😱 ปัญหาที่พบ</summary>

1. **โค้ดยาวซ้ำๆ** - ทำแบบเดิมซ้ำหลายครั้ง
2. **แก้ไขยาก** - ถ้าต้องการเพิ่ม LED ต้องเขียนเพิ่มหลายบรรทัด
3. **ผิดพลาดง่าย** - copy-paste แล้วลืมเปลี่ยนชื่อตัวแปร
4. **ไม่สามารถใช้ loop ได้** - ต้องเขียนคำสั่งทีละตัว

**ตัวอย่างข้อผิดพลาดที่พบบ่อย:**
```cpp
digitalWrite(LED2_PIN, HIGH);  // เปิด LED 2
delay(200);
digitalWrite(LED2_PIN, LOW);   // ปิด... แต่ลืมเปลี่ยนเป็น LED3 😱
```

</details>

---

## Array คืออะไร?

**Array** = ตัวแปรที่เก็บข้อมูลหลายๆ ค่าใน**ชนิดเดียวกัน**

### แนวคิด

แทนที่จะมีตัวแปร 5 ตัว:
```
LED1_PIN  LED2_PIN  LED3_PIN  LED4_PIN  LED5_PIN
  [25]      [26]      [27]      [32]      [33]
```

เราใช้ array ตัวเดียว:
```
LED_PINS[0]  LED_PINS[1]  LED_PINS[2]  LED_PINS[3]  LED_PINS[4]
   [25]         [26]         [27]         [32]         [33]
```

### ไวยากรณ์

```cpp
// วิธีที่ 1: กำหนดค่าเลย
ชนิดข้อมูล ชื่อarray[] = {ค่า1, ค่า2, ค่า3, ...};

// วิธีที่ 2: กำหนดขนาดไว้ก่อน
ชนิดข้อมูล ชื่อarray[ขนาด];
```

### ตัวอย่าง

```cpp
// LED 5 ดวง
const int LED_PINS[] = {25, 26, 27, 32, 33};

// ค่า PWM สำหรับ LED แต่ละดวง
int brightness[] = {0, 64, 128, 192, 255};

// ชื่อวันในสัปดาห์
const char* DAYS[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};

// กำหนดขนาดไว้ก่อน
int sensorReadings[10];  // เก็บค่าอ่านได้ 10 ค่า
```

### การเข้าถึงข้อมูล (Index)

```cpp
const int LED_PINS[] = {25, 26, 27, 32, 33};

// เข้าถึงตัวแรก (index 0)
int firstLED = LED_PINS[0];  // ได้ 25

// เข้าถึงตัวที่ 3 (index 2)
int thirdLED = LED_PINS[2];  // ได้ 27

// เข้าถึงตัวสุดท้าย
int lastLED = LED_PINS[4];   // ได้ 33
```

⚠️ **สำคัญ:** Array เริ่มนับที่ 0 ไม่ใช่ 1!

```
Index:     0    1    2    3    4
Value:   [25] [26] [27] [32] [33]
```

---

## ใช้ Array กับ LED

### ตัวอย่าง: เปิด LED ทีละดวง

```cpp
const int LED_PINS[] = {25, 26, 27, 32, 33};
const int NUM_LEDS = 5;  // จำนวน LED

void setup() {
  // ตั้งค่า pinMode ทั้งหมดด้วย for loop
  for (int i = 0; i < NUM_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
}

void loop() {
  // เปิดทีละดวงจากซ้ายไปขวา
  for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(200);
    digitalWrite(LED_PINS[i], LOW);
  }
}
```

<details markdown="1">
<summary>💡 ข้อดีของการใช้ Array + Loop</summary>

**1. โค้ดสั้นลง**
```cpp
// แทนที่จะเขียน 5 บรรทัด
pinMode(LED1_PIN, OUTPUT);
pinMode(LED2_PIN, OUTPUT);
// ...

// ใช้ loop แค่ 3 บรรทัด
for (int i = 0; i < NUM_LEDS; i++) {
  pinMode(LED_PINS[i], OUTPUT);
}
```

**2. เพิ่ม LED ง่าย**
```cpp
// ต้องการเพิ่มเป็น 8 ดวง? แค่เพิ่มใน array
const int LED_PINS[] = {25, 26, 27, 32, 33, 14, 12, 13};
const int NUM_LEDS = 8;  // เปลี่ยนแค่นี้!
// โค้ดอื่นไม่ต้องแก้เลย 🎉
```

**3. สร้าง Pattern ได้ง่าย**
```cpp
// วนกลับ (ขวาไปซ้าย)
for (int i = NUM_LEDS - 1; i >= 0; i--) {
  digitalWrite(LED_PINS[i], HIGH);
  delay(200);
  digitalWrite(LED_PINS[i], LOW);
}

// แสดงแบบสลับดวง (0, 2, 4, ...)
for (int i = 0; i < NUM_LEDS; i += 2) {
  digitalWrite(LED_PINS[i], HIGH);
}
```

**4. ใช้ฟังก์ชันได้สะดวก**
```cpp
void turnAllOff() {
  for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(LED_PINS[i], LOW);
  }
}

void turnAllOn() {
  for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(LED_PINS[i], HIGH);
  }
}
```

</details>

### ตัวอย่าง: LED Chaser (ไฟวิ่ง)

```cpp
const int LED_PINS[] = {25, 26, 27, 32, 33};
const int NUM_LEDS = 5;
const int CHASE_DELAY = 100;  // milliseconds

void setup() {
  for (int i = 0; i < NUM_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
}

void chaseLEDs() {
  // วิ่งไปข้างหน้า
  for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(CHASE_DELAY);
    digitalWrite(LED_PINS[i], LOW);
  }
  
  // วิ่งกลับ
  for (int i = NUM_LEDS - 1; i >= 0; i--) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(CHASE_DELAY);
    digitalWrite(LED_PINS[i], LOW);
  }
}

void loop() {
  chaseLEDs();
}
```

---

## ปัญหาของการใช้ Index ตัวเลข

ถึงแม้ใช้ array แล้ว แต่การใช้ตัวเลขตรง ๆ ยังอ่านยาก:

```cpp
const int RGB_PINS[] = {25, 26, 27};  // R, G, B

void setColor(int r, int g, int b) {
  analogWrite(RGB_PINS[0], r);  // 0 คือ Red หรือเปล่า? 🤔
  analogWrite(RGB_PINS[1], g);  // 1 คือ Green ใช่ไหม? 🤔
  analogWrite(RGB_PINS[2], b);  // 2 คือ Blue... หวังว่าใช่ 😅
}

// ในโค้ดอื่น...
analogWrite(RGB_PINS[1], 255);  // เปิดสีอะไร? ต้องกลับไปดู! 😫
```

**วิธีแก้:** ใช้ **Enum**!

---

## Enum คืออะไร?

**Enum** (Enumeration) = การตั้งชื่อให้กับตัวเลข

### แนวคิด

แทนที่จะจำว่า:
- 0 = Red
- 1 = Green  
- 2 = Blue

เราให้คอมพิวเตอร์จำให้:

```cpp
enum RGB {
  RED,    // = 0 อัตโนมัติ
  GREEN,  // = 1 อัตโนมัติ
  BLUE    // = 2 อัตโนมัติ
};
```

ตอนใช้งาน:
```cpp
analogWrite(RGB_PINS[RED], 255);    // ชัดเจนว่าเป็นสีแดง! ✅
analogWrite(RGB_PINS[GREEN], 128);  // ชัดเจนว่าเป็นสีเขียว! ✅
analogWrite(RGB_PINS[BLUE], 0);     // ชัดเจนว่าเป็นสีน้ำเงิน! ✅
```

### ไวยากรณ์

```cpp
enum ชื่อEnum {
  ชื่อค่า1,       // = 0 (default)
  ชื่อค่า2,       // = 1
  ชื่อค่า3,       // = 2
  // ...
};
```

### ตัวอย่าง

```cpp
// RGB LED
enum RGB {
  RED,    // 0
  GREEN,  // 1
  BLUE    // 2
};

// วันในสัปดาห์
enum Day {
  SUNDAY,     // 0
  MONDAY,     // 1
  TUESDAY,    // 2
  WEDNESDAY,  // 3
  THURSDAY,   // 4
  FRIDAY,     // 5
  SATURDAY    // 6
};

// สถานะไฟจราจร
enum TrafficLight {
  TRAFFIC_RED,     // 0
  TRAFFIC_YELLOW,  // 1
  TRAFFIC_GREEN    // 2
};

// สถานะปุ่ม
enum ButtonState {
  BUTTON_IDLE,     // 0
  BUTTON_PRESSED,  // 1
  BUTTON_RELEASED  // 2
};
```

### กำหนดค่าเอง

```cpp
// กำหนดค่าเริ่มต้น
enum PinMode {
  INPUT = 0,
  OUTPUT = 1,
  INPUT_PULLUP = 2
};

// ข้าม่าบางตัว
enum Status {
  OK = 0,
  WARNING = 1,
  ERROR = 10,      // กำหนดเป็น 10
  CRITICAL = 11    // ถัดไปจะเป็น 11 อัตโนมัติ
};

// ใช้ค่า bit flags
enum Permission {
  READ = 1,      // 0001
  WRITE = 2,     // 0010
  EXECUTE = 4    // 0100
};
```

---

## Array + Enum = ❤️

### ตัวอย่าง: RGB LED

```cpp
// ====== Pin Configuration ======
enum RGB {
  RED,
  GREEN,
  BLUE,
  NUM_RGB_PINS  // = 3 (ใช้นับจำนวน)
};

const int RGB_PINS[] = {25, 26, 27};

// ====== PWM Configuration ======
const int PWM_CHANNELS[] = {0, 1, 2};
const int PWM_FREQ = 5000;
const int PWM_RESOLUTION = 8;

void setup() {
  // ตั้งค่า PWM
  for (int i = 0; i < NUM_RGB_PINS; i++) {
    ledcSetup(PWM_CHANNELS[i], PWM_FREQ, PWM_RESOLUTION);
    ledcAttachPin(RGB_PINS[i], PWM_CHANNELS[i]);
  }
}

void setColor(int r, int g, int b) {
  // อ่านง่ายมาก! ชัดเจนว่าเป็นสีอะไร
  ledcWrite(PWM_CHANNELS[RED], r);
  ledcWrite(PWM_CHANNELS[GREEN], g);
  ledcWrite(PWM_CHANNELS[BLUE], b);
}

void loop() {
  // แสดงสีต่างๆ
  setColor(255, 0, 0);    // แดง
  delay(1000);
  setColor(0, 255, 0);    // เขียว
  delay(1000);
  setColor(0, 0, 255);    // น้ำเงิน
  delay(1000);
  
  // ปรับความสว่างแดงอย่างเดียว
  for (int brightness = 0; brightness <= 255; brightness++) {
    ledcWrite(PWM_CHANNELS[RED], brightness);  // ชัดเจนว่าเป็นสีแดง!
    delay(5);
  }
}
```

<details markdown="1">
<summary>💡 เทคนิค: ใช้ enum นับจำนวน</summary>

```cpp
enum RGB {
  RED,
  GREEN,
  BLUE,
  NUM_RGB_PINS  // จะมีค่า = 3 อัตโนมัติ!
};

// ใช้สำหรับ loop
for (int i = 0; i < NUM_RGB_PINS; i++) {
  // ...
}
```

**ข้อดี:**
- ถ้าเพิ่มสี (เช่น WHITE) enum จะนับให้อัตโนมัติ
- ไม่ต้องเขียน `const int NUM_RGB_PINS = 3;` แยก

</details>

### ตัวอย่าง: Traffic Light

```cpp
// ====== Traffic Light States ======
enum TrafficState {
  STATE_RED,
  STATE_YELLOW,
  STATE_GREEN,
  NUM_STATES
};

// ====== LED Configuration ======
enum TrafficLED {
  LED_RED,
  LED_YELLOW,
  LED_GREEN,
  NUM_LEDS
};

const int LED_PINS[] = {25, 26, 27};
const int STATE_DURATION[] = {5000, 2000, 5000};  // milliseconds

TrafficState currentState = STATE_RED;
unsigned long lastChangeTime = 0;

void setup() {
  for (int i = 0; i < NUM_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
}

void updateTrafficLight() {
  // ปิดทั้งหมดก่อน
  for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(LED_PINS[i], LOW);
  }
  
  // เปิด LED ตามสถานะ
  digitalWrite(LED_PINS[currentState], HIGH);
}

void loop() {
  unsigned long currentTime = millis();
  
  // ถึงเวลาเปลี่ยนสถานะ
  if (currentTime - lastChangeTime >= STATE_DURATION[currentState]) {
    // เปลี่ยนไปสถานะถัดไป (วนกลับถ้าถึงสุดท้าย)
    currentState = (TrafficState)((currentState + 1) % NUM_STATES);
    lastChangeTime = currentTime;
    updateTrafficLight();
  }
}
```

<details markdown="1">
<summary>🤓 อธิบายโค้ด</summary>

**1. enum มี 2 ชุด:**
- `TrafficState`: สถานะของไฟจราจร (RED, YELLOW, GREEN)
- `TrafficLED`: ตำแหน่ง LED ใน array (แยกเพื่อความชัดเจน)

**2. Array เก็บข้อมูล:**
```cpp
const int LED_PINS[] = {25, 26, 27};           // pin ของแต่ละ LED
const int STATE_DURATION[] = {5000, 2000, 5000}; // เวลาแต่ละสถานะ
```

**3. เปลี่ยนสถานะ:**
```cpp
currentState = (TrafficState)((currentState + 1) % NUM_STATES);
```
- `currentState + 1`: สถานะถัดไป
- `% NUM_STATES`: ถ้าเกิน 2 จะวนกลับเป็น 0
- `(TrafficState)`: แปลงกลับเป็น enum type

**ตัวอย่าง:**
- STATE_RED (0) → 0+1 = 1 % 3 = 1 → STATE_YELLOW
- STATE_YELLOW (1) → 1+1 = 2 % 3 = 2 → STATE_GREEN
- STATE_GREEN (2) → 2+1 = 3 % 3 = 0 → STATE_RED (วนกลับ!)

</details>

---

## 💻 แบบฝึกหัดที่ 1: LED Bar Graph

### โจทย์

สร้าง LED Bar Graph 5 ดวง แสดงระดับความสว่าง 0-5:
- 0 = ปิดทั้งหมด
- 1 = เปิด 1 ดวง
- 2 = เปิด 2 ดวง
- ...
- 5 = เปิดทั้งหมด

ใช้ปุ่ม 2 ปุ่ม:
- ปุ่ม UP: เพิ่มระดับ
- ปุ่ม DOWN: ลดระดับ

<details markdown="1">
<summary>✅ เฉลย</summary>

```cpp
// ====== LED Configuration ======
const int LED_PINS[] = {25, 26, 27, 32, 33};
const int NUM_LEDS = 5;

// ====== Button Configuration ======
const int BUTTON_UP = 18;
const int BUTTON_DOWN = 19;
const int DEBOUNCE_DELAY = 50;

// ====== State Variables ======
int currentLevel = 0;  // 0 ถึง NUM_LEDS

// Debounce variables
unsigned long lastDebounceTime = 0;
int lastButtonUp = HIGH;
int lastButtonDown = HIGH;

void setup() {
  // ตั้งค่า LED pins
  for (int i = 0; i < NUM_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
  
  // ตั้งค่า button pins
  pinMode(BUTTON_UP, INPUT_PULLUP);
  pinMode(BUTTON_DOWN, INPUT_PULLUP);
  
  // เริ่มต้นแสดงระดับ 0
  updateDisplay();
}

void updateDisplay() {
  // เปิด LED ตามจำนวน level
  for (int i = 0; i < NUM_LEDS; i++) {
    if (i < currentLevel) {
      digitalWrite(LED_PINS[i], HIGH);
    } else {
      digitalWrite(LED_PINS[i], LOW);
    }
  }
}

void loop() {
  unsigned long currentTime = millis();
  
  // อ่านสถานะปุ่ม
  int buttonUpState = digitalRead(BUTTON_UP);
  int buttonDownState = digitalRead(BUTTON_DOWN);
  
  // ตรวจสอบ debounce
  if (currentTime - lastDebounceTime > DEBOUNCE_DELAY) {
    // ปุ่ม UP ถูกกด
    if (buttonUpState == LOW && lastButtonUp == HIGH) {
      if (currentLevel < NUM_LEDS) {
        currentLevel++;
        updateDisplay();
      }
      lastDebounceTime = currentTime;
    }
    
    // ปุ่ม DOWN ถูกกด
    if (buttonDownState == LOW && lastButtonDown == HIGH) {
      if (currentLevel > 0) {
        currentLevel--;
        updateDisplay();
      }
      lastDebounceTime = currentTime;
    }
  }
  
  // บันทึกสถานะปุ่ม
  lastButtonUp = buttonUpState;
  lastButtonDown = buttonDownState;
}
```

**จุดสำคัญ:**
1. ใช้ `for` loop เปรียบเทียบ `i < currentLevel`
2. Debounce ป้องกันการกดซ้ำเร็วเกินไป
3. ตรวจสอบขอบเขต: `currentLevel < NUM_LEDS` และ `currentLevel > 0`

</details>

---

## 💻 แบบฝึกหัดที่ 2: LED Patterns

### โจทย์

สร้างโปรแกรมแสดง pattern ต่างๆ บน LED 5 ดวง:

1. **Pattern: Wave** - ไฟวิ่งไปกลับ
2. **Pattern: Blink All** - กะพริบพร้อมกัน
3. **Pattern: Odd/Even** - สลับดวงคี่/คู่
4. **Pattern: Center Out** - ขยายจากกลางออก

ใช้ปุ่ม 1 ปุ่มเปลี่ยน pattern

<details markdown="1">
<summary>💡 Hint</summary>

- ใช้ enum สำหรับ pattern types
- ใช้ตัวแปร `currentPattern` เก็บ pattern ปัจจุบัน
- แยกฟังก์ชันสำหรับแต่ละ pattern

</details>

<details markdown="1">
<summary>✅ เฉลย</summary>

```cpp
// ====== LED Configuration ======
const int LED_PINS[] = {25, 26, 27, 32, 33};
const int NUM_LEDS = 5;

// ====== Pattern Types ======
enum Pattern {
  PATTERN_WAVE,
  PATTERN_BLINK,
  PATTERN_ODD_EVEN,
  PATTERN_CENTER_OUT,
  NUM_PATTERNS
};

// ====== Button Configuration ======
const int BUTTON_MODE = 18;

// ====== State Variables ======
Pattern currentPattern = PATTERN_WAVE;
unsigned long lastPatternChange = 0;
const int PATTERN_SPEED = 200;  // milliseconds

// Debounce
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const int DEBOUNCE_DELAY = 50;

void setup() {
  // ตั้งค่า LED
  for (int i = 0; i < NUM_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
  
  // ตั้งค่าปุ่ม
  pinMode(BUTTON_MODE, INPUT_PULLUP);
  
  Serial.begin(115200);
}

void turnAllOff() {
  for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(LED_PINS[i], LOW);
  }
}

void patternWave() {
  static int position = 0;
  static int direction = 1;
  
  turnAllOff();
  digitalWrite(LED_PINS[position], HIGH);
  
  position += direction;
  
  // เปลี่ยนทิศทางเมื่อถึงขอบ
  if (position >= NUM_LEDS - 1 || position <= 0) {
    direction = -direction;
  }
}

void patternBlink() {
  static bool state = false;
  
  for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(LED_PINS[i], state ? HIGH : LOW);
  }
  
  state = !state;
}

void patternOddEven() {
  static bool showOdd = true;
  
  for (int i = 0; i < NUM_LEDS; i++) {
    if (showOdd && i % 2 == 0) {
      digitalWrite(LED_PINS[i], HIGH);
    } else if (!showOdd && i % 2 == 1) {
      digitalWrite(LED_PINS[i], HIGH);
    } else {
      digitalWrite(LED_PINS[i], LOW);
    }
  }
  
  showOdd = !showOdd;
}

void patternCenterOut() {
  static int stage = 0;
  int center = NUM_LEDS / 2;  // = 2 สำหรับ 5 ดวง
  
  turnAllOff();
  
  // แสดง LED จากกลางออกข้าง
  for (int i = 0; i <= stage; i++) {
    if (center - i >= 0) {
      digitalWrite(LED_PINS[center - i], HIGH);
    }
    if (center + i < NUM_LEDS) {
      digitalWrite(LED_PINS[center + i], HIGH);
    }
  }
  
  stage++;
  if (stage > center) {
    stage = 0;
  }
}

void runPattern() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastPatternChange >= PATTERN_SPEED) {
    switch (currentPattern) {
      case PATTERN_WAVE:
        patternWave();
        break;
      case PATTERN_BLINK:
        patternBlink();
        break;
      case PATTERN_ODD_EVEN:
        patternOddEven();
        break;
      case PATTERN_CENTER_OUT:
        patternCenterOut();
        break;
    }
    
    lastPatternChange = currentTime;
  }
}

void loop() {
  unsigned long currentTime = millis();
  int buttonState = digitalRead(BUTTON_MODE);
  
  // ตรวจจับการกดปุ่ม (with debounce)
  if (buttonState == LOW && lastButtonState == HIGH) {
    if (currentTime - lastDebounceTime > DEBOUNCE_DELAY) {
      // เปลี่ยน pattern
      currentPattern = (Pattern)((currentPattern + 1) % NUM_PATTERNS);
      turnAllOff();
      
      Serial.print("Changed to pattern: ");
      Serial.println(currentPattern);
      
      lastDebounceTime = currentTime;
    }
  }
  
  lastButtonState = buttonState;
  
  // รัน pattern ปัจจุบัน
  runPattern();
}
```

**จุดสำคัญ:**

1. **Static variables ในฟังก์ชัน**
   ```cpp
   static int position = 0;  // จำค่าระหว่างการเรียกใช้
   ```

2. **Switch-case สำหรับหลาย pattern**
   ```cpp
   switch (currentPattern) {
     case PATTERN_WAVE:
       patternWave();
       break;
   }
   ```

3. **Center Out pattern**
   ```cpp
   // แสดงจากกลางออกทั้ง 2 ข้าง
   digitalWrite(LED_PINS[center - i], HIGH);  // ซ้าย
   digitalWrite(LED_PINS[center + i], HIGH);  // ขวา
   ```

</details>

---

## 💻 แบบฝึกหัดที่ 3: Simon Says Game

### โจทย์

สร้างเกม Simon Says แบบง่าย:

1. ระบบแสดง sequence ของ LED (เช่น LED 0 → 2 → 1)
2. ผู้เล่นต้องกดปุ่มตาม sequence
3. ถ้าถูก เพิ่ม sequence ยาวขึ้น
4. ถ้าผิด เริ่มใหม่

ใช้:
- LED 3 ดวง (หรือมากกว่า)
- ปุ่ม 3 ปุ่ม (แต่ละปุ่มตรงกับ LED)

<details markdown="1">
<summary>💡 Hint</summary>

- ใช้ array เก็บ sequence: `int sequence[MAX_LEVEL]`
- ใช้ `random()` สุ่ม LED ถัดไป
- ใช้ enum สำหรับ game states: SHOWING, WAITING, CORRECT, WRONG

</details>

<details markdown="1">
<summary>✅ เฉลย (ขั้นพื้นฐาน)</summary>

```cpp
// ====== Configuration ======
const int LED_PINS[] = {25, 26, 27};
const int BUTTON_PINS[] = {32, 33, 18};
const int NUM_BUTTONS = 3;

const int MAX_LEVEL = 20;
const int SHOW_DURATION = 500;
const int GAP_DURATION = 200;

// ====== Game States ======
enum GameState {
  STATE_SHOWING,
  STATE_WAITING,
  STATE_CORRECT,
  STATE_WRONG
};

// ====== Variables ======
int sequence[MAX_LEVEL];
int currentLevel = 1;
int currentStep = 0;
GameState gameState = STATE_SHOWING;

unsigned long lastActionTime = 0;
int lastButtonStates[NUM_BUTTONS];

void setup() {
  // ตั้งค่า pins
  for (int i = 0; i < NUM_BUTTONS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);
    lastButtonStates[i] = HIGH;
  }
  
  Serial.begin(115200);
  randomSeed(analogRead(0));  // สุ่มจาก noise
  
  // เริ่มเกมใหม่
  startNewGame();
}

void startNewGame() {
  currentLevel = 1;
  currentStep = 0;
  gameState = STATE_SHOWING;
  
  // สุ่ม sequence ใหม่
  for (int i = 0; i < MAX_LEVEL; i++) {
    sequence[i] = random(NUM_BUTTONS);
  }
  
  Serial.println("New game started!");
  lastActionTime = millis();
}

void showSequence() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastActionTime >= SHOW_DURATION + GAP_DURATION) {
    // แสดง LED ใน sequence
    if (currentStep < currentLevel) {
      int ledIndex = sequence[currentStep];
      
      // เปิด LED
      digitalWrite(LED_PINS[ledIndex], HIGH);
      
      // จะปิดใน SHOW_DURATION milliseconds
      delay(SHOW_DURATION);
      digitalWrite(LED_PINS[ledIndex], LOW);
      
      currentStep++;
      lastActionTime = currentTime;
    } else {
      // แสดงครบแล้ว เปลี่ยนเป็นรอรับ input
      gameState = STATE_WAITING;
      currentStep = 0;
      Serial.println("Your turn!");
    }
  }
}

void checkInput() {
  for (int i = 0; i < NUM_BUTTONS; i++) {
    int buttonState = digitalRead(BUTTON_PINS[i]);
    
    // ตรวจจับการกด (falling edge)
    if (buttonState == LOW && lastButtonStates[i] == HIGH) {
      // กดปุ่ม i
      Serial.print("Button pressed: ");
      Serial.println(i);
      
      // แสดง feedback
      digitalWrite(LED_PINS[i], HIGH);
      delay(200);
      digitalWrite(LED_PINS[i], LOW);
      
      // ตรวจสอบความถูกต้อง
      if (i == sequence[currentStep]) {
        // ถูกต้อง!
        currentStep++;
        
        if (currentStep >= currentLevel) {
          // ผ่านครบ level นี้แล้ว
          gameState = STATE_CORRECT;
          Serial.println("Correct! Next level...");
        }
      } else {
        // ผิด!
        gameState = STATE_WRONG;
        Serial.println("Wrong! Game over.");
      }
      
      delay(50);  // debounce
    }
    
    lastButtonStates[i] = buttonState;
  }
}

void handleCorrect() {
  // แสดงอนิเมชัน "ถูก"
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < NUM_BUTTONS; j++) {
      digitalWrite(LED_PINS[j], HIGH);
    }
    delay(100);
    for (int j = 0; j < NUM_BUTTONS; j++) {
      digitalWrite(LED_PINS[j], LOW);
    }
    delay(100);
  }
  
  // เพิ่ม level
  currentLevel++;
  currentStep = 0;
  gameState = STATE_SHOWING;
  lastActionTime = millis();
  
  Serial.print("Level ");
  Serial.println(currentLevel);
}

void handleWrong() {
  // แสดงอนิเมชัน "ผิด"
  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < NUM_BUTTONS; j++) {
      digitalWrite(LED_PINS[j], HIGH);
    }
    delay(50);
    for (int j = 0; j < NUM_BUTTONS; j++) {
      digitalWrite(LED_PINS[j], LOW);
    }
    delay(50);
  }
  
  delay(2000);
  
  // เริ่มเกมใหม่
  startNewGame();
}

void loop() {
  switch (gameState) {
    case STATE_SHOWING:
      showSequence();
      break;
      
    case STATE_WAITING:
      checkInput();
      break;
      
    case STATE_CORRECT:
      handleCorrect();
      break;
      
    case STATE_WRONG:
      handleWrong();
      break;
  }
}
```

**จุดสำคัญ:**

1. **State Machine** - ใช้ enum และ switch-case จัดการสถานะ
2. **Array 2D style** - `sequence[]` เก็บลำดับ LED
3. **Random** - `random(NUM_BUTTONS)` สุ่ม 0 ถึง 2
4. **Feedback** - แสดง LED เมื่อกดปุ่ม

**ขยายความยาก:**
- เพิ่มความเร็ว (`SHOW_DURATION` ลดลงตาม level)
- เพิ่มเสียง (Buzzer)
- แสดง score บน Serial/Display

</details>

---

## 📚 สรุป

### Array

**ความหมาย:** ตัวแปรที่เก็บข้อมูลหลายค่าในชนิดเดียวกัน

**การใช้งาน:**
```cpp
const int LED_PINS[] = {25, 26, 27};
int sensorValues[10];

// เข้าถึงข้อมูล
int firstLED = LED_PINS[0];
sensorValues[5] = 100;

// ใช้กับ loop
for (int i = 0; i < 3; i++) {
  digitalWrite(LED_PINS[i], HIGH);
}
```

**ข้อดี:**
- โค้ดสั้นลง ใช้ loop ได้
- เพิ่ม/ลดข้อมูลง่าย
- สร้าง pattern ได้หลากหลาย

### Enum

**ความหมาย:** ตั้งชื่อให้กับตัวเลข เพื่อให้โค้ดอ่านง่าย

**การใช้งาน:**
```cpp
enum RGB {
  RED,    // 0
  GREEN,  // 1
  BLUE    // 2
};

// ใช้งาน
ledcWrite(PWM_CHANNELS[RED], 255);  // ชัดเจนว่าเป็นสีแดง
```

**ข้อดี:**
- อ่านง่าย เข้าใจง่าย
- ป้องกันใช้ตัวเลขผิด
- IDE แสดง autocomplete

### Array + Enum

**พลัง combo!** ใช้ร่วมกันได้อย่างลงตัว:

```cpp
enum RGB { RED, GREEN, BLUE, NUM_RGB };
const int RGB_PINS[] = {25, 26, 27};

// เข้าถึงด้วยชื่อที่มีความหมาย
digitalWrite(RGB_PINS[RED], HIGH);

// วน loop ได้
for (int i = 0; i < NUM_RGB; i++) {
  digitalWrite(RGB_PINS[i], HIGH);
}
```

### เตรียมพร้อมบทถัดไป

บทถัดไปจะเรียนเรื่อง **การแยกไฟล์ Header (.h)** เพื่อจัดระเบียบโค้ดให้เป็นระบบ แยกส่วนงานเป็นโมดูล และใช้งานซ้ำได้ง่าย!

---

---

## 🎮 โปรเจคใหญ่: Button Dash Game (เกมกดไวชนะ)

### แนวคิด

สร้างเกมแข่งขันสำหรับ 3 ผู้เล่น:
- รอสัญญาณ (LED ติดพร้อมกัน)
- กดปุ่มให้เร็วที่สุด
- คนที่กดเร็วที่สุดชนะ!

**เกมนี้ใช้:**
- ✅ Array สำหรับเก็บ pin หลายตัว
- ✅ Enum สำหรับ Game States
- ✅ millis() จัดการ timing
- ✅ Function แยกโค้ดเป็นส่วนๆ
- ⭐ **Bonus:** `tone()` สำหรับเสียง (เรียนในบทหลัง)
- ⭐ **Bonus:** Score tracking หลายรอบ

<details markdown="1">
<summary>🔌 ต่อวงจร</summary>

**อุปกรณ์:**
- ESP32 x 1
- Push Button x 3 (สำหรับผู้เล่น 3 คน)
- LED x 6 (แต่ละคน 2 ดวง: LED สัญญาณ + LED ชนะ)
- Buzzer x 1 (optional)
- Resistor 220Ω x 6 (สำหรับ LED)

**การต่อ:**
```
Player 1:
  Button → GPIO 16 (INPUT_PULLUP)
  LED    → GPIO 17
  Winner → GPIO 18

Player 2:
  Button → GPIO 19 (INPUT_PULLUP)
  LED    → GPIO 21
  Winner → GPIO 22

Player 3:
  Button → GPIO 23 (INPUT_PULLUP)
  LED    → GPIO 25
  Winner → GPIO 26

Buzzer → GPIO 27 (optional)
```

</details>

### โค้ดเกม

```cpp
#include <Arduino.h>

// ====== Pin Configuration (ใช้ Array!) ======
enum Player {
  PLAYER_1,
  PLAYER_2,
  PLAYER_3,
  NUM_PLAYERS
};

const int BUTTON_PINS[] = {16, 19, 23};
const int LED_PINS[] = {17, 21, 25};
const int WINNER_LED_PINS[] = {18, 22, 26};
const int BUZZER_PIN = 27;

// ====== Game States (ใช้ Enum!) ======
enum GameState {
  WAITING_TO_START,
  COUNTDOWN,
  REACTION_PHASE,
  GAME_OVER
};

GameState currentState = WAITING_TO_START;

// ====== Game Variables ======
unsigned long gameStartTime = 0;
unsigned long reactionStartTime = 0;
unsigned long reactionTimes[NUM_PLAYERS] = {0, 0, 0};
bool playerPressed[NUM_PLAYERS] = {false, false, false};
int winnerIndex = -1;
int roundNumber = 0;
int roundsToPlay = 5;
int scores[NUM_PLAYERS] = {0, 0, 0};

// Timing
const unsigned long MIN_DELAY = 2000;  // 2 วินาที
const unsigned long MAX_DELAY = 5000;  // 5 วินาที
unsigned long randomDelay;

// False starts
bool falseStart = false;
int falseStartPlayer = -1;

// ====== Function Prototypes ======
void handleWaitingState();
void resetRound();
void startNewRound();
void handleCountdownState();
void checkForFalseStarts();
void handleFalseStart();
void handleReactionPhase();
void processPlayerReaction(int playerIndex);
void determineWinner();
void displayResults();
void handleGameOverState();
void playTone(int frequency, int duration);
void playVictorySound();

void setup() {
  Serial.begin(115200);
  Serial.println("╔════════════════════════════╗");
  Serial.println("║  Button Dash Game (กดไวชนะ) ║");
  Serial.println("╚════════════════════════════╝");
  Serial.println("Press any button to start!\n");
  
  // ตั้งค่า pins ด้วย loop (ใช้ Array!)
  for (int i = 0; i < NUM_PLAYERS; i++) {
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);
    pinMode(LED_PINS[i], OUTPUT);
    pinMode(WINNER_LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
    digitalWrite(WINNER_LED_PINS[i], LOW);
  }
  
  pinMode(BUZZER_PIN, OUTPUT);
  randomSeed(analogRead(34));  // สุ่มจาก noise
}

void loop() {
  // State Machine (ใช้ Enum!)
  switch (currentState) {
    case WAITING_TO_START:
      handleWaitingState();
      break;
      
    case COUNTDOWN:
      handleCountdownState();
      break;
      
    case REACTION_PHASE:
      handleReactionPhase();
      break;
      
    case GAME_OVER:
      handleGameOverState();
      break;
  }
}

void handleWaitingState() {
  // เช็คว่ามีใครกดปุ่มเพื่อเริ่มเกม
  for (int i = 0; i < NUM_PLAYERS; i++) {
    if (digitalRead(BUTTON_PINS[i]) == LOW) {
      delay(300);  // debounce
      resetRound();
      startNewRound();
      break;
    }
  }
}

void resetRound() {
  // รีเซ็ตตัวแปรทั้งหมด
  for (int i = 0; i < NUM_PLAYERS; i++) {
    reactionTimes[i] = 0;
    playerPressed[i] = false;
    digitalWrite(LED_PINS[i], LOW);
    digitalWrite(WINNER_LED_PINS[i], LOW);
  }
  
  winnerIndex = -1;
  falseStart = false;
  falseStartPlayer = -1;
}

void startNewRound() {
  roundNumber++;
  Serial.print("\n>>> Round ");
  Serial.print(roundNumber);
  Serial.println(" <<<");
  Serial.println("Wait for the lights...");
  
  randomDelay = random(MIN_DELAY, MAX_DELAY);
  
  // เสียงเริ่มเกม
  playTone(1000, 200);
  delay(300);
  playTone(1500, 200);
  
  currentState = COUNTDOWN;
  gameStartTime = millis();
}

void handleCountdownState() {
  checkForFalseStarts();
  
  if (falseStart) {
    handleFalseStart();
    return;
  }
  
  // ถึงเวลาแล้ว → เปิด LED ทั้งหมด
  if (millis() - gameStartTime >= randomDelay) {
    for (int i = 0; i < NUM_PLAYERS; i++) {
      digitalWrite(LED_PINS[i], HIGH);
    }
    
    playTone(2000, 200);  // เสียง "GO!"
    reactionStartTime = millis();
    currentState = REACTION_PHASE;
    
    Serial.println("GO! Press your button now!");
  }
}

void checkForFalseStarts() {
  for (int i = 0; i < NUM_PLAYERS; i++) {
    if (digitalRead(BUTTON_PINS[i]) == LOW && !playerPressed[i]) {
      falseStart = true;
      falseStartPlayer = i;
      break;
    }
  }
}

void handleFalseStart() {
  // แสดง LED ของคนที่กดเร็วเกินไป
  for (int i = 0; i < NUM_PLAYERS; i++) {
    digitalWrite(LED_PINS[i], (i == falseStartPlayer) ? HIGH : LOW);
  }
  
  playTone(300, 500);  // เสียงผิดพลาด
  
  Serial.print("❌ FALSE START! Player ");
  Serial.print(falseStartPlayer + 1);
  Serial.println(" pressed too early!");
  
  delay(2000);
  
  // ปิด LED ทั้งหมด
  for (int i = 0; i < NUM_PLAYERS; i++) {
    digitalWrite(LED_PINS[i], LOW);
  }
  
  // เช็คว่าเล่นครบหรือยัง
  if (roundNumber >= roundsToPlay) {
    currentState = GAME_OVER;
  } else {
    currentState = WAITING_TO_START;
  }
}

void handleReactionPhase() {
  // เช็คทุกคนว่ากดปุ่มหรือยัง
  for (int i = 0; i < NUM_PLAYERS; i++) {
    if (digitalRead(BUTTON_PINS[i]) == LOW && !playerPressed[i]) {
      playerPressed[i] = true;
      reactionTimes[i] = millis() - reactionStartTime;
      digitalWrite(LED_PINS[i], LOW);  // ปิด LED หลังกด
      processPlayerReaction(i);
    }
  }
  
  // เช็คว่าทุกคนกดแล้วหรือยัง หรือหมดเวลา 3 วินาที
  bool allPressed = true;
  for (int i = 0; i < NUM_PLAYERS; i++) {
    if (!playerPressed[i]) allPressed = false;
  }
  
  if (allPressed || (millis() - reactionStartTime > 3000)) {
    determineWinner();
    displayResults();
    
    delay(3000);
    
    // ปิด Winner LED
    for (int i = 0; i < NUM_PLAYERS; i++) {
      digitalWrite(WINNER_LED_PINS[i], LOW);
    }
    
    // เช็คว่าเล่นครบหรือยัง
    if (roundNumber >= roundsToPlay) {
      currentState = GAME_OVER;
    } else {
      currentState = WAITING_TO_START;
    }
  }
}

void processPlayerReaction(int playerIndex) {
  // เสียงต่างกันแต่ละคน
  playTone(1000 + playerIndex * 400, 100);
  
  Serial.print("Player ");
  Serial.print(playerIndex + 1);
  Serial.print(" → ");
  Serial.print(reactionTimes[playerIndex]);
  Serial.println(" ms");
}

void determineWinner() {
  unsigned long fastestTime = UINT32_MAX;
  
  // หาคนที่กดเร็วที่สุด
  for (int i = 0; i < NUM_PLAYERS; i++) {
    if (playerPressed[i] && reactionTimes[i] > 0 && 
        reactionTimes[i] < fastestTime) {
      fastestTime = reactionTimes[i];
      winnerIndex = i;
    }
  }
  
  // เพิ่มคะแนน
  if (winnerIndex >= 0) {
    scores[winnerIndex]++;
  }
}

void displayResults() {
  // ปิด LED สัญญาณทั้งหมด
  for (int i = 0; i < NUM_PLAYERS; i++) {
    digitalWrite(LED_PINS[i], LOW);
  }
  
  // เปิด Winner LED
  if (winnerIndex >= 0) {
    digitalWrite(WINNER_LED_PINS[winnerIndex], HIGH);
    playVictorySound();
    
    Serial.print("\n🏆 Winner: Player ");
    Serial.print(winnerIndex + 1);
    Serial.print(" with ");
    Serial.print(reactionTimes[winnerIndex]);
    Serial.println(" ms");
  } else {
    Serial.println("⚠️  No winner this round");
    playTone(300, 500);
  }
  
  // แสดงคะแนนปัจจุบัน
  Serial.print("Scores: ");
  for (int i = 0; i < NUM_PLAYERS; i++) {
    Serial.print("P");
    Serial.print(i + 1);
    Serial.print("=");
    Serial.print(scores[i]);
    if (i < NUM_PLAYERS - 1) Serial.print(" | ");
  }
  Serial.println("\n");
}

void handleGameOverState() {
  Serial.println("\n╔═══════════════════════╗");
  Serial.println("║     GAME OVER!        ║");
  Serial.println("╚═══════════════════════╝");
  Serial.println("Final Scores:");
  
  for (int i = 0; i < NUM_PLAYERS; i++) {
    Serial.print("  Player ");
    Serial.print(i + 1);
    Serial.print(": ");
    Serial.print(scores[i]);
    Serial.println(" wins");
  }
  
  // หาผู้ชนะ
  int overallWinner = -1;
  int highestScore = -1;
  bool tie = false;
  
  for (int i = 0; i < NUM_PLAYERS; i++) {
    if (scores[i] > highestScore) {
      highestScore = scores[i];
      overallWinner = i;
      tie = false;
    } else if (scores[i] == highestScore && highestScore > 0) {
      tie = true;
    }
  }
  
  // แสดงผลชนะ
  if (!tie && overallWinner >= 0) {
    Serial.print("\n🎉 Overall Winner: Player ");
    Serial.println(overallWinner + 1);
    
    // กระพริบ LED ชนะ 5 ครั้ง
    for (int i = 0; i < 5; i++) {
      digitalWrite(WINNER_LED_PINS[overallWinner], HIGH);
      playTone(1500 + i * 100, 100);
      delay(200);
      digitalWrite(WINNER_LED_PINS[overallWinner], LOW);
      delay(200);
    }
  } else {
    Serial.println("\n🤝 It's a tie!");
    
    // กระพริบ LED ทั้งหมด
    for (int i = 0; i < 5; i++) {
      for (int j = 0; j < NUM_PLAYERS; j++) {
        digitalWrite(WINNER_LED_PINS[j], HIGH);
      }
      playTone(1000, 100);
      delay(200);
      for (int j = 0; j < NUM_PLAYERS; j++) {
        digitalWrite(WINNER_LED_PINS[j], LOW);
      }
      delay(200);
    }
  }
  
  // รีเซ็ตเกม
  roundNumber = 0;
  for (int i = 0; i < NUM_PLAYERS; i++) {
    scores[i] = 0;
  }
  
  Serial.println("\nPress any button to start a new game");
  currentState = WAITING_TO_START;
}

// ====== Helper Functions ======

void playTone(int frequency, int duration) {
  // ใช้ tone() สร้างเสียง (เรียนในบทหลัง)
  tone(BUZZER_PIN, frequency, duration);
}

void playVictorySound() {
  playTone(1000, 100);
  delay(100);
  playTone(1500, 100);
  delay(100);
  playTone(2000, 200);
}
```

<details markdown="1">
<summary>🎮 วิธีเล่น</summary>

**เริ่มเกม:**
1. กดปุ่มใดก็ได้เพื่อเริ่ม
2. เกมจะเล่น 5 รอบ

**แต่ละรอบ:**
1. รอสัญญาณ 2-5 วินาที (สุ่ม)
2. LED ทั้งหมดติด + มีเสียง "GO!"
3. กดปุ่มให้เร็วที่สุด!
4. ผู้ที่กดเร็วที่สุดได้ 1 คะแนน

**ระวัง False Start!**
- ถ้ากดก่อน LED ติด = ผิด ไม่ได้คะแนน

**ผลลัพธ์:**
- หลัง 5 รอบ จะประกาศผู้ชนะ
- LED ชนะจะกระพริบ

</details>

<details markdown="1">
<summary>💡 จุดสำคัญของโค้ด</summary>

**1. ใช้ Array เก็บ pins**
```cpp
const int BUTTON_PINS[] = {16, 19, 23};
const int LED_PINS[] = {17, 21, 25};

// ตั้งค่าพร้อมกันด้วย loop
for (int i = 0; i < NUM_PLAYERS; i++) {
  pinMode(BUTTON_PINS[i], INPUT_PULLUP);
  pinMode(LED_PINS[i], OUTPUT);
}
```

**2. ใช้ Enum แทนตัวเลข**
```cpp
enum GameState {
  WAITING_TO_START,
  COUNTDOWN,
  REACTION_PHASE,
  GAME_OVER
};

// อ่านง่าย เข้าใจชัดเจน!
currentState = COUNTDOWN;
```

**3. ใช้ Enum นับจำนวน**
```cpp
enum Player {
  PLAYER_1,
  PLAYER_2,
  PLAYER_3,
  NUM_PLAYERS  // = 3 อัตโนมัติ!
};

// ใช้ใน loop
for (int i = 0; i < NUM_PLAYERS; i++) {
  // ...
}
```

**4. State Machine Pattern**
```cpp
switch (currentState) {
  case WAITING_TO_START:
    handleWaitingState();
    break;
  // ...
}
```

**5. Array สำหรับข้อมูลหลายคน**
```cpp
unsigned long reactionTimes[NUM_PLAYERS];
bool playerPressed[NUM_PLAYERS];
int scores[NUM_PLAYERS];
```

**6. ⭐ Bonus: tone() สำหรับเสียง**
```cpp
// จะเรียนในบทหลัง!
void playTone(int frequency, int duration) {
  tone(BUZZER_PIN, frequency, duration);
}
```

</details>

<details markdown="1">
<summary>🚀 ความท้าทายเพิ่มเติม</summary>

**1. เพิ่มโหมดยาก**
- ลด `MIN_DELAY` เหลือ 1 วินาที
- หรือ randomize ช่วงเวลามากขึ้น

**2. เพิ่มโหมด "Best of 10"**
```cpp
int roundsToPlay = 10;  // เปลี่ยนจาก 5 เป็น 10
```

**3. แสดงผลบน OLED Display**
- แสดงคะแนนแบบเรียลไทม์
- แสดง reaction time แต่ละคน

**4. เพิ่มโหมด "Elimination"**
- คนที่กดช้าที่สุดถูกคัดออกแต่ละรอบ
- เหลือคนสุดท้ายเป็นผู้ชนะ

**5. Save High Score**
- ใช้ EEPROM เก็บสถิติ
- แสดง "New Record!" ถ้าทำลายสถิติ

**6. เพิ่มการ calibrate**
- ปุ่มพิเศษสำหรับตั้ง `roundsToPlay`
- ตั้ง `MIN_DELAY`, `MAX_DELAY` ได้

</details>

### สรุปสิ่งที่เรียนรู้จากเกม

จากเกม Button Dash เราได้ใช้:

✅ **Array:**
- เก็บ pins หลายตัว (`BUTTON_PINS[]`, `LED_PINS[]`)
- เก็บข้อมูลหลายคน (`reactionTimes[]`, `scores[]`)
- ใช้ loop ตั้งค่าและอ่านค่าพร้อมกัน

✅ **Enum:**
- `GameState` - จัดการสถานะเกม
- `Player` - นับจำนวนผู้เล่น
- โค้ดอ่านง่าย เข้าใจชัดเจน

✅ **State Machine:**
- ใช้ `switch-case` จัดการ flow
- แยกแต่ละ state เป็น function

✅ **Function:**
- แยกโค้ดเป็นส่วนๆ อ่านง่าย
- แก้ไข debug สะดวก

⭐ **Bonus (เรียนในบทหลัง):**
- `tone()` สำหรับเสียง
- Score tracking หลายรอบ
- Random timing ที่แม่นยำ

---

**หน้าถัดไป:** [บทที่ 10: การแยกไฟล์ Header →](10-header-files.md)

**หน้าก่อน:** [← บทที่ 8: #define และ const](08-define-const.md)

**กลับหน้าแรก:** [← กลับไปหน้าหลักสูตร](../index.md)

````
