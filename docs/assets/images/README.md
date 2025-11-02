# Image Assets

Place course diagrams, wiring photos, and other visuals in this directory. Reference them from
markdown using relative paths, for example:

# Images Folder

This folder contains images used in the course documentation.

## Required Images by Chapter

### บทที่ 1: Download IDE
- `arduino-download-page.png` - หน้าเว็บ Arduino Downloads
- `arduino-select-os.png` - การเลือก OS
- `arduino-download-button.png` - ปุ่ม Download
- `arduino-install-windows.png` - หน้าจอติดตั้ง Windows
- `arduino-install-macos.png` - การติดตั้ง macOS
- `arduino-ide-interface.png` - หน้าจอ Arduino IDE
- `arduino-verify-success.png` - การ Verify สำเร็จ

### บทที่ 2: Setup ESP32
- `esp32-board.png` - บอร์ด ESP32 DevKit
- `usb-cable.png` - สาย USB Cable
- `arduino-preferences-menu.png` - เมนู Preferences
- `arduino-board-manager-url.png` - ช่อง Board Manager URL
- `arduino-board-manager.png` - เปิด Board Manager
- `arduino-install-esp32.png` - ติดตั้ง ESP32
- `arduino-esp32-installed.png` - ติดตั้งสำเร็จ
- `esp32-connect-usb.png` - เชื่อมต่อ USB
- `arduino-select-esp32-board.png` - เลือกบอร์ด
- `arduino-select-port.png` - เลือก Port
- `arduino-uploading.png` - การ Upload
- `arduino-upload-success.png` - Upload สำเร็จ
- `esp32-serial-test.png` - Serial Monitor Output

### บทที่ 3: First Program
- `arduino-program-flow.png` - Flow chart setup -> loop
- `serial-read-basic.png` - โปรแกรมรับข้อความ
- `serial-monitor-output.png` - ผลลัพธ์ใน Serial Monitor
- `serial-monitor-loop.png` - ข้อความวนซ้ำ
- `serial-monitor-counter.png` - Counter

### บทที่ 4: Serial Monitor
- `arduino-open-serial-monitor.png` - เปิด Serial Monitor
- `serial-monitor-baud-rate.png` - ตั้งค่า Baud Rate
- `serial-test-input.png` - ผลลัพธ์การทดสอบ
- `serial-led-control.png` - ทดสอบควบคุม LED
- `serial-menu-system.png` - Menu System

### บทที่ 5: Button
- `button-components.png` - อุปกรณ์ที่ใช้
- `button-how-it-works.png` - การทำงานของปุ่มกด
- `floating-input.png` - Floating Input
- `pulldown-circuit.png` - Pull-down Circuit
- `pullup-circuit.png` - Pull-up Circuit
- `internal-pullup.png` - Internal Pull-up/down
- `button-pullup-wiring.png` - ต่อวงจร Pull-up
- `button-led-circuit.png` - ต่อวงจรปุ่ม + LED

### บทที่ 6: LED
- `led-structure.png` - LED และสัญลักษณ์
- `pwm-signal.png` - PWM Signal
- `led-fade.png` - LED ปรับความสว่าง
- `rgb-led.png` - RGB LED
- `rgb-led-wiring.png` - ต่อวงจร RGB LED
- `rgb-rainbow.png` - Rainbow Effect

## Image Guidelines

### ข้อกำหนดรูปภาพ
- **Format:** PNG (แนะนำ) หรือ JPG
- **Resolution:** 1200x800px หรือสูงกว่า
- **File Size:** ไม่เกิน 500KB ต่อรูป
- **Style:** 
  - ใช้ภาพจริงของอุปกรณ์
  - Diagram ใช้สีสันชัดเจน อ่านง่าย
  - Screenshot ใส่เส้นขอบ/highlight จุดสำคัญ

### แหล่งที่มาของรูปภาพ
1. **ถ่ายเอง** - อุปกรณ์จริง, การต่อวงจร
2. **Screenshot** - Arduino IDE, Serial Monitor
3. **สร้าง Diagram** - ใช้ Fritzing, draw.io, หรือ Figma
4. **ดาวน์โหลด** - จากเว็บไซต์ทางการ (ระบุแหล่งที่มา)

### Tools สำหรับสร้างรูป
- **Circuit Diagram:** [Fritzing](https://fritzing.org/), [CircuitJS](https://www.falstad.com/circuit/)
- **Flowchart:** [draw.io](https://app.diagrams.net/), [Excalidraw](https://excalidraw.com/)
- **Screenshot:** macOS (Cmd+Shift+4), Windows (Win+Shift+S)
- **Image Editor:** [GIMP](https://www.gimp.org/), [Photopea](https://www.photopea.com/)

## การใส่รูปในเอกสาร

```markdown
![คำอธิบายรูป](../assets/images/filename.png)
```

ตัวอย่าง:
```markdown
![รูป ESP32 DevKit](../assets/images/esp32-board.png)
```

**หมายเหตุ:** รูปที่มี `TODO:` ด้านหน้าคือรูปที่ยังไม่มี ต้องเพิ่มเข้ามาภายหลัง
