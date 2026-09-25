import confetti from 'canvas-confetti';

/**
 * Fires localized micro-confetti originating from a specific HTML element
 * instead of full-screen spam.
 */
export function fireLocalizedConfetti(targetElement: HTMLElement | null, hexColors: string[] = ['#6366f1', '#10b981', '#f59e0b', '#ec4899']) {
  if (!targetElement) {
    // Subtle fallback centered in upper quadrant
    confetti({
      particleCount: 28,
      spread: 45,
      origin: { y: 0.25 },
      colors: hexColors,
      disableForReducedMotion: true,
      scalar: 0.8,
    });
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 32,
    angle: 90,
    spread: 55,
    startVelocity: 25,
    origin: { x, y },
    colors: hexColors,
    disableForReducedMotion: true,
    scalar: 0.75,
    ticks: 120,
    shapes: ['circle', 'square'],
  });
}
