document.addEventListener('DOMContentLoaded', async () => {
    // Elements
    const btnCalibrate = document.getElementById('btn-calibrate');
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    const btnReset = document.getElementById('btn-reset');

    // Init Pose & Camera
    try {
        updateStatus('Initializing camera...', 'var(--accent-color)');
        await initPose();
        await camera.start();
        updateStatus('Ready — Click Calibrate to begin', 'rgba(0,0,0,0.6)');
    } catch (err) {
        console.error(err);
        const isPermissionDenied = err.name === 'NotAllowedError';
        const isNotFound = err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError';

        if (isPermissionDenied) {
            updateStatus('Camera access denied', 'var(--danger-color)');
            notifications.show('Please allow camera access in your browser settings and reload.', 'danger');
        } else if (isNotFound) {
            updateStatus('No camera found', 'var(--danger-color)');
            notifications.show('No camera detected. Please connect a webcam and reload.', 'danger');
        } else {
            updateStatus('Initialization error', 'var(--danger-color)');
            notifications.show('Failed to initialize. Check your camera and try reloading.', 'danger');
        }

        btnCalibrate.disabled = true;
    }

    // Event Listeners
    btnCalibrate.addEventListener('click', () => {
        startCalibration();
    });

    btnStart.addEventListener('click', () => {
        isMonitoring = true;
        btnStart.disabled = true;
        btnStop.disabled = false;
        updateStatus('Monitoring active 🟢', 'var(--success-color)');
    });

    btnStop.addEventListener('click', () => {
        isMonitoring = false;
        btnStart.disabled = false;
        btnStop.disabled = true;
        updateStatus('Monitoring paused 🟡', 'var(--warning-color)');
    });

    btnReset.addEventListener('click', () => {
        resetApp();
        btnStart.disabled = true;
        btnStop.disabled = true;
    });

    // Sensitivity Settings
    const rangeHead = document.getElementById('range-head');
    const rangeShoulders = document.getElementById('range-shoulders');
    const valHead = document.getElementById('val-head');
    const valShoulders = document.getElementById('val-shoulders');

    rangeHead.addEventListener('input', (e) => {
        headThreshold = parseInt(e.target.value);
        valHead.textContent = headThreshold;
    });

    rangeShoulders.addEventListener('input', (e) => {
        shoulderThreshold = parseInt(e.target.value);
        valShoulders.textContent = shoulderThreshold;
    });

    // Toggle Skeleton Logic
    const btnToggleSkeleton = document.getElementById('btn-toggle-skeleton');
    btnToggleSkeleton.addEventListener('click', () => {
        showSkeleton = !showSkeleton;
        btnToggleSkeleton.innerHTML = showSkeleton ?
            '<span class="icon">🦴</span> Hide Skeleton' :
            '<span class="icon">🦴</span> Show Skeleton';

        // Clear canvas if hiding
        if (!showSkeleton) {
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        }
    });
});
