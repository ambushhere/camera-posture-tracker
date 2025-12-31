class NotificationManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.cooldown = 15000; // 15 seconds
        this.lastNotificationTime = 0;
        this.audioCtx = null;
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playWarningSound() {
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
        if (now - this.lastNotificationTime < this.cooldown) return;

        // Play sound
        if (type === 'notification' || type === 'warning') {
            this.playWarningSound();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        this.container.appendChild(notification);
        this.lastNotificationTime = now;

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

const notifications = new NotificationManager('notification-container');
