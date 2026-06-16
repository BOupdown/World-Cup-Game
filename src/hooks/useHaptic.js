export function haptic(type = 'light') {
  if (!navigator.vibrate) return;
  const patterns = {
    light:  [30],
    medium: [60],
    heavy:  [100, 50, 100],
    error:  [80, 40, 80, 40, 160],
  };
  navigator.vibrate(patterns[type] || [30]);
}
