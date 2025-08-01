export default function generateUsername(name: string): string {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${cleaned}${random}`;
}
