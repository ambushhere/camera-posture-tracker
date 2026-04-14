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

    // Custom Alert Sound
    const customSoundUpload = document.getElementById('custom-sound-upload');
    const customSoundName = document.getElementById('custom-sound-name');
    const btnRemoveSound = document.getElementById('btn-remove-sound');
    const btnPreviewSound = document.getElementById('btn-preview-sound');

    // Restore custom sound name on load
    if (notifications.customSoundName) {
        customSoundName.textContent = notifications.customSoundName;
        btnRemoveSound.classList.remove('hidden');
    }

    customSoundUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('audio/')) {
            notifications.show('Please select a valid audio file.', 'warning');
            return;
        }

        // Limit file size to 1MB to fit in localStorage
        if (file.size > 1024 * 1024) {
            notifications.show('Audio file must be under 1 MB.', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            notifications.setCustomSound(event.target.result, file.name);
            customSoundName.textContent = file.name;
            btnRemoveSound.classList.remove('hidden');
            notifications.show('Custom alert sound uploaded!', 'success');
        };
        reader.readAsDataURL(file);
        // Reset input so the same file can be re-uploaded
        e.target.value = '';
    });

    btnRemoveSound.addEventListener('click', () => {
        notifications.removeCustomSound();
        customSoundName.textContent = 'Default (beep)';
        btnRemoveSound.classList.add('hidden');
        notifications.show('Custom sound removed. Using default beep.', 'success');
    });

    btnPreviewSound.addEventListener('click', () => {
        notifications.playWarningSound();
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
