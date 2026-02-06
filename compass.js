/**
 * Compass App - Uses Device Orientation API to create a real compass
 */

class Compass {
    constructor() {
        this.compassCircle = document.querySelector('.compass-circle');
        this.headingValue = document.querySelector('.heading-value');
        this.directionName = document.querySelector('.direction-name');
        this.statusMessage = document.getElementById('status');
        this.startBtn = document.getElementById('startBtn');
        this.calibrateBtn = document.getElementById('calibrateBtn');

        this.currentHeading = 0;
        this.targetHeading = 0;
        this.isRunning = false;
        this.animationFrame = null;

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.calibrateBtn.addEventListener('click', () => this.calibrate());

        // Check if device orientation is supported
        if (!this.isSupported()) {
            this.showStatus('המכשיר שלך לא תומך במצפן', 'error');
            this.startBtn.disabled = true;
            this.startBtn.textContent = 'לא נתמך';
        }
    }

    isSupported() {
        return 'DeviceOrientationEvent' in window;
    }

    async start() {
        // iOS 13+ requires permission request
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    this.enableCompass();
                } else {
                    this.showStatus('נדרשת הרשאה לגשת לחיישנים', 'error');
                }
            } catch (error) {
                this.showStatus('שגיאה בבקשת הרשאה: ' + error.message, 'error');
            }
        } else {
            // Non-iOS or older iOS
            this.enableCompass();
        }
    }

    enableCompass() {
        this.isRunning = true;
        this.startBtn.classList.add('hidden');
        this.calibrateBtn.style.display = 'block';
        this.showStatus('המצפן פעיל', 'success');

        // Start animation loop
        this.animate();

        // Listen for device orientation
        window.addEventListener('deviceorientationabsolute', (e) => this.handleOrientation(e), true);
        window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), true);

        // Clear status after 2 seconds
        setTimeout(() => {
            if (this.isRunning) {
                this.showStatus('');
            }
        }, 2000);
    }

    handleOrientation(event) {
        let heading = null;

        // Try to get the compass heading
        if (event.webkitCompassHeading !== undefined) {
            // iOS provides this directly
            heading = event.webkitCompassHeading;
        } else if (event.alpha !== null) {
            // Android and others - alpha is the compass direction
            // But we need to account for screen orientation
            if (event.absolute) {
                heading = 360 - event.alpha;
            } else {
                // Fallback for non-absolute orientation
                heading = 360 - event.alpha;
            }
        }

        if (heading !== null) {
            // Normalize to 0-360
            heading = ((heading % 360) + 360) % 360;
            this.targetHeading = heading;
        }
    }

    animate() {
        if (!this.isRunning) return;

        // Smooth interpolation towards target heading
        let diff = this.targetHeading - this.currentHeading;

        // Handle wraparound (e.g., from 350 to 10 degrees)
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // Ease towards target
        this.currentHeading += diff * 0.15;

        // Normalize
        this.currentHeading = ((this.currentHeading % 360) + 360) % 360;

        // Update UI
        this.updateCompass(this.currentHeading);

        // Continue animation
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    updateCompass(heading) {
        // Rotate the compass circle (opposite direction so north points up when facing north)
        this.compassCircle.style.transform = `rotate(${-heading}deg)`;

        // Update heading display
        this.headingValue.textContent = Math.round(heading);

        // Update direction name
        this.directionName.textContent = this.getDirectionName(heading);
    }

    getDirectionName(heading) {
        const directions = [
            { name: 'צפון', min: 337.5, max: 360 },
            { name: 'צפון', min: 0, max: 22.5 },
            { name: 'צפון-מזרח', min: 22.5, max: 67.5 },
            { name: 'מזרח', min: 67.5, max: 112.5 },
            { name: 'דרום-מזרח', min: 112.5, max: 157.5 },
            { name: 'דרום', min: 157.5, max: 202.5 },
            { name: 'דרום-מערב', min: 202.5, max: 247.5 },
            { name: 'מערב', min: 247.5, max: 292.5 },
            { name: 'צפון-מערב', min: 292.5, max: 337.5 }
        ];

        for (const dir of directions) {
            if (heading >= dir.min && heading < dir.max) {
                return dir.name;
            }
        }
        return 'צפון';
    }

    calibrate() {
        this.showStatus('הזז את הטלפון בתנועת 8 לכיול', 'success');
        setTimeout(() => {
            this.showStatus('');
        }, 3000);
    }

    showStatus(message, type = '') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = 'status-message';
        if (type) {
            this.statusMessage.classList.add(type);
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        window.removeEventListener('deviceorientationabsolute', this.handleOrientation);
        window.removeEventListener('deviceorientation', this.handleOrientation);
    }
}

// Initialize compass when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.compass = new Compass();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
