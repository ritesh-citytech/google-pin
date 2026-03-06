(function () {
    'use strict';

    const selectors = [
        'form#form-validate',
        'form[data-role="shipping-address-form"]',
        'form[data-role="billing-address-form"]',
        'form#co-shipping-form'
    ];

    const config = window.citytechGooglePinConfig || null;
    if (!config || !window.google || !window.google.maps) {
        return;
    }

    function getField(form, name) {
        return form.querySelector(`[name="${name}"]`);
    }

    function applyAddressComponents(form, place) {
        const components = place.address_components || [];
        const values = {
            city: '',
            postcode: '',
            country: '',
            region: '',
            streetNumber: '',
            route: ''
        };

        components.forEach((component) => {
            if (component.types.includes('locality')) values.city = component.long_name;
            if (component.types.includes('postal_code')) values.postcode = component.long_name;
            if (component.types.includes('country')) values.country = component.short_name;
            if (component.types.includes('administrative_area_level_1')) values.region = component.long_name;
            if (component.types.includes('street_number')) values.streetNumber = component.long_name;
            if (component.types.includes('route')) values.route = component.long_name;
        });

        const street = [values.streetNumber, values.route].filter(Boolean).join(' ').trim();

        const streetField = getField(form, 'street[0]');
        const cityField = getField(form, 'city');
        const postcodeField = getField(form, 'postcode');
        const countryField = getField(form, 'country_id');
        const regionField = getField(form, 'region');

        if (streetField && street) streetField.value = street;
        if (cityField && values.city) cityField.value = values.city;
        if (postcodeField && values.postcode) postcodeField.value = values.postcode;
        if (countryField && values.country) countryField.value = values.country;
        if (regionField && values.region) regionField.value = values.region;

        [streetField, cityField, postcodeField, countryField, regionField].forEach((field) => {
            if (!field) {
                return;
            }
            field.dispatchEvent(new Event('change', { bubbles: true }));
            field.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    function createMapElements(form) {
        const addressField = getField(form, 'street[0]');
        if (!addressField || form.querySelector('.citytech-googlepin-wrapper')) {
            return null;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'citytech-googlepin-wrapper';
        wrapper.style.margin = '12px 0';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Search location';
        input.className = 'input-text citytech-googlepin-search';
        input.style.width = '100%';
        input.style.marginBottom = '8px';

        const canvas = document.createElement('div');
        canvas.className = 'citytech-googlepin-map';
        canvas.style.width = '100%';
        canvas.style.height = '320px';
        canvas.style.borderRadius = '8px';
        canvas.style.border = '1px solid #d6d6d6';

        wrapper.appendChild(input);
        wrapper.appendChild(canvas);
        addressField.closest('.field, .input-box, .control')?.after(wrapper) || form.appendChild(wrapper);

        return { input, canvas };
    }

    function initForm(form) {
        const elements = createMapElements(form);
        if (!elements) {
            return;
        }

        const center = { lat: Number(config.defaultLat) || 0, lng: Number(config.defaultLng) || 0 };
        const map = new google.maps.Map(elements.canvas, {
            center,
            zoom: Number(config.defaultZoom) || 14,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });

        const marker = new google.maps.Marker({
            position: center,
            map,
            draggable: true
        });

        const geocoder = new google.maps.Geocoder();
        const autocomplete = new google.maps.places.Autocomplete(elements.input);
        autocomplete.bindTo('bounds', map);
        autocomplete.setFields(['geometry', 'address_components']);

        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            if (!position) {
                return;
            }

            geocoder.geocode({ location: position }, (results, status) => {
                if (status !== 'OK' || !results || !results.length) {
                    return;
                }
                applyAddressComponents(form, results[0]);
            });
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                return;
            }
            const position = place.geometry.location;
            map.setCenter(position);
            marker.setPosition(position);
            applyAddressComponents(form, place);
        });
    }

    function scanForms() {
        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach(initForm);
        });
    }

    document.addEventListener('DOMContentLoaded', scanForms);
    window.addEventListener('checkout:step:loaded', scanForms);
    window.addEventListener('hyva-checkout:step:loaded', scanForms);
})();
