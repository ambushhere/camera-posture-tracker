let referencePose = null;
let isCalibrating = false;

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
    // We'll wait for the next pose result
    const captureHandler = (e) => {
        const results = e.detail;
        if (results && results.poseLandmarks) {
            referencePose = JSON.parse(JSON.stringify(results.poseLandmarks));
            isCalibrating = false;
            updateStatus('Calibration complete ✅', 'var(--success-color)');
            document.getElementById('btn-start').disabled = false;
            document.getElementById('metrics-panel').classList.remove('hidden');

            notifications.show('Reference captured! You can start monitoring.', 'success');
            document.removeEventListener('poseResults', captureHandler);
        }
    };

    document.addEventListener('poseResults', captureHandler);
}

function resetApp() {
    referencePose = null;
    isMonitoring = false;
    document.getElementById('btn-start').disabled = true;
    document.getElementById('btn-stop').disabled = true;
    document.getElementById('metrics-panel').classList.add('hidden');
    updateStatus('Waiting for calibration', 'rgba(0,0,0,0.6)');
}
