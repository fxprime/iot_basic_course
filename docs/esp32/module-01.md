# Module 01 · Board Bring-up

This module prepares each student workstation with the ESP32 development environment and validates
basic GPIO output.

## Prerequisites

- USB drivers installed for the target board (CP2102 or CH340).
- Visual Studio Code with the ESP-IDF extension or PlatformIO plugin.
- Verified access to the Tutoriaz student dashboard.

## Lab Steps

1. **Identify the board**
   - Record the board revision and default boot configuration.
   - Note the USB-to-UART bridge in use.
2. **Flash a baseline blink**
   - Clone the boilerplate project supplied by your instructor.
   - Update `sdkconfig.defaults` with the correct serial port.
   - Build and flash. Confirm the onboard LED toggles at 1 Hz.
3. **Experiment with GPIO**
   - Modify the example to cycle through three LEDs using a timer interrupt.
   - Document which pins required `pinMode(..., OUTPUT)` and any pull-up resistors.

```c
// Minimal blink adapted for classroom walkthroughs
void app_main(void) {
    const gpio_num_t led = GPIO_NUM_2;
    gpio_set_direction(led, GPIO_MODE_OUTPUT);

    while (true) {
        gpio_set_level(led, 1);
        vTaskDelay(pdMS_TO_TICKS(500));
        gpio_set_level(led, 0);
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}
```

## Exit Criteria

- Students can identify their board, flash firmware, and modify pin assignments.
- The classroom dashboard shows at least one successfully completed quiz for Module 01.
