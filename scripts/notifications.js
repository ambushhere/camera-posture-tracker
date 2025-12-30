class NotificationManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.cooldown = 15000; // 15 seconds
        this.lastNotificationTime = 0;
    }

    show(message, type = 'warning') {
        const now = Date.now();
        if (now - this.lastNotificationTime < this.cooldown) return;

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
