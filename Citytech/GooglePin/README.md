# Citytech Google Pin (Magento 2 + Hyva + Hyva Checkout)

This module adds a Google Maps pin selector for customer address forms and checkout address forms.

## Features

- Search locations with Google Places autocomplete.
- Drag a map pin to reverse-geocode and fill address fields.
- Works on:
  - Customer address form (`customer/address/new`, `customer/address/edit`)
  - Magento checkout (`checkout/index/index`)
  - Hyva Checkout (`hyva_checkout_index_index`)

## Installation

1. Copy this module to `app/code/Citytech/GooglePin`.
2. Run:

```bash
bin/magento module:enable Citytech_GooglePin
bin/magento setup:upgrade
bin/magento cache:flush
```

## Configuration

Go to **Stores > Configuration > General > Google Pin Address** and set:

- Enable Module = Yes
- Google Maps API Key
- Default Latitude / Longitude / Zoom

> API key must allow Places API + Geocoding API.

## Notes

- The module injects a map block under the first street line field.
- It dispatches `input` and `change` events to keep Magento/Hyva reactive forms in sync.
