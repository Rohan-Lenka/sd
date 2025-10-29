export function isEasterEggEnabled(): boolean {
  return (process.env.EASTER_EGGS_ENABLED || '').toLowerCase() === 'true';
}

export const DEV_OTPS = ['123456', '000000'];
export const DEV_PASSWORDS = ['123456', 'admin123'];
