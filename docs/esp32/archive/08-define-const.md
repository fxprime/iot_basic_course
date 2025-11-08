# บทที่ 7: การใช้ #define และ const

## วัตถุประสงค์
- เข้าใจความแตกต่างระหว่าง #define และ const
- รู้จักการตั้งชื่อค่าคงที่ที่มีความหมาย
- ปรับปรุงโค้ดให้อ่านง่ายและแก้ไขสะดวก

## ทำไมต้องใช้ค่าคงที่?

### ปัญหาของการใช้ตัวเลขตรงๆ (Magic Numbers)

ลองดูโค้ดนี้:

```cpp
void setup() {
  pinMode(25, OUTPUT);
  pinMode(26, OUTPUT);
  pinMode(27, OUTPUT);
  pinMode(32, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(32) == LOW) {
    digitalWrite(25, HIGH);
    digitalWrite(26, LOW);
    digitalWrite(27, LOW);
  }
}
```

<details markdown="1">
<summary>🤔 ปัญหาของโค้ดข้างบน</summary>

**ปัญหาที่พบ:**

1. **ไม่รู้ว่าเลข 25, 26, 27 คือ pin อะไร** - ต้องดูวงจรหรือจำไว้
2. **ถ้าต้องเปลี่ยน pin** - ต้องแก้หลายจุด อาจลืมบางจุด
3. **ถ้าคนอื่นอ่าน** - จะไม่เข้าใจว่า pin นี้ทำอะไร
4. **ยากต่อการ debug** - เมื่อมีปัญหาไม่รู้ว่า pin ไหนเป็น LED หรือปุ่ม

**ตัวอย่างความผิดพลาด:**
```cpp
digitalWrite(25, HIGH);  // ต้องการเปิด LED แดง
// ... โค้ดอีก 100 บรรทัด
digitalWrite(26, HIGH);  // เปิด LED เขียว
// ... โค้ดอีก 50 บรรทัด
digitalWrite(25, LOW);   // ปิด LED... แดงใช่ไหม? 🤔
```

หลังจาก 2 สัปดาห์ กลับมาอ่านโค้ดจะจำไม่ได้!

</details>

---

## วิธีที่ 1: ใช้ #define

### แนวคิด

`#define` เป็น **preprocessor directive** (คำสั่งก่อนคอมไพล์)  
มันจะแทนที่ข้อความก่อนตอนคอมไพล์

### ไวยากรณ์

```cpp
#define ชื่อ ค่า
```

⚠️ **ข้อสังเกต:** ไม่มีเครื่องหมาย `;` ท้ายบรรทัด

### ตัวอย่างการใช้งาน

```cpp
// ====== กำหนดค่าคงที่ ======
#define LED_RED_PIN 25
#define LED_GREEN_PIN 26
#define LED_BLUE_PIN 27
#define BUTTON_PIN 32

void setup() {
  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_BLUE_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_RED_PIN, HIGH);
    digitalWrite(LED_GREEN_PIN, LOW);
    digitalWrite(LED_BLUE_PIN, LOW);
  }
}
```

<details markdown="1">
<summary>💡 ข้อดีของการใช้ #define</summary>

**1. อ่านเข้าใจง่าย**
```cpp
digitalWrite(LED_RED_PIN, HIGH);  // ชัดเจนว่าเป็น LED สีแดง
digitalWrite(25, HIGH);           // ไม่รู้ว่า 25 คืออะไร
```

**2. แก้ไขง่าย**
```cpp
// ต้องการเปลี่ยน LED แดงจาก pin 25 เป็น 33
#define LED_RED_PIN 33  // แก้แค่บรรทัดเดียว!
```

**3. ป้องกันข้อผิดพลาด**
```cpp
#define MAX_BRIGHTNESS 255

analogWrite(LED_PIN, MAX_BRIGHTNESS);     // ✅ ถูกต้อง
analogWrite(LED_PIN, MAX_BRIGHTNES);      // ❌ compiler จะเตือน!
analogWrite(LED_PIN, 255);                // ✅ คอมไพล์ได้แต่ไม่รู้ความหมาย
```

**4. ไม่กิน RAM**

เพราะเป็นการแทนที่ข้อความก่อนคอมไพล์ ไม่มีการสร้างตัวแปรจริงๆ

</details>

<details markdown="1">
<summary>⚠️ ข้อควรระวังเมื่อใช้ #define</summary>

**1. ไม่มีการตรวจสอบชนิดข้อมูล**

```cpp
#define PI 3.14
#define RADIUS 5

float area = PI * RADIUS;  // compiler ไม่รู้ว่าเป็น float หรือ int
```

**2. Macro expansion อาจทำให้เกิดข้อผิดพลาด**

```cpp
#define DOUBLE(x) x + x

int result = DOUBLE(5) * 2;  // คาดว่าได้ 20
// แต่จริงๆ ได้ 5 + 5 * 2 = 15 ❌

// แก้ไขด้วยวงเล็บ
#define DOUBLE(x) ((x) + (x))
int result = DOUBLE(5) * 2;  // ได้ (5 + 5) * 2 = 20 ✅
```

**3. ยากต่อการ debug**

เพราะ compiler แทนที่ค่าไปแล้ว ถ้าเกิด error จะบอก error ที่ค่าที่แทนมา ไม่ใช่ชื่อที่เรากำหนด

</details>

### หลักการตั้งชื่อ #define

```cpp
// ✅ ใช้ตัวพิมพ์ใหญ่ทั้งหมด คั่นด้วย underscore
#define LED_PIN 25
#define BUTTON_PRESSED LOW
#define MAX_SPEED 255

// ❌ ไม่แนะนำ
#define ledPin 25        // ตัวพิมพ์เล็ก สับสนกับตัวแปร
#define Led_Pin 25       // CamelCase ไม่ได้มาตรฐาน
#define LED-PIN 25       // ใช้ - ไม่ได้ ต้องเป็น _
```

---

## วิธีที่ 2: ใช้ const

### แนวคิด

`const` สร้าง**ตัวแปรที่เปลี่ยนค่าไม่ได้** (constant variable)  
มันคือตัวแปรจริงๆ แต่ compiler จะป้องกันไม่ให้เปลี่ยนค่า

### ไวยากรณ์

```cpp
const ชนิดข้อมูล ชื่อตัวแปร = ค่า;
```

### ตัวอย่างการใช้งาน

```cpp
// ====== กำหนดค่าคงที่ ======
const int LED_RED_PIN = 25;
const int LED_GREEN_PIN = 26;
const int LED_BLUE_PIN = 27;
const int BUTTON_PIN = 32;

const int DEBOUNCE_DELAY = 50;  // milliseconds
const float VOLTAGE_REFERENCE = 3.3;  // volts

void setup() {
  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_RED_PIN, HIGH);
  }
}
```

<details markdown="1">
<summary>💡 ข้อดีของการใช้ const</summary>

**1. มีการตรวจสอบชนิดข้อมูล**

```cpp
const int LED_PIN = 25;
const float PI = 3.14159;

// compiler รู้ว่า LED_PIN เป็น int, PI เป็น float
```

**2. ป้องกันการเปลี่ยนค่าโดยไม่ตั้งใจ**

```cpp
const int LED_PIN = 25;
LED_PIN = 26;  // ❌ Error: assignment of read-only variable
```

**3. สามารถใช้กับ array ได้**

```cpp
const int LED_PINS[] = {25, 26, 27};
const char* DAYS[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
```

**4. ง่ายต่อการ debug**

เมื่อเกิด error จะแสดงชื่อตัวแปรที่เรากำหนด

**5. Scope ที่ชัดเจน**

```cpp
void func1() {
  const int LED_PIN = 25;  // ใช้ได้แค่ใน func1
}

void func2() {
  // ไม่สามารถใช้ LED_PIN จาก func1 ได้
}
```

</details>

<details markdown="1">
<summary>⚠️ ข้อควรระวังเมื่อใช้ const</summary>

**1. ใช้ RAM เล็กน้อย**

เพราะเป็นตัวแปรจริงๆ (แต่น้อยมากจนไม่ต้องกังวล)

**2. ต้องกำหนดค่าตอน declare**

```cpp
const int LED_PIN;      // ❌ Error: ต้องกำหนดค่าทันที
const int LED_PIN = 25; // ✅ ถูกต้อง
```

**3. ไม่สามารถเปลี่ยนค่าทีหลังได้เลย**

```cpp
const int LED_PIN = 25;

void setup() {
  LED_PIN = 26;  // ❌ Error: แก้ไขไม่ได้
}
```

</details>

### หลักการตั้งชื่อ const

```cpp
// ✅ แนะนำ: ใช้ตัวพิมพ์ใหญ่ทั้งหมด (เหมือน #define)
const int LED_PIN = 25;
const float PI = 3.14159;

// ✅ หรือใช้ camelCase (สำหรับค่าที่ซับซ้อน)
const int buttonDebounceDelay = 50;
const char* wifiPassword = "mypassword123";

// ❌ ไม่แนะนำ
const int ledpin = 25;       // ตัวพิมพ์เล็กทั้งหมด
const int Led_Pin = 25;      // ผสมกันสับสน
```

---

## เปรียบเทียบ #define vs const

| หัวข้อ | #define | const |
|--------|---------|-------|
| **ชนิด** | Preprocessor directive | ตัวแปร |
| **ตรวจสอบ type** | ❌ ไม่ได้ | ✅ ได้ |
| **ใช้ RAM** | ❌ ไม่ใช้ | ✅ ใช้เล็กน้อย |
| **Scope** | Global ทั้งไฟล์ | ตาม scope ปกติ |
| **Debug** | ยาก | ง่าย |
| **Array** | ไม่ได้ | ได้ |
| **String** | ได้ (แต่ยุ่งยาก) | ง่าย |

### แนะนำการใช้งาน

```cpp
// ✅ ใช้ #define สำหรับ:
#define MAX_BUFFER_SIZE 128
#define DEBUG_MODE          // สำหรับ conditional compilation

// ✅ ใช้ const สำหรับ:
const int LED_PIN = 25;
const float VOLTAGE_DIVIDER = 0.5;
const int LED_PINS[] = {25, 26, 27};
const char* WIFI_SSID = "MyWiFi";
```

---

## 💻 แบบฝึกหัดที่ 1: ปรับปรุงโค้ดให้อ่านง่าย

### โจทย์

ปรับปรุงโค้ดนี้ให้ใช้ค่าคงที่แทนตัวเลขตรงๆ:

```cpp
void setup() {
  pinMode(25, OUTPUT);
  pinMode(26, OUTPUT);
  pinMode(32, INPUT_PULLUP);
  pinMode(33, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(32) == 0) {
    digitalWrite(25, 1);
  } else {
    digitalWrite(25, 0);
  }
  
  if (digitalRead(33) == 0) {
    digitalWrite(26, 1);
  } else {
    digitalWrite(26, 0);
  }
}
```

<details markdown="1">
<summary>✅ เฉลย</summary>

```cpp
// ====== วิธีที่ 1: ใช้ #define ======
#define LED1_PIN 25
#define LED2_PIN 26
#define BUTTON1_PIN 32
#define BUTTON2_PIN 33
#define BUTTON_PRESSED LOW
#define BUTTON_RELEASED HIGH

void setup() {
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(BUTTON1_PIN, INPUT_PULLUP);
  pinMode(BUTTON2_PIN, INPUT_PULLUP);
}

void loop() {
  // ควบคุม LED1 ด้วยปุ่ม 1
  if (digitalRead(BUTTON1_PIN) == BUTTON_PRESSED) {
    digitalWrite(LED1_PIN, HIGH);
  } else {
    digitalWrite(LED1_PIN, LOW);
  }
  
  // ควบคุม LED2 ด้วยปุ่ม 2
  if (digitalRead(BUTTON2_PIN) == BUTTON_PRESSED) {
    digitalWrite(LED2_PIN, HIGH);
  } else {
    digitalWrite(LED2_PIN, LOW);
  }
}
```

```cpp
// ====== วิธีที่ 2: ใช้ const ======
const int LED1_PIN = 25;
const int LED2_PIN = 26;
const int BUTTON1_PIN = 32;
const int BUTTON2_PIN = 33;
const int BUTTON_PRESSED = LOW;
const int BUTTON_RELEASED = HIGH;

void setup() {
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(BUTTON1_PIN, INPUT_PULLUP);
  pinMode(BUTTON2_PIN, INPUT_PULLUP);
}

void loop() {
  // ควบคุม LED1 ด้วยปุ่ม 1
  if (digitalRead(BUTTON1_PIN) == BUTTON_PRESSED) {
    digitalWrite(LED1_PIN, HIGH);
  } else {
    digitalWrite(LED1_PIN, LOW);
  }
  
  // ควบคุม LED2 ด้วยปุ่ม 2
  if (digitalRead(BUTTON2_PIN) == BUTTON_PRESSED) {
    digitalWrite(LED2_PIN, HIGH);
  } else {
    digitalWrite(LED2_PIN, LOW);
  }
}
```

**สังเกต:**
- ใช้ชื่อที่มีความหมาย: `LED1_PIN`, `BUTTON1_PIN`
- ใช้ `BUTTON_PRESSED` แทน `LOW` เพื่อความชัดเจน
- โค้ดอ่านเข้าใจง่ายขึ้นมาก!

</details>

---

## 💻 แบบฝึกหัดที่ 2: PWM และ RGB LED

### โจทย์

สร้างโปรแกรมควบคุม RGB LED ด้วย PWM โดย:
- กำหนด pin ของ LED แต่ละสีเป็นค่าคงที่
- กำหนดค่า PWM channel และ frequency เป็นค่าคงที่
- กำหนดสีที่ชอบเป็นค่าคงที่ (เช่น สีม่วง = Red + Blue)

```cpp
void setup() {
  ledcSetup(0, 5000, 8);
  ledcSetup(1, 5000, 8);
  ledcSetup(2, 5000, 8);
  
  ledcAttachPin(25, 0);
  ledcAttachPin(26, 1);
  ledcAttachPin(27, 2);
}

void loop() {
  // สีม่วง
  ledcWrite(0, 128);  // Red
  ledcWrite(1, 0);    // Green
  ledcWrite(2, 128);  // Blue
  delay(1000);
  
  // สีส้ม
  ledcWrite(0, 255);  // Red
  ledcWrite(1, 165);  // Green
  ledcWrite(2, 0);    // Blue
  delay(1000);
}
```

<details markdown="1">
<summary>✅ เฉลย</summary>

```cpp
// ====== Pin definitions ======
const int RED_PIN = 25;
const int GREEN_PIN = 26;
const int BLUE_PIN = 27;

// ====== PWM settings ======
const int RED_CHANNEL = 0;
const int GREEN_CHANNEL = 1;
const int BLUE_CHANNEL = 2;
const int PWM_FREQ = 5000;
const int PWM_RESOLUTION = 8;

// ====== Color definitions ======
// สีม่วง (Purple)
const int PURPLE_R = 128;
const int PURPLE_G = 0;
const int PURPLE_B = 128;

// สีส้ม (Orange)
const int ORANGE_R = 255;
const int ORANGE_G = 165;
const int ORANGE_B = 0;

// สีฟ้า (Cyan)
const int CYAN_R = 0;
const int CYAN_G = 255;
const int CYAN_B = 255;

void setup() {
  // ตั้งค่า PWM channels
  ledcSetup(RED_CHANNEL, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(GREEN_CHANNEL, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(BLUE_CHANNEL, PWM_FREQ, PWM_RESOLUTION);
  
  // เชื่อม pins กับ channels
  ledcAttachPin(RED_PIN, RED_CHANNEL);
  ledcAttachPin(GREEN_PIN, GREEN_CHANNEL);
  ledcAttachPin(BLUE_PIN, BLUE_CHANNEL);
}

void setColor(int r, int g, int b) {
  ledcWrite(RED_CHANNEL, r);
  ledcWrite(GREEN_CHANNEL, g);
  ledcWrite(BLUE_CHANNEL, b);
}

void loop() {
  // แสดงสีม่วง
  setColor(PURPLE_R, PURPLE_G, PURPLE_B);
  delay(1000);
  
  // แสดงสีส้ม
  setColor(ORANGE_R, ORANGE_G, ORANGE_B);
  delay(1000);
  
  // แสดงสีฟ้า
  setColor(CYAN_R, CYAN_G, CYAN_B);
  delay(1000);
}
```

**ข้อดี:**
- อ่านง่าย: `setColor(PURPLE_R, PURPLE_G, PURPLE_B)` ชัดเจนว่าเป็นสีม่วง
- แก้ไขง่าย: ต้องการเปลี่ยนสีม่วง แก้แค่ที่ define ไว้
- ขยายง่าย: อยากเพิ่มสีใหม่ แค่ define ค่าใหม่

**ปรับปรุงเพิ่มเติม:** สามารถใช้ `struct` เก็บสีได้ (จะเรียนในบทถัดไป)

</details>

---

## 💻 แบบฝึกหัดที่ 3: Traffic Light

### โจทย์

สร้างโปรแกรมจำลองไฟจราจร มี 3 สถานะ:
- แดง: 5 วินาที
- เหลือง: 2 วินาที  
- เขียว: 5 วินาที

ให้ใช้ค่าคงที่สำหรับ:
- Pin ของ LED แต่ละสี
- เวลาของแต่ละสถานะ
- สถานะของ LED (ON/OFF)

<details markdown="1">
<summary>✅ เฉลย</summary>

```cpp
// ====== Pin Configuration ======
const int RED_LED = 25;
const int YELLOW_LED = 26;
const int GREEN_LED = 27;

// ====== Timing Configuration (milliseconds) ======
const int RED_DURATION = 5000;
const int YELLOW_DURATION = 2000;
const int GREEN_DURATION = 5000;

// ====== LED States ======
const int LED_ON = HIGH;
const int LED_OFF = LOW;

void setup() {
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  
  // เริ่มต้นปิด LED ทั้งหมด
  digitalWrite(RED_LED, LED_OFF);
  digitalWrite(YELLOW_LED, LED_OFF);
  digitalWrite(GREEN_LED, LED_OFF);
}

void setTrafficLight(int red, int yellow, int green) {
  digitalWrite(RED_LED, red);
  digitalWrite(YELLOW_LED, yellow);
  digitalWrite(GREEN_LED, green);
}

void loop() {
  // สถานะ 1: ไฟแดง
  setTrafficLight(LED_ON, LED_OFF, LED_OFF);
  delay(RED_DURATION);
  
  // สถานะ 2: ไฟเหลือง
  setTrafficLight(LED_OFF, LED_ON, LED_OFF);
  delay(YELLOW_DURATION);
  
  // สถานะ 3: ไฟเขียว
  setTrafficLight(LED_OFF, LED_OFF, LED_ON);
  delay(GREEN_DURATION);
  
  // กะพริบเหลืองก่อนกลับเป็นแดง
  setTrafficLight(LED_OFF, LED_ON, LED_OFF);
  delay(500);
  setTrafficLight(LED_OFF, LED_OFF, LED_OFF);
  delay(500);
}
```

**ข้อดีเพิ่มเติม:**

1. **ปรับเวลาง่าย** - แก้แค่ที่ define ไว้
   ```cpp
   const int RED_DURATION = 10000;  // เปลี่ยนเป็น 10 วินาที
   ```

2. **เพิ่มสถานะใหม่ได้ง่าย**
   ```cpp
   // เพิ่มโหมดกลางคืน (กะพริบเหลือง)
   const int NIGHT_MODE_BLINK = 1000;
   ```

3. **อ่านโค้ดเข้าใจง่าย**
   ```cpp
   setTrafficLight(LED_ON, LED_OFF, LED_OFF);  // ชัดเจนว่าเปิดแดง
   ```

</details>

---

## 📚 สรุป

### สิ่งที่ได้เรียนรู้

1. **#define** - Preprocessor directive แทนที่ข้อความก่อนคอมไพล์
   - ไม่ใช้ RAM
   - ไม่ตรวจสอบชนิดข้อมูล
   - เหมาะสำหรับค่าคงที่ง่ายๆ

2. **const** - ตัวแปรที่เปลี่ยนค่าไม่ได้
   - ใช้ RAM เล็กน้อย
   - ตรวจสอบชนิดข้อมูล
   - ใช้ได้กับ array และ string
   - แนะนำสำหรับโปรเจค ESP32

3. **ประโยชน์ของค่าคงที่**
   - โค้ดอ่านง่าย เข้าใจง่าย
   - แก้ไขสะดวก (แก้ที่เดียวได้ทั้งหมด)
   - ลดความผิดพลาด
   - ง่ายต่อการ maintain

### แนวทางการใช้งาน

```cpp
// ✅ สำหรับ ESP32 แนะนำใช้ const
const int LED_PIN = 25;
const float VOLTAGE = 3.3;
const char* WIFI_SSID = "MyNetwork";

// ✅ ใช้ #define สำหรับค่าที่ต้องการ optimize หรือ conditional compilation
#define DEBUG_MODE
#define MAX_BUFFER_SIZE 256
```

### เตรียมพร้อมบทถัดไป

บทถัดไปจะเรียนเรื่อง **Array และ Enum** ซึ่งจะทำให้การจัดการข้อมูลหลายๆ ค่าทำได้ง่ายและมีประสิทธิภาพมากขึ้น!

---

## 🎯 Challenge: โปรเจคไฟ RGB แบบเต็มรูปแบบ

สร้างโปรแกรมควบคุม RGB LED ที่:

1. มีปุ่ม 3 ปุ่ม สำหรับเลือกโหมด:
   - ปุ่ม 1: โหมดสีคงที่ (แสดงสีตามที่กำหนด)
   - ปุ่ม 2: โหมด Rainbow (วนสีทั้งหมด)
   - ปุ่ม 3: โหมด Breathe (ค่อยๆ สว่าง-มืด)

2. ใช้ค่าคงที่สำหรับ:
   - Pin ทั้งหมด (LED, ปุ่ม)
   - PWM settings (frequency, resolution, channels)
   - เวลาของแต่ละโหมด
   - สีต่างๆ ที่ใช้

3. เขียนให้โค้ดอ่านง่าย มีคำอธิบาย

<details markdown="1">
<summary>💡 Hint</summary>

- ใช้ตัวแปรเก็บ `currentMode` (0, 1, 2)
- ใช้ `millis()` สำหรับ timing (ไม่ใช้ `delay()`)
- แยก function สำหรับแต่ละโหมด: `showStaticColors()`, `showRainbow()`, `showBreathe()`
- ใช้ const array สำหรับเก็บสีหลายๆ สี

</details>

---

**หน้าถัดไป:** [บทที่ 9: Array และ Enum →](09-array-enum.md)

**หน้าก่อน:** [← บทที่ 7: Timing และ Library](07-timing-basics.md)

**กลับหน้าแรก:** [← กลับไปหน้าหลักสูตร](../index.md)
