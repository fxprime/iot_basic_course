# บทที่ 6: LED - การควบคุมความสว่างและสี

ในบทนี้เราจะเรียนรู้การควบคุม LED ขั้นสูง รวมถึงการปรับความสว่างด้วย PWM และการควบคุม RGB LED

## วัตถุประสงค์
- เข้าใจการทำงานของ LED
- ใช้ PWM ปรับความสว่าง LED
- ควบคุม RGB LED เปลี่ยนสี
- สร้างเอฟเฟกต์แสงต่างๆ

---

## ขั้นตอนที่ 1: ทบทวน LED พื้นฐาน

### 1.1 LED คืออะไร?

**LED (Light Emitting Diode)** = ไดโอดเปล่งแสง

![รูป LED และสัญลักษณ์](../assets/images/led-structure.png)
 

**ส่วนประกอบ:**
- **Anode (+)** - ขาบวก (ขายาว)
- **Cathode (-)** - ขาลบ (ขาสั้น)

<details markdown="1">
<summary>📖 <b>หลักการทำงานของ LED</b></summary>

### LED ทำงานอย่างไร?

LED เป็น **Diode** ชนิดหนึ่ง:
- ต่อขั้วถูก (Forward Bias) → ไฟติด
- ต่อขั้วผิด (Reverse Bias) → ไฟไม่ติด

```
ถูกต้อง:
3.3V ────[470Ω]────|>|──── GND
       (Resistor) (LED)

ผิด:
3.3V ────|<|────[470Ω]──── GND
       (LED)   (Resistor)
       ↑ ไฟไม่ติด
```

### ทำไมต้องใช้ Resistor?

LED ต้องการกระแส **จำกัด** (ประมาณ 20mA):
- ไม่มี Resistor → กระแสไหลมากเกิน → LED ไหม้
- มี Resistor → จำกัดกระแส → LED ปลอดภัย

**การคำนวณ Resistor:**
```
R = (Vsource - VLED) / ILED

ตัวอย่าง:
Vsource = 3.3V
VLED = 2V (LED แดง)
ILED = 20mA = 0.02A

R = (3.3 - 2) / 0.02 = 65Ω
ใช้ 100Ω หรือ 470Ω ก็ได้ (ความสว่างลดลงนิดหน่อย)
```

### สี LED กับแรงดันตก

| สี LED | แรงดันตก (V) |
|--------|--------------|
| แดง    | 1.8 - 2.2    |
| เขียว  | 2.0 - 3.0    |
| น้ำเงิน| 3.0 - 3.4    |
| ขาว    | 3.0 - 3.6    |
| เหลือง | 2.0 - 2.4    |

</details>

### 1.2 ทบทวนการควบคุม LED แบบ ON/OFF

```cpp
#define LED_PIN 2

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);  // เปิด LED
  delay(1000);
  digitalWrite(LED_PIN, LOW);   // ปิด LED
  delay(1000);
}
```

---

## ขั้นตอนที่ 2: PWM - ปรับความสว่าง LED

### 2.1 PWM คืออะไร?

**PWM (Pulse Width Modulation)** = การปรับความกว้างของพัลส์


**หลักการ:**
- เปิด-ปิด LED **เร็วมาก** (หลายพันครั้งต่อวินาที)
- ตาเราเห็นเป็นความสว่างต่างกัน

<details markdown="1">
<summary>📖 <b>PWM ทำงานอย่างไร?</b></summary>

### Duty Cycle

**Duty Cycle** = เปอร์เซ็นต์ของเวลาที่เป็น HIGH
 
![รูป PWM Signal, Ref : https://medium.com/icreativesystems/to-know-pwm-373efa1322ce](../assets/images/pwm-signal.png)


### ใน ESP32

- ESP32 มี PWM 16 ช่อง
- ความละเอียด: 8-bit (0-255) หรือ 16-bit (0-65535)
- ความถี่: ตั้งได้ (โดยทั่วไปใช้ 5000 Hz)

**ค่า PWM:**
- 0 = ปิดทั้งหมด (0%)
- 128 = สว่างครึ่งหนึ่ง (50%)
- 255 = สว่างเต็มที่ (100%)

</details>

### 2.2 ตั้งค่า PWM บน ESP32

```cpp
#define LED_PIN 2

// ตั้งค่า PWM
const int freq = 5000;      // ความถี่ 5000 Hz
const int resolution = 8;   // ความละเอียด 8-bit (0-255)

void setup() {
  Serial.begin(115200);
  
  // ตั้งค่า PWM: ledcAttach(pin, freq, resolution)
  ledcAttach(LED_PIN, freq, resolution);
  
  Serial.println("=== PWM LED Control ===");
}

void loop() {
  // ค่อยๆ สว่างขึ้น (Fade In)
  for (int brightness = 0; brightness <= 255; brightness++) {
    ledcWrite(LED_PIN, brightness);  // ใช้ pin โดยตรง
    delay(10);
  }
  
  // ค่อยๆ มืดลง (Fade Out)
  for (int brightness = 255; brightness >= 0; brightness--) {
    ledcWrite(LED_PIN, brightness);  // ใช้ pin โดยตรง
    delay(10);
  }
}
```

![รูป LED ปรับความสว่าง](../assets/images/led-fade.png)
 

<details markdown="1">
<summary>📖 <b>PWM Functions บน ESP32</b></summary>

### `ledcAttach(pin, freq, resolution)`
ตั้งค่า PWM บน GPIO pin (API ใหม่ - Arduino Core 3.x+)

**Parameters:**
- `pin` - หมายเลข GPIO
- `freq` - ความถี่ในหน่วย Hz
- `resolution` - ความละเอียด (1-16 bit)

**Return:** `true` = สำเร็จ, `false` = ล้มเหลว

```cpp
ledcAttach(2, 5000, 8);  // GPIO 2, 5kHz, 8-bit
```

### `ledcWrite(pin, dutyCycle)`
เขียนค่า PWM

```cpp
ledcWrite(2, 128);  // GPIO 2, Duty = 128 (50%)
```

### `ledcDetach(pin)`
ยกเลิก PWM บน GPIO

```cpp
ledcDetach(2);
```

### `ledcRead(pin)`
อ่านค่า PWM ปัจจุบัน

```cpp
int value = ledcRead(2);
```

### `ledcReadFreq(pin)`
อ่านค่าความถี่ที่ตั้งไว้

```cpp
uint32_t freq = ledcReadFreq(2);
```

### ตัวอย่างการใช้หลาย LED

```cpp
// LED 1
ledcAttach(2, 5000, 8);

// LED 2
ledcAttach(4, 5000, 8);

// ควบคุม
ledcWrite(2, 100);  // LED 1 สว่าง 39%
ledcWrite(4, 200);  // LED 2 สว่าง 78%
```

### API เก่า (Arduino Core 2.x)

หากใช้เวอร์ชันเก่า จะใช้ `ledcSetup()` และ `ledcAttachPin()`:

```cpp
// API เก่า (ไม่แนะนำแล้ว)
ledcSetup(0, 5000, 8);      // channel, freq, resolution
ledcAttachPin(2, 0);        // pin, channel
ledcWrite(0, 128);          // channel, duty
```

</details>

### 2.3 โปรแกรมควบคุมความสว่างด้วย Serial

```cpp
#define LED_PIN 2

void setup() {
  Serial.begin(115200);
  ledcAttach(LED_PIN, 5000, 8);
  
  Serial.println("=== LED Brightness Control ===");
  Serial.println("Enter brightness (0-255):");
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    int brightness = input.toInt();
    
    // ตรวจสอบช่วงค่า
    if (brightness >= 0 && brightness <= 255) {
      ledcWrite(LED_PIN, brightness);
      Serial.print("Brightness set to: ");
      Serial.print(brightness);
      Serial.print(" (");
      Serial.print(brightness * 100 / 255);
      Serial.println("%)");
    } else {
      Serial.println("Error: Value must be 0-255");
    }
    
    Serial.println("Enter brightness (0-255):");
  }
}
```

---

## ขั้นตอนที่ 3: RGB LED

### 3.1 รู้จักกับ RGB LED

**RGB LED** = LED 3 สี ในหลอดเดียว (Red, Green, Blue)

![TODO: รูป RGB LED](../assets/images/rgb-led.png)

**ประเภท:**
- **Common Cathode** - ขาลบร่วมกัน (ใช้บ่อย)
- **Common Anode** - ขาบวกร่วมกัน

<details markdown="1">
<summary>📖 <b>การผสมสี RGB</b></summary>

### สีพื้นฐาน

```
แดง   = (255,   0,   0)
เขียว = (  0, 255,   0)
น้ำเงิน= (  0,   0, 255)
```

### การผสมสี

```
เหลือง  = แดง + เขียว    = (255, 255,   0)
ฟ้า     = เขียว + น้ำเงิน  = (  0, 255, 255)
ม่วง    = แดง + น้ำเงิน    = (255,   0, 255)
ขาว     = แดง + เขียว + น้ำเงิน = (255, 255, 255)
ดำ (ปิด)= ไม่มีสี          = (  0,   0,   0)
```

### สีอื่นๆ

```
ส้ม     = (255, 165,   0)
ชมพู    = (255, 105, 180)
เขียวมรกต = (  0, 255, 128)
ฟ้าน้ำทะเล = ( 64, 224, 208)
```

### ตาราง HSV → RGB

ค้นหาได้จาก: https://www.rapidtables.com/web/color/RGB_Color.html

</details>

### 3.2 ต่อวงจร RGB LED

**วงจร (Common Cathode):**
```
ESP32
GPIO 25 ────[470Ω]──── Red   ┐
GPIO 26 ────[470Ω]──── Green ├─── GND
GPIO 27 ────[470Ω]──── Blue  ┘
```

![TODO: รูปต่อวงจร RGB LED](../assets/images/rgb-led-wiring.png)

### 3.3 โปรแกรมควบคุม RGB LED

```cpp
// RGB LED Pins
#define RED_PIN   25
#define GREEN_PIN 26
#define BLUE_PIN  27

void setup() {
  Serial.begin(115200);
  
  // ตั้งค่า PWM สำหรับแต่ละสี
  ledcAttach(RED_PIN, 5000, 8);
  ledcAttach(GREEN_PIN, 5000, 8);
  ledcAttach(BLUE_PIN, 5000, 8);
  
  Serial.println("=== RGB LED Demo ===");
}

void loop() {
  // แดง
  setColor(255, 0, 0);
  delay(1000);
  
  // เขียว
  setColor(0, 255, 0);
  delay(1000);
  
  // น้ำเงิน
  setColor(0, 0, 255);
  delay(1000);
  
  // เหลือง
  setColor(255, 255, 0);
  delay(1000);
  
  // ฟ้า
  setColor(0, 255, 255);
  delay(1000);
  
  // ม่วง
  setColor(255, 0, 255);
  delay(1000);
  
  // ขาว
  setColor(255, 255, 255);
  delay(1000);
  
  // ปิด
  setColor(0, 0, 0);
  delay(1000);
}

void setColor(int red, int green, int blue) {
  ledcWrite(RED_PIN, red);
  ledcWrite(GREEN_PIN, green);
  ledcWrite(BLUE_PIN, blue);
}
```

---

## ขั้นตอนที่ 4: เอฟเฟกต์แสงต่างๆ

### 4.1 Rainbow Effect (สีรุ้ง)

```cpp
void loop() {
  rainbowEffect();
}

void rainbowEffect() {
  // วนผ่านสีทั้งหมด
  for (int hue = 0; hue < 360; hue++) {
    // แปลง HSV เป็น RGB
    int r, g, b;
    hsvToRgb(hue, 255, 255, r, g, b);
    setColor(r, g, b);
    delay(10);
  }
}

void hsvToRgb(int h, int s, int v, int &r, int &g, int &b) {
  // แปลง HSV เป็น RGB
  // H: 0-360, S: 0-255, V: 0-255
  
  float hf = h / 60.0;
  int i = (int)hf;
  float f = hf - i;
  
  int p = v * (255 - s) / 255;
  int q = v * (255 - s * f) / 255;
  int t = v * (255 - s * (1 - f)) / 255;
  
  switch(i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    default: r = v; g = p; b = q; break;
  }
}
```

![TODO: รูป Rainbow Effect](../assets/images/rgb-rainbow.png)

### 4.2 Breathing Effect (หายใจ)

```cpp
void loop() {
  breathingEffect(255, 0, 0);  // หายใจสีแดง
  delay(500);
}

void breathingEffect(int r, int g, int b) {
  // Fade In
  for (int brightness = 0; brightness <= 255; brightness += 5) {
    setColor(r * brightness / 255, 
             g * brightness / 255, 
             b * brightness / 255);
    delay(20);
  }
  
  // Fade Out
  for (int brightness = 255; brightness >= 0; brightness -= 5) {
    setColor(r * brightness / 255, 
             g * brightness / 255, 
             b * brightness / 255);
    delay(20);
  }
}
```

### 4.3 Police Lights (ไฟกระพริบแดง-น้ำเงิน)

```cpp
void loop() {
  policeLights();
}

void policeLights() {
  // แดง
  for (int i = 0; i < 3; i++) {
    setColor(255, 0, 0);
    delay(100);
    setColor(0, 0, 0);
    delay(100);
  }
  
  delay(200);
  
  // น้ำเงิน
  for (int i = 0; i < 3; i++) {
    setColor(0, 0, 255);
    delay(100);
    setColor(0, 0, 0);
    delay(100);
  }
  
  delay(200);
}
```

### 4.4 Random Colors (สุ่มสี)

```cpp
void loop() {
  randomColors();
  delay(500);
}

void randomColors() {
  int r = random(0, 256);
  int g = random(0, 256);
  int b = random(0, 256);
  
  setColor(r, g, b);
  
  Serial.print("Color: RGB(");
  Serial.print(r); Serial.print(", ");
  Serial.print(g); Serial.print(", ");
  Serial.print(b); Serial.println(")");
}
```

---

## ขั้นตอนที่ 5: โปรเจครวม - RGB Control System

### 5.1 โปรแกรมเมนูควบคุม

```cpp
#define RED_PIN   25
#define GREEN_PIN 26
#define BLUE_PIN  27

int currentMode = 0;
int customR = 0, customG = 0, customB = 0;

void setup() {
  Serial.begin(115200);
  
  // ตั้งค่า PWM
  ledcAttach(RED_PIN, 5000, 8);
  ledcAttach(GREEN_PIN, 5000, 8);
  ledcAttach(BLUE_PIN, 5000, 8);
  
  showMenu();
}

void loop() {
  // เช็คคำสั่งจาก Serial
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    processCommand(command);
  }
  
  // รันโหมดปัจจุบัน
  switch(currentMode) {
    case 1: rainbowMode(); break;
    case 2: breathingMode(); break;
    case 3: policeMode(); break;
    case 4: randomMode(); break;
    case 5: customMode(); break;
    default: setColor(0, 0, 0); delay(100); break;
  }
}

void showMenu() {
  Serial.println("\n╔═══════════════════════════╗");
  Serial.println("║   RGB LED Control Menu    ║");
  Serial.println("╠═══════════════════════════╣");
  Serial.println("║ 0 - OFF                   ║");
  Serial.println("║ 1 - Rainbow Effect        ║");
  Serial.println("║ 2 - Breathing Effect      ║");
  Serial.println("║ 3 - Police Lights         ║");
  Serial.println("║ 4 - Random Colors         ║");
  Serial.println("║ 5 - Custom Color          ║");
  Serial.println("║ R[0-255] - Set Red        ║");
  Serial.println("║ G[0-255] - Set Green      ║");
  Serial.println("║ B[0-255] - Set Blue       ║");
  Serial.println("║ MENU - Show this menu     ║");
  Serial.println("╚═══════════════════════════╝\n");
}

void processCommand(String cmd) {
  cmd.toUpperCase();
  
  if (cmd == "MENU") {
    showMenu();
  }
  else if (cmd == "0") {
    currentMode = 0;
    setColor(0, 0, 0);
    Serial.println("✓ LED OFF");
  }
  else if (cmd == "1") {
    currentMode = 1;
    Serial.println("✓ Rainbow Mode");
  }
  else if (cmd == "2") {
    currentMode = 2;
    Serial.println("✓ Breathing Mode");
  }
  else if (cmd == "3") {
    currentMode = 3;
    Serial.println("✓ Police Lights Mode");
  }
  else if (cmd == "4") {
    currentMode = 4;
    Serial.println("✓ Random Colors Mode");
  }
  else if (cmd == "5") {
    currentMode = 5;
    Serial.println("✓ Custom Color Mode");
    Serial.println("Use R, G, B commands to set color");
  }
  else if (cmd.startsWith("R")) {
    customR = cmd.substring(1).toInt();
    customR = constrain(customR, 0, 255);
    Serial.print("✓ Red = "); Serial.println(customR);
    if (currentMode == 5) setColor(customR, customG, customB);
  }
  else if (cmd.startsWith("G")) {
    customG = cmd.substring(1).toInt();
    customG = constrain(customG, 0, 255);
    Serial.print("✓ Green = "); Serial.println(customG);
    if (currentMode == 5) setColor(customR, customG, customB);
  }
  else if (cmd.startsWith("B")) {
    customB = cmd.substring(1).toInt();
    customB = constrain(customB, 0, 255);
    Serial.print("✓ Blue = "); Serial.println(customB);
    if (currentMode == 5) setColor(customR, customG, customB);
  }
  else {
    Serial.println("✗ Unknown command");
  }
}

void setColor(int r, int g, int b) {
  ledcWrite(RED_PIN, r);
  ledcWrite(GREEN_PIN, g);
  ledcWrite(BLUE_PIN, b);
}

void rainbowMode() {
  static int hue = 0;
  int r, g, b;
  hsvToRgb(hue, 255, 255, r, g, b);
  setColor(r, g, b);
  hue = (hue + 1) % 360;
  delay(10);
}

void breathingMode() {
  static int brightness = 0;
  static int direction = 5;
  setColor(255 * brightness / 255, 0, 128 * brightness / 255);
  brightness += direction;
  if (brightness >= 255 || brightness <= 0) direction = -direction;
  delay(20);
}

void policeMode() {
  static int step = 0;
  if (step < 6) {
    setColor(255, 0, 0);
    delay(100);
    setColor(0, 0, 0);
  } else {
    setColor(0, 0, 255);
    delay(100);
    setColor(0, 0, 0);
  }
  step = (step + 1) % 12;
}

void randomMode() {
  setColor(random(256), random(256), random(256));
  delay(500);
}

void customMode() {
  setColor(customR, customG, customB);
  delay(100);
}

void hsvToRgb(int h, int s, int v, int &r, int &g, int &b) {
  // (same as before)
  float hf = h / 60.0;
  int i = (int)hf;
  float f = hf - i;
  int p = v * (255 - s) / 255;
  int q = v * (255 - s * f) / 255;
  int t = v * (255 - s * (1 - f)) / 255;
  switch(i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    default: r = v; g = p; b = q; break;
  }
}
```

---

## สรุป

ในบทนี้เราได้เรียนรู้:
- ✅ หลักการทำงานของ LED
- ✅ PWM และการปรับความสว่าง
- ✅ RGB LED และการผสมสี
- ✅ เอฟเฟกต์แสงต่างๆ
- ✅ สร้างระบบควบคุม RGB แบบสมบูรณ์

---

## แบบฝึกหัด

1. สร้างเอฟเฟกต์แสง "Sunset" (พระอาทิตย์ตก) เปลี่ยนจากส้มเป็นแดงเข้มค่อยๆ
2. เพิ่มโหมด "Candle" (เทียน) ที่ LED กระพริบแบบสุ่มเลียนแบบเปลวไฟ
3. ใช้ปุ่ม 2 ปุ่มเปลี่ยนโหมด (ปุ่ม 1 = โหมดถัดไป, ปุ่ม 2 = ปรับความสว่าง)

---

## ขั้นตอนถัดไป

ต่อไปเราจะเรียนรู้เรื่องการจัดการเวลาด้วย `millis()` และทำความเข้าใจว่าทำไม Library ถึงสำคัญ!

➡️ **[บทถัดไป: บทที่ 7 - Timing และ Library](07-timing-basics.md)**

**หน้าก่อน:** [← บทที่ 5: Button](05-button.md)

**กลับหน้าแรก:** [← กลับไปหน้าหลักสูตร](../index.md)
