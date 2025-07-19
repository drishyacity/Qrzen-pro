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
    // SVG download removed for app compatibility

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
    // SVG handler removed for app compatibility

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
            correctLevel: QRCode.CorrectLevel.H,
            margin: 4
        });

        downloadPNG.disabled = false;
        // SVG download disabled for app compatibility

        // Show save instructions for WebView users
        const saveInstructions = document.getElementById('saveInstructions');
        if (saveInstructions) {
            saveInstructions.style.display = 'block';
        }
    }

    function downloadPNGHandler() {
        if (!currentQR) return;
        const originalCanvas = qrCode.querySelector('canvas');
        if (!originalCanvas) return alert('No QR code found');

        // Create a new canvas with extra white border for better scanning
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        // Add extra border (20px on each side)
        const borderSize = 20;
        tempCanvas.width = originalCanvas.width + (borderSize * 2);
        tempCanvas.height = originalCanvas.height + (borderSize * 2);

        // Fill with white background
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the original QR code in the center
        tempCtx.drawImage(originalCanvas, borderSize, borderSize);

        // Download the enhanced QR code
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = tempCanvas.toDataURL('image/png');
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

    // Get QR data for download page regeneration
    function getQRDataForDownload() {
        const type = qrType.value;
        let qrContent = '';

        // Get the same content that was used to generate QR
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
                qrContent = `upi://pay?pa=${upiId}&am=${amount}&tn=${note}`;
                break;
            case 'location':
                qrContent = document.getElementById('googleMapUrl').value;
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

        if (!qrContent) return null;

        return {
            content: qrContent,
            size: parseInt(qrSize.value),
            color: qrColor.value,
            type: type
        };
    }

    // Open download page in external browser
    function openDownloadInExternalBrowser(qrData) {
        try {
            console.log('=== DOWNLOAD DEBUG INFO ===');
            console.log('QR Data Object:', qrData);
            console.log('QR Content:', qrData.content);
            console.log('QR Settings:', qrData.size, qrData.color, qrData.type);

            // Encode QR data for URL transfer
            const jsonString = JSON.stringify(qrData);
            console.log('JSON String:', jsonString);
            console.log('JSON String Length:', jsonString.length);

            const encodedData = encodeURIComponent(jsonString);
            console.log('Encoded data length:', encodedData.length);
            console.log('Encoded data preview:', encodedData.substring(0, 100) + '...');

            // Create download URL with QR data
            const downloadURL = `${window.location.origin}/download.html?data=${encodedData}`;
            console.log('Download URL:', downloadURL);
            console.log('Download URL Length:', downloadURL.length);

            // Check URL length (some browsers have limits)
            if (downloadURL.length > 2000) {
                console.warn('URL is very long:', downloadURL.length, 'characters');
            }

            // Try to open in external browser
            const opened = window.open(downloadURL, '_blank', 'noopener,noreferrer');

            if (!opened) {
                console.error('Failed to open window - popup blocked?');
                // Fallback: Show instructions if popup blocked
                showExternalBrowserInstructions(downloadURL);
            } else {
                console.log('Window opened successfully');
                // Show success message
                showSuccessMessage();
            }

        } catch (error) {
            console.error('External browser open failed:', error);
            console.error('Error details:', error.message);
            alert('Failed to open download page: ' + error.message);
        }
    }

    // Show success message
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        message.innerHTML = '✅ Download page opened in browser!';

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // Show instructions if external browser failed
    function showExternalBrowserInstructions(downloadURL) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px;">
                <h3 style="color: #333; margin-bottom: 15px;">🌐 Open in Browser</h3>
                <p style="color: #666; margin-bottom: 20px; line-height: 1.5;">
                    To download your QR code, please open this link in your browser:
                </p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; word-break: break-all; font-size: 12px; color: #495057;">
                    ${downloadURL}
                </div>
                <button onclick="copyToClipboard('${downloadURL}')" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 5px;">
                    📋 Copy Link
                </button>
                <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 5px;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Copy to clipboard helper
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Link copied to clipboard!');
        }).catch(() => {
            alert('❌ Copy failed. Please manually copy the link.');
        });
    };

    // WebView-friendly image display function
    function showImageInModal(dataURL) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 10px;
            box-sizing: border-box;
            overflow-y: auto;
        `;

        // Create unique ID for this QR code
        const timestamp = new Date().getTime();
        const qrId = 'qr-' + timestamp;

        modal.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 15px; text-align: center; max-width: 95%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <h3 style="margin-top: 0; color: #333; font-size: 20px;">📱 Your QR Code</h3>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
                    <img id="${qrId}" src="${dataURL}" style="max-width: 100%; max-height: 350px; border: 2px solid #007bff; border-radius: 10px; display: block; margin: 0 auto;">
                </div>

                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196f3;">
                    <h4 style="margin: 0 0 10px 0; color: #1976d2; font-size: 16px;">📥 How to Save:</h4>
                    <p style="color: #1565c0; font-size: 14px; margin: 5px 0; line-height: 1.4;">
                        <strong>Method 1:</strong> Long press the QR code image above → Select "Save Image" or "Download Image"
                    </p>
                    <p style="color: #1565c0; font-size: 14px; margin: 5px 0; line-height: 1.4;">
                        <strong>Method 2:</strong> Screenshot this screen and crop the QR code
                    </p>
                    <p style="color: #1565c0; font-size: 14px; margin: 5px 0; line-height: 1.4;">
                        <strong>Method 3:</strong> Share this screen to save in gallery
                    </p>
                </div>

                <div style="margin-top: 20px;">
                    <button onclick="copyImageToClipboard('${qrId}')" style="padding: 12px 20px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin: 5px;">
                        📋 Copy Image
                    </button>
                    <button onclick="shareQRCode('${dataURL}')" style="padding: 12px 20px; background: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin: 5px;">
                        📤 Share
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 12px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin: 5px;">
                        ❌ Close
                    </button>
                </div>

                <p style="color: #6c757d; font-size: 12px; margin: 15px 0 0 0;">
                    QR Code generated successfully • Ready to use
                </p>
            </div>
        `;

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Restore body scroll when modal is closed
        const closeModal = () => {
            document.body.style.overflow = '';
            modal.remove();
        };

        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Copy image to clipboard (if supported)
    window.copyImageToClipboard = async function(imageId) {
        try {
            const img = document.getElementById(imageId);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    alert('✅ QR Code copied to clipboard!');
                } catch (err) {
                    alert('❌ Copy not supported. Please use long press to save.');
                }
            });
        } catch (error) {
            alert('❌ Copy not supported. Please use long press to save.');
        }
    };

    // Share QR code (if supported)
    window.shareQRCode = async function(dataURL) {
        try {
            if (navigator.share) {
                // Convert dataURL to blob
                const response = await fetch(dataURL);
                const blob = await response.blob();
                const file = new File([blob], 'qr-code.png', { type: 'image/png' });

                await navigator.share({
                    title: 'QR Code',
                    text: 'Generated QR Code from QRZen Pro',
                    files: [file]
                });
            } else {
                alert('❌ Share not supported. Please use long press to save.');
            }
        } catch (error) {
            alert('❌ Share not supported. Please use long press to save.');
        }
    };

    // SVG download function removed for app compatibility
});