# ESP32 Pinout Reference

Use this appendix to map classroom wiring diagrams to GPIO numbers. The table focuses on the
DevKitC style board used in Tutoriaz exercises.

| Label | GPIO | Default Function | Notes |
| ----- | ---- | ---------------- | ----- |
| D0    | 23   | VSPI MOSI        | Safe for digital output |
| D1    | 22   | I2C SCL          | Shared with classroom sensors |
| D2    | 21   | I2C SDA          | Keep pull-up resistors attached |
| D3    | 19   | VSPI MISO        | Avoid boot strapping conflicts |
| D4    | 18   | VSPI SCK         | Can drive LED strips |
| EN    | —    | Enable           | Tie to 3V3 via switch |

> **Reminder:** GPIOs 0, 2, 12, and 15 influence boot mode. Do not hard-wire them without
> understanding the implications.
