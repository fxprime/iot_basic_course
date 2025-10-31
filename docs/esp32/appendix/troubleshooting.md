# Troubleshooting Checklist

Follow this checklist when students report board connection or flashing issues.

1. **USB Connectivity**
   - Confirm the cable supports data transfer.
   - Check `ls /dev/tty.*` (macOS) or `Device Manager` (Windows) for the expected port.
2. **Boot Mode**
   - Hold `BOOT` while tapping `EN` to enter the download mode.
   - Remove jumper wires from GPIOs 0, 2, 15 that might force an alternate boot path.
3. **Driver Reset**
   - Restart the IDE or run `esptool.py --chip esp32 --port <PORT> flash_id` to verify communication.
4. **Power**
   - Measure 5V and 3V3 rails with a multimeter if multiple peripherals are attached.

!!! info "Still stuck?"
    Log a note on the Tutoriaz dashboard with the exact error output so the instructor can queue a
    targeted quiz or provide a live walkthrough.
