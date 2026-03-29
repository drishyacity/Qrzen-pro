document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
            this.querySelector('i').classList.toggle('fa-bars');
        });
    }

    // QR Code Generator Elements
    const qrForm = document.getElementById('qrForm');
    const qrType = document.getElementById('qrType');
    const dynamicFields = document.getElementById('dynamicFields');
    const qrSize = document.getElementById('qrSize');
    const sizeValue = document.getElementById('sizeValue');
    const qrColor = document.getElementById('qrColor');
    const qrCode = document.getElementById('qrCode');
    const downloadPNG = document.getElementById('downloadPNG');
    const downloadSVG = document.getElementById('downloadSVG');

    let currentQR = null;
    let map, marker;

    qrSize.addEventListener('input', function () {
        sizeValue.textContent = this.value;
    });

    qrType.addEventListener('change', function () {
        updateDynamicFields(this.value);
    });

    updateDynamicFields(qrType.value);

    qrForm.addEventListener('submit', function (e) {
        e.preventDefault();
        generateQRCode();
    });

    downloadPNG.addEventListener('click', downloadPNGHandler);
    downloadSVG.addEventListener('click', downloadSVGHandler);

    function isColorDark(color) {
        // Convert hex to RGB
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }

    function downloadPNGHandler() {
        if (!currentQR) return;
        
        // Create a temporary canvas with higher resolution
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const originalCanvas = qrCode.querySelector('canvas');
        
        if (!originalCanvas) return alert('No QR code found');
        
        // Set higher resolution (4x for better quality)
        const scale = 4;
        tempCanvas.width = originalCanvas.width * scale;
        tempCanvas.height = originalCanvas.height * scale;
        
        // Scale up the QR code
        tempCtx.imageSmoothingEnabled = false;
        tempCtx.drawImage(
            originalCanvas, 
            0, 0, 
            originalCanvas.width, originalCanvas.height,
            0, 0,
            tempCanvas.width, tempCanvas.height
        );
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'qrzen-pro-qr-code.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
        
        // Show download instructions
        document.getElementById('saveInstructions').style.display = 'block';
    }

    function downloadSVGHandler() {
        if (!currentQR) return;
        const svg = qrCode.querySelector('svg');
        if (!svg) return alert('No SVG QR found. Try PNG instead.');
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);
        if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
            source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<?xml version="1.0"?>\n' + source);
        const link = document.createElement('a');
        link.download = 'qr-code.svg';
        link.href = url;
        link.click();
    }

    function updateDynamicFields(type) {
        let fieldsHTML = '';

        switch (type) {
            case 'url':
                fieldsHTML = `<div class="form-group"><label for="url">Website URL:</label><input type="url" id="url" class="form-control" placeholder="https://example.com" required></div>`;
                break;

            case 'text':
                fieldsHTML = `<div class="form-group"><label for="text">Text Content:</label><textarea id="text" class="form-control" placeholder="Enter your text" required></textarea></div>`;
                break;

            case 'contact':
                fieldsHTML = `
                    <div class="form-group"><label for="contactName">Full Name:</label><input type="text" id="contactName" class="form-control" required></div>
                    <div class="form-group"><label for="contactPhone">Phone:</label><input type="tel" id="contactPhone" class="form-control"></div>
                    <div class="form-group"><label for="contactEmail">Email:</label><input type="email" id="contactEmail" class="form-control"></div>
                    <div class="form-group"><label for="contactOrg">Organization:</label><input type="text" id="contactOrg" class="form-control"></div>`;
                break;

            case 'wifi':
                fieldsHTML = `
                    <div class="form-group"><label for="wifiSSID">Network Name:</label><input type="text" id="wifiSSID" class="form-control" required></div>
                    <div class="form-group"><label for="wifiPassword">Password:</label><input type="text" id="wifiPassword" class="form-control"></div>
                    <div class="form-group"><label for="wifiType">Encryption:</label>
                    <select id="wifiType" class="form-control">
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="">None (Open)</option>
                    </select></div>`;
                break;

            case 'email':
                fieldsHTML = `
                    <div class="form-group"><label for="emailAddress">Email Address:</label><input type="email" id="emailAddress" class="form-control" required></div>
                    <div class="form-group"><label for="emailSubject">Subject:</label><input type="text" id="emailSubject" class="form-control"></div>
                    <div class="form-group"><label for="emailBody">Body:</label><textarea id="emailBody" class="form-control"></textarea></div>`;
                break;

            case 'phone':
                fieldsHTML = `<div class="form-group"><label for="phoneNumber">Phone Number:</label><input type="tel" id="phoneNumber" class="form-control" required></div>`;
                break;

            case 'sms':
                fieldsHTML = `
                    <div class="form-group"><label for="smsNumber">Phone Number:</label><input type="tel" id="smsNumber" class="form-control" required></div>
                    <div class="form-group"><label for="smsMessage">Message:</label><textarea id="smsMessage" class="form-control"></textarea></div>`;
                break;

            case 'payment':
                fieldsHTML = `
                    <div class="form-group"><label for="paymentUpi">UPI ID:</label><input type="text" id="paymentUpi" class="form-control" required></div>
                    <div class="form-group"><label for="paymentAmount">Amount:</label><input type="number" id="paymentAmount" class="form-control"></div>
                    <div class="form-group"><label for="paymentNote">Note:</label><input type="text" id="paymentNote" class="form-control"></div>`;
                break;

            case 'location':
                fieldsHTML = `
                    <div class="form-group">
                        <label>Search Location:</label>
                        <div class="map-search-container">
                            <input type="text" id="mapSearch" class="form-control" placeholder="Search for a place...">
                            <button type="button" id="searchButton" class="btn btn-small">Search</button>
                        </div>
                        <div id="map" style="height: 300px; width: 100%; margin: 15px 0;"></div>
                        <input type="hidden" id="locationLat" required>
                        <input type="hidden" id="locationLong" required>
                        <div class="form-group">
                            <label for="locationName">Location Name:</label>
                            <input type="text" id="locationName" class="form-control" required>
                        </div>
                    </div>`;
                setTimeout(initMap, 0);
                break;

            case 'social':
                fieldsHTML = `
                    <div class="form-group"><label for="socialPlatform">Platform:</label>
                    <select id="socialPlatform" class="form-control">
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                    </select></div>
                    <div class="form-group"><label for="socialUsername">Username/URL:</label><input type="text" id="socialUsername" class="form-control" required></div>`;
                break;

            default:
                fieldsHTML = `<div class="form-group"><label for="content">Content:</label><input type="text" id="content" class="form-control" required></div>`;
        }

        dynamicFields.innerHTML = fieldsHTML;
    }

    function initMap() {
        if (map) map.remove();

        map = L.map('map').setView([20.5937, 78.9629], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        marker = L.marker([20.5937, 78.9629], { draggable: true }).addTo(map);

        const searchButton = document.getElementById('searchButton');
        const mapSearch = document.getElementById('mapSearch');

        if (searchButton && mapSearch) {
            searchButton.addEventListener('click', function () {
                const query = mapSearch.value;
                if (!query) return;

                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.length > 0) {
                            const lat = parseFloat(data[0].lat);
                            const lon = parseFloat(data[0].lon);
                            map.setView([lat, lon], 15);
                            marker.setLatLng([lat, lon]);
                            document.getElementById('locationLat').value = lat;
                            document.getElementById('locationLong').value = lon;
                            document.getElementById('locationName').value = data[0].display_name;
                        } else {
                            alert('Location not found');
                        }
                    });
            });
        }

        marker.on('dragend', function () {
            const { lat, lng } = marker.getLatLng();
            document.getElementById('locationLat').value = lat;
            document.getElementById('locationLong').value = lng;
        });

        map.on('click', function (e) {
            marker.setLatLng(e.latlng);
            document.getElementById('locationLat').value = e.latlng.lat;
            document.getElementById('locationLong').value = e.latlng.lng;

            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
                .then(response => response.json())
                .then(data => {
                    if (data.display_name) {
                        document.getElementById('locationName').value = data.display_name;
                    }
                });
        });
    }

    function generateQRCode() {
        let qrContent = '';
        const type = qrType.value;

        switch (type) {
            case 'url':
                qrContent = document.getElementById('url').value.trim();
                if (!qrContent.startsWith('http')) qrContent = 'https://' + qrContent;
                break;

            case 'text':
                qrContent = document.getElementById('text').value.trim();
                break;

            case 'contact':
                qrContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${document.getElementById('contactName').value}`;
                if (document.getElementById('contactPhone').value) qrContent += `\nTEL:${document.getElementById('contactPhone').value}`;
                if (document.getElementById('contactEmail').value) qrContent += `\nEMAIL:${document.getElementById('contactEmail').value}`;
                if (document.getElementById('contactOrg').value) qrContent += `\nORG:${document.getElementById('contactOrg').value}`;
                qrContent += `\nEND:VCARD`;
                break;

            case 'wifi':
                qrContent = `WIFI:T:${document.getElementById('wifiType').value};S:${document.getElementById('wifiSSID').value}`;
                if (document.getElementById('wifiPassword').value) qrContent += `;P:${document.getElementById('wifiPassword').value}`;
                qrContent += ';;';
                break;

            case 'email':
                qrContent = `mailto:${document.getElementById('emailAddress').value}`;
                const subject = document.getElementById('emailSubject').value;
                const body = document.getElementById('emailBody').value;
                if (subject || body) {
                    qrContent += '?';
                    if (subject) qrContent += `subject=${encodeURIComponent(subject)}`;
                    if (subject && body) qrContent += '&';
                    if (body) qrContent += `body=${encodeURIComponent(body)}`;
                }
                break;

            case 'phone':
                qrContent = `tel:${document.getElementById('phoneNumber').value}`;
                break;

            case 'sms':
                const smsNumber = document.getElementById('smsNumber').value;
                let smsMessage = document.getElementById('smsMessage').value;
                if (!smsMessage) smsMessage = " ";
                qrContent = `SMSTO:${smsNumber}:${smsMessage}`;
                break;

            case 'payment':
                const upiId = document.getElementById('paymentUpi').value;
                const amount = document.getElementById('paymentAmount').value;
                const note = document.getElementById('paymentNote').value || 'Payment';
                if (!upiId) {
                    alert('UPI ID is required');
                    return;
                }
                qrContent = `upi://pay?pa=${upiId}`;
                if (amount) qrContent += `&am=${amount}`;
                qrContent += `&tn=${note}`;
                break;

            case 'location':
                const lat = document.getElementById('locationLat').value;
                const long = document.getElementById('locationLong').value;
                const name = document.getElementById('locationName').value;
                if (!lat || !long) {
                    alert('Please select a location on the map');
                    return;
                }
                qrContent = `https://www.google.com/maps?q=${lat},${long}&name=${encodeURIComponent(name)}`;
                break;

            case 'social':
                const platform = document.getElementById('socialPlatform').value;
                const username = document.getElementById('socialUsername').value;
                const urlBase = {
                    facebook: 'https://facebook.com/',
                    instagram: 'https://instagram.com/',
                    twitter: 'https://twitter.com/',
                    linkedin: 'https://linkedin.com/in/',
                    youtube: 'https://youtube.com/'
                }[platform];
                qrContent = username.startsWith('http') ? username : urlBase + username;
                break;

            default:
                qrContent = document.getElementById('content').value;
        }

        if (!qrContent) {
            alert('Please enter all required fields');
            return;
        }

        // Validate color contrast
        if (!isColorDark(qrColor.value)) {
            alert('Warning: Light QR code colors may not scan properly. Consider using a darker color.');
        }

        // Validate minimum size
        if (parseInt(qrSize.value) < 200) {
            alert('For best results, use a size of at least 200px. Smaller QR codes may not scan reliably.');
        }

        qrCode.innerHTML = '';

        currentQR = new QRCode(qrCode, {
            text: qrContent,
            width: parseInt(qrSize.value),
            height: parseInt(qrSize.value),
            colorDark: qrColor.value,
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
            useSVG: false
        });

        // Force higher quality rendering
        const canvas = qrCode.querySelector('canvas');
        if (canvas) {
            canvas.style.imageRendering = 'crisp-edges';
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
        }

        downloadPNG.disabled = false;
        downloadSVG.disabled = false;
        
        // Show download instructions
        document.getElementById('saveInstructions').style.display = 'block';
    }
});
