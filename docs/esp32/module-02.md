# Module 02 · Networking Fundamentals

Module 02 introduces Wi-Fi provisioning on the ESP32 and highlights how classroom quizzes can
include networking checkpoints.

## Objectives

- Configure the ESP32 station mode with credentials provided during class.
- Implement a connection watchdog that retries gracefully on failures.
- Push telemetry to the Tutoriaz backend for verification.

## Checklist

- [ ] Update `sdkconfig` with country code and power save settings.
- [ ] Store Wi-Fi credentials securely (NVS or provisioning QR code).
- [ ] Emit status updates via `esp_event_handler_instance_register`.

## Sample Snippet

```c
static void wifi_init_sta(void) {
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    esp_netif_create_default_wifi_sta();
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    wifi_config_t wifi_config = {
        .sta = {
            .ssid = CONFIG_WIFI_SSID,
            .password = CONFIG_WIFI_PASSWORD,
            .threshold.authmode = WIFI_AUTH_WPA2_PSK,
        },
    };

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());
}
```

## Instructor Notes

- Use Tutoriaz push quizzes to confirm each student records the correct IP address.
- Encourage students to compare latency with and without power save modes enabled.
