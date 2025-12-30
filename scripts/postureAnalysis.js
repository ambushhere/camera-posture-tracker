let isMonitoring = false;

function calculateAngle(p1, p2) {
    // Angle with vertical line
    const dy = p2.y - p1.y;
    const dx = p2.x - p1.x;
    return Math.atan2(dx, dy) * (180 / Math.PI);
}

function analyzePosture(currentLandmarks) {
    if (!isMonitoring || !referencePose) return;

    // Key points indices
    const NOSE = 0;
    const L_SHOULDER = 11;
    const R_SHOULDER = 12;
    const L_EAR = 7;
    const R_EAR = 8;

    // Current metrics
    const shoulderAngle = calculateAngle(currentLandmarks[L_SHOULDER], currentLandmarks[R_SHOULDER]);
    const neckAngle = calculateAngle(currentLandmarks[NOSE], {
        x: (currentLandmarks[L_SHOULDER].x + currentLandmarks[R_SHOULDER].x) / 2,
        y: (currentLandmarks[L_SHOULDER].y + currentLandmarks[R_SHOULDER].y) / 2
    });

    // Reference metrics
    const refShoulderAngle = calculateAngle(referencePose[L_SHOULDER], referencePose[R_SHOULDER]);
    const refNeckAngle = calculateAngle(referencePose[NOSE], {
        x: (referencePose[L_SHOULDER].x + referencePose[R_SHOULDER].x) / 2,
        y: (referencePose[L_SHOULDER].y + referencePose[R_SHOULDER].y) / 2
    });

    // Update UI
    const shoulderDiff = Math.abs(shoulderAngle - refShoulderAngle);
    const neckDiff = Math.abs(neckAngle - refNeckAngle);

    document.getElementById('metric-head').textContent = `${Math.round(neckDiff)}°`;
    document.getElementById('metric-shoulders').textContent = `${Math.round(shoulderDiff)}°`;

    // Thresholds
    if (neckDiff > 12) {
        notifications.show('Выпрямите шею! Голова слишком опущена или наклонена.', 'notification');
    } else if (shoulderDiff > 10) {
        notifications.show('Выровняйте плечи! Замечен перекос.', 'notification');
    }
}

document.addEventListener('poseResults', (e) => {
    if (isMonitoring) {
        analyzePosture(e.detail.poseLandmarks);
    }
});
