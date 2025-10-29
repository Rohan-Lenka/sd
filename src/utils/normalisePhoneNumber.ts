export function normalisePhoneFormat(phone: string): string {
  phone = phone.trim();

  if (phone.startsWith('+91')) {
    return phone;
  }

  phone = phone.replace(/^0+/, '');
  return '+91' + phone;
}
