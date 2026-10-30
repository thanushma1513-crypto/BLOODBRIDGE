// Web Audio API emergency alert sound generator & vibration helper
let audioCtx: AudioContext | null = null;

export function playEmergencyAlertSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Create a 3-pulse urgent medical telemetry warning tone
    for (let i = 0; i < 3; i++) {
      const startTime = now + i * 0.28;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      // Dual-frequency beep (960Hz shifting to 780Hz)
      osc.frequency.setValueAtTime(960, startTime);
      osc.frequency.exponentialRampToValueAtTime(780, startTime + 0.18);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    }
  } catch (err) {
    console.warn('Audio playback not supported or blocked by browser policy:', err);
  }
}

export function triggerVibration() {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // Vibrate pattern: 300ms on, 100ms off, 300ms on, 100ms off, 500ms on
      navigator.vibrate([300, 100, 300, 100, 500]);
    }
  } catch (err) {
    console.warn('Vibration API not supported:', err);
  }
}

/**
 * Calculates geographical distance in kilometers between two GPS coordinates using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}
