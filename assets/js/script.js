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

    // Contact Form Handler
    const contactForm = document.getElementById('contactFormSpree');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    thankYouMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    alert('Sorry, there was an error sending your message. Please try again.');
                }
            }).catch(error => {
                alert('Sorry, there was an error sending your message. Please try again.');
            });
        });
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
                    <div class="form-group"><label for="paymentAmount">Amount:</label><input type="number" id="paymentAmount" class="form-control" required min="1" step="0.01"></div>
                    <div class="form-group"><label for="paymentNote">Note:</label><input type="text" id="paymentNote" class="form-control"></div>`;
                break;

            case 'location':
                fieldsHTML = `
                    <div class="form-group">
                        <label for="googleMapUrl">Google Maps Link:</label>
                        <input type="url" id="googleMapUrl" class="form-control" placeholder="Paste Google Maps link here..." required>
                    </div>
                    <div class="form-group" style="text-align: center; margin: 20px 0;">
                        <span style="color: #666;">OR</span>
                    </div>
                    <div class="form-group" style="text-align: center;">
                        <button type="button" id="findLocationBtn" class="btn" style="background: #4285f4; color: white;">Find Location</button>
                    </div>`;
                setTimeout(() => {
                    const findBtn = document.getElementById('findLocationBtn');
                    if (findBtn) {
                        findBtn.addEventListener('click', function() {
                            window.open('https://maps.google.com/', '_blank');
                        });
                    }
                }, 0);
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
                if (!amount || amount <= 0) {
                    alert('Amount is required and must be greater than 0');
                    return;
                }
                qrContent = `upi://pay?pa=${upiId}&am=${amount}&tn=${note}`;
                break;

            case 'location':
                const googleMapUrl = document.getElementById('googleMapUrl').value;
                if (!googleMapUrl) {
                    alert('Please paste a Google Maps link');
                    return;
                }
                qrContent = googleMapUrl;
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

        qrCode.innerHTML = '';

        currentQR = new QRCode(qrCode, {
            text: qrContent,
            width: parseInt(qrSize.value),
            height: parseInt(qrSize.value),
            colorDark: qrColor.value,
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        downloadPNG.disabled = false;
        downloadSVG.disabled = false;
    }

    function downloadPNGHandler() {
        if (!currentQR) return;
        const canvas = qrCode.querySelector('canvas');
        if (!canvas) return alert('No QR code found');
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
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
});