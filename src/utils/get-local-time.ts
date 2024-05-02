export function getLocalDateTime(timestamp: number, withZone = false) {
  const date = getLocalDate(timestamp);
  const time = getLocalTime(timestamp);

  const zone = (Intl.DateTimeFormat().resolvedOptions().timeZone || '')
    .split('/')
    .at(-1);
  const offset = getLocalTimezoneDifference();

  return (
    `${date} ${time}` + (withZone && zone ? ` (GMT${offset} ${zone})` : '')
  );
}

export function getLocalDate(timestamp: number) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getLocalTime(timestamp: number) {
  const date = new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

function getLocalTimezoneDifference() {
  const timezoneOffset = new Date().getTimezoneOffset();
  const diffHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const diffMinutes = Math.abs(timezoneOffset) % 60;
  const sign = timezoneOffset > 0 ? '-' : '+';
  const formattedHours = diffHours.toString().padStart(2, '0');
  const formattedMinutes = diffMinutes.toString().padStart(2, '0');

  return `${sign}${formattedHours}:${formattedMinutes}`;
}
