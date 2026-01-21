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
        updateStatus('Ready', 'rgba(0,0,0,0.6)');
    } catch (err) {
        console.error(err);
        updateStatus('Camera access error', 'var(--danger-color)');
        notifications.show('Failed to access camera or load ML model.', 'danger');
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
