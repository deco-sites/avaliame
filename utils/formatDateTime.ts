export default function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const year = date.getUTCFullYear();

  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());

  return `${month}/${day}/${year} ${hours}:${minutes}`;
}
