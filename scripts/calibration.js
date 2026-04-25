let referencePose = null;
let isCalibrating = false;
let calibrationCaptureHandler = null;
let calibrationCaptureTimeout = null;
const CALIBRATION_CAPTURE_TIMEOUT_MS = 5000;

async function startCalibration() {
    if (isCalibrating) return;
    isCalibrating = true;

    const countdownEl = document.getElementById('countdown');
    countdownEl.classList.remove('hidden');
    countdownEl.textContent = '3';

    let count = 3;
    updateStatus('Assume the correct posture...', 'var(--warning-color)');

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            clearInterval(timer);
            countdownEl.textContent = '✓';
            setTimeout(() => {
                countdownEl.classList.add('hidden');
            }, 500);
            captureReference();
        }
    }, 1000);
}

function captureReference() {
    // Clean up any previous capture listener/timeout
    if (calibrationCaptureHandler) {
        document.removeEventListener('poseResults', calibrationCaptureHandler);
        calibrationCaptureHandler = null;
    }
    if (calibrationCaptureTimeout) {
        clearTimeout(calibrationCaptureTimeout);
        calibrationCaptureTimeout = null;
    }

    // We'll wait for the next pose result
    calibrationCaptureHandler = (e) => {
        const results = e.detail;
        if (results && results.poseLandmarks) {
            referencePose = JSON.parse(JSON.stringify(results.poseLandmarks));
            isCalibrating = false;
            updateStatus('Calibration complete ✅', 'var(--success-color)');
            document.getElementById('btn-start').disabled = false;
            document.getElementById('metrics-panel').classList.remove('hidden');

            notifications.show('Reference captured! You can start monitoring.', 'success');
            document.removeEventListener('poseResults', calibrationCaptureHandler);
            calibrationCaptureHandler = null;
            if (calibrationCaptureTimeout) {
                clearTimeout(calibrationCaptureTimeout);
                calibrationCaptureTimeout = null;
            }
        }
    };

    document.addEventListener('poseResults', calibrationCaptureHandler);

    calibrationCaptureTimeout = setTimeout(() => {
        if (isCalibrating) {
            isCalibrating = false;
            updateStatus('Calibration failed — no pose detected. Try again.', 'var(--danger-color)');
            notifications.show('Could not detect your pose. Ensure you are visible in frame and retry.', 'warning');
        }
        if (calibrationCaptureHandler) {
            document.removeEventListener('poseResults', calibrationCaptureHandler);
            calibrationCaptureHandler = null;
        }
        calibrationCaptureTimeout = null;
    }, CALIBRATION_CAPTURE_TIMEOUT_MS);
}

function resetApp() {
    referencePose = null;
    isMonitoring = false;
    isCalibrating = false;

    if (calibrationCaptureTimeout) {
        clearTimeout(calibrationCaptureTimeout);
        calibrationCaptureTimeout = null;
    }
    if (calibrationCaptureHandler) {
        document.removeEventListener('poseResults', calibrationCaptureHandler);
        calibrationCaptureHandler = null;
    }

    document.getElementById('btn-start').disabled = true;
    document.getElementById('btn-stop').disabled = true;
    document.getElementById('metrics-panel').classList.add('hidden');
    updateStatus('Waiting for calibration', 'rgba(0,0,0,0.6)');
}
