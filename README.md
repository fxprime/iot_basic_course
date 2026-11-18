# IoT Basic Course - MkDocs Scripts

สคริปต์สำหรับรัน MkDocs documentation

## การติดตั้ง

### สร้าง Virtual Environment และติดตั้ง Dependencies

```bash
# สร้าง virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
# หรือ
.venv\Scripts\activate     # Windows

# ติดตั้ง dependencies
pip install -r requirements.txt
```

## การใช้งาน

### วิธีที่ 1: ใช้ Script (แนะนำ)

```bash
# รัน development server
./serve.sh

# Build static site
./build.sh
```

### วิธีที่ 2: Manual

```bash
# Activate virtual environment ก่อน
source .venv/bin/activate

# รัน development server
mkdocs serve

# Build static site
mkdocs build

# Deactivate virtual environment เมื่อเสร็จ
deactivate
```

## Scripts

### `serve.sh`
- ตรวจสอบและสร้าง .venv ถ้ายังไม่มี
- ติดตั้ง dependencies อัตโนมัติ
- รัน `mkdocs serve` ที่ http://127.0.0.1:8000
- รองรับ live reload (แก้ไขแล้วเห็นผลทันที)

### `build.sh`
- ตรวจสอบและสร้าง .venv ถ้ายังไม่มี
- ติดตั้ง dependencies อัตโนมัติ
- Build static site ไปที่โฟลเดอร์ `site/`
- ใช้ `--clean` เพื่อลบ build เก่าทิ้ง

## Structure

```
iot_basic_course/
├── .venv/              # Virtual environment (auto-created)
├── docs/               # Documentation source files
│   ├── index.md
│   ├── esp32/
│   └── assets/
├── site/               # Built site (auto-generated)
├── mkdocs.yml          # MkDocs configuration
├── requirements.txt    # Python dependencies
├── serve.sh           # Development server script
└── build.sh           # Build script
```

## Tips

- ใช้ `./serve.sh` เพื่อดูเอกสารขณะพัฒนา
- แก้ไข `.md` ไฟล์ใน `docs/` และดูผลแบบ real-time
- ใช้ `./build.sh` เมื่อต้องการ deploy

## ตรวจเอกสารและ Progress Tracking

คอร์สใช้รูปแบบ section registry และ `POST /api/progress` เดียวกับคอร์ส Loadcell
มี marker บนหัวข้อหลักของทั้ง 14 บท ไม่รวมหน้า Archive และ Appendix ในยอดความคืบหน้า
เมื่อหัวข้ออยู่ในพื้นที่อ่านอย่างน้อย 30% ต่อเนื่อง 1 วินาที จะบันทึกว่าอ่านแล้ว
การติดตามนี้แสดงความคืบหน้าการอ่าน ไม่ใช่คะแนนหรือผลสอบ

```bash
# สร้างทะเบียนใหม่หลังเพิ่ม ลบ หรือเปลี่ยน section marker
node generate-section-registry.js

# ตรวจทะเบียน ทดสอบ tracking และ build เพื่อตรวจรูปแบบเอกสาร
./check.sh
```

`./build.sh` และ `./serve.sh` สร้าง registry ก่อนเริ่มทำงานโดยอัตโนมัติ
ระหว่างใช้ live reload หากแก้ marker ให้รัน generator อีกครั้ง

เปิดผ่าน Tutoriaz ด้วย URL เช่น:

```text
/docs/iot_basic_course/site/esp32/01-download-ide/?user_id=USER_ID&course_id=COURSE_ID
```

ใช้ ID ผู้เรียนและคอร์สจริงจาก Tutoriaz ระบบส่ง snapshot ของทั้งคอร์ส แยกตามบท
และเก็บสำเนาใน `localStorage` ด้วย key `progress_COURSE_ID_USER_ID`
อ่านโดยไม่มี `user_id` จะบันทึกเฉพาะในเบราว์เซอร์ ไม่ส่งเข้า API
เซิร์ฟเวอร์ `mkdocs serve` อย่างเดียวไม่มี `/api/progress`; ทดสอบการบันทึกจริงผ่าน Tutoriaz
หรือใช้ชุดทดสอบใน `./check.sh` ซึ่งจำลอง API โดยไม่เขียนฐานข้อมูล

ตรวจสถานะจาก browser console ได้ด้วย:

```javascript
window.ProgressTracker.getProgress()
```

รองรับการเปลี่ยนบทแบบ instant navigation, การคืนสถานะหลัง reload,
การแยกผู้ใช้/คอร์ส และการส่ง snapshot ที่ค้างอีกครั้งเมื่อกลับมาออนไลน์
iframe ใช้ข้อความ `SET_USER_ID`, `SET_COURSE_ID`, `GET_PROGRESS` และ `TRIGGER_QUIZ`
รูปแบบเดียวกับ Loadcell โดยรับข้อความจาก parent ที่อยู่ origin เดียวกัน
เมื่อ API ส่ง `triggerQuiz: true` จะส่งข้อความให้ parent และ event `progressQuizTrigger`

การแสดงสมการใช้ Arithmatex และ MathJax ตาม
[คู่มือ Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/math/)
รวมถึงการเรนเดอร์ใหม่เมื่อเปลี่ยนบทโดยไม่ reload หน้า

## Troubleshooting

### Script ไม่สามารถรันได้
```bash
chmod +x serve.sh build.sh
```

### Dependencies ติดตั้งไม่สำเร็จ
```bash
# อัพเดท pip
pip install --upgrade pip

# ติดตั้งใหม่
pip install -r requirements.txt
```

### Port 8000 ถูกใช้งานอยู่
```bash
# ระบุ port อื่น
mkdocs serve -a 127.0.0.1:8001
```
