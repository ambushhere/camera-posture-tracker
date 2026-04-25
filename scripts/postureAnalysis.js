let isMonitoring = false;

// Sensitivity thresholds (can be updated from app.js)
let headThreshold = 12;
let shoulderThreshold = 10;
const MIN_LANDMARK_VISIBILITY = 0.6;

function calculateAngle(p1, p2) {
    // Angle with vertical line
    const dy = p2.y - p1.y;
    const dx = p2.x - p1.x;
    return Math.atan2(dx, dy) * (180 / Math.PI);
}

function isReliableLandmark(point) {
    if (!point) return false;
    if (typeof point.visibility !== 'number') return true; // fallback for models without visibility
    return point.visibility >= MIN_LANDMARK_VISIBILITY;
}

function analyzePosture(currentLandmarks) {
    if (!isMonitoring || !referencePose) return;

    // Key points indices
    const NOSE = 0;
    const L_SHOULDER = 11;
    const R_SHOULDER = 12;

    const currentNose = currentLandmarks[NOSE];
    const currentLeftShoulder = currentLandmarks[L_SHOULDER];
    const currentRightShoulder = currentLandmarks[R_SHOULDER];

    const referenceNose = referencePose[NOSE];
    const referenceLeftShoulder = referencePose[L_SHOULDER];
    const referenceRightShoulder = referencePose[R_SHOULDER];

    const currentReliable = isReliableLandmark(currentNose)
        && isReliableLandmark(currentLeftShoulder)
        && isReliableLandmark(currentRightShoulder);

    const referenceReliable = isReliableLandmark(referenceNose)
        && isReliableLandmark(referenceLeftShoulder)
        && isReliableLandmark(referenceRightShoulder);

    if (!currentReliable || !referenceReliable) {
        return;
    }

    // Current metrics
    const shoulderAngle = calculateAngle(currentLeftShoulder, currentRightShoulder);
    const neckAngle = calculateAngle(currentNose, {
        x: (currentLeftShoulder.x + currentRightShoulder.x) / 2,
        y: (currentLeftShoulder.y + currentRightShoulder.y) / 2
    });

    // Reference metrics
    const refShoulderAngle = calculateAngle(referenceLeftShoulder, referenceRightShoulder);
    const refNeckAngle = calculateAngle(referenceNose, {
        x: (referenceLeftShoulder.x + referenceRightShoulder.x) / 2,
        y: (referenceLeftShoulder.y + referenceRightShoulder.y) / 2
    });

    // Update UI
    const shoulderDiff = Math.abs(shoulderAngle - refShoulderAngle);
    const neckDiff = Math.abs(neckAngle - refNeckAngle);

    document.getElementById('metric-head').textContent = `${Math.round(neckDiff)}°`;
    document.getElementById('metric-shoulders').textContent = `${Math.round(shoulderDiff)}°`;

    // Thresholds
    if (neckDiff > headThreshold) {
        notifications.show('Straighten your neck! Head is too low or tilted.', 'notification');
    } else if (shoulderDiff > shoulderThreshold) {
        notifications.show('Level your shoulders! Tilt detected.', 'notification');
    }
}

document.addEventListener('poseResults', (e) => {
    if (isMonitoring) {
        analyzePosture(e.detail.poseLandmarks);
    }
});
