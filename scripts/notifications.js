class NotificationManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.cooldown = 15000; // 15 seconds for posture warning alerts
        this.lastNotificationTimes = { notification: 0 };
        this.audioCtx = null;
        this.customSoundUrl = this.safeStorageGet('customAlertSound');
        this.customSoundName = this.safeStorageGet('customAlertSoundName');
    }

    safeStorageGet(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('Unable to read from localStorage:', error);
            return null;
        }
    }

    safeStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn('Unable to save to localStorage:', error);
            return false;
        }
    }

    safeStorageRemove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Unable to remove from localStorage:', error);
        }
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    setCustomSound(dataUrl, fileName) {
        this.customSoundUrl = dataUrl;
        this.customSoundName = fileName;

        const soundSaved = this.safeStorageSet('customAlertSound', dataUrl);
        const nameSaved = this.safeStorageSet('customAlertSoundName', fileName);

        if (!soundSaved || !nameSaved) {
            // Roll back in-memory state if persistence fails
            this.customSoundUrl = null;
            this.customSoundName = null;
            this.safeStorageRemove('customAlertSound');
            this.safeStorageRemove('customAlertSoundName');
            return false;
        }

        return true;
    }

    removeCustomSound() {
        this.customSoundUrl = null;
        this.customSoundName = null;
        this.safeStorageRemove('customAlertSound');
        this.safeStorageRemove('customAlertSoundName');
    }

    playWarningSound() {
        if (this.customSoundUrl) {
            const audio = new Audio(this.customSoundUrl);
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Fall back to default sound if custom sound fails
                this.playDefaultSound();
            });
            return;
        }
        this.playDefaultSound();
    }

    playDefaultSound() {
        this.initAudio();

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime); // A4 note

        gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);

        oscillator.start(this.audioCtx.currentTime);
        oscillator.stop(this.audioCtx.currentTime + 0.5);
    }

    show(message, type = 'warning') {
        const now = Date.now();
        const shouldCooldown = type === 'notification';

        if (shouldCooldown) {
            const lastTime = this.lastNotificationTimes.notification || 0;
            if (now - lastTime < this.cooldown) return;
            this.lastNotificationTimes.notification = now;
        }

        // Play sound
        if (type === 'notification' || type === 'warning') {
            this.playWarningSound();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        this.container.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

const notifications = new NotificationManager('notification-container');
