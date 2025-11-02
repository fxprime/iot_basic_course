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
