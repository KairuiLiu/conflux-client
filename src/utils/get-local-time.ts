function getLocalTime(timestamp: number, withZone = false) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const zone = (Intl.DateTimeFormat().resolvedOptions().timeZone || '')
    .split('/')
    .at(-1);
  const offset = getLocalTimezoneDifference();

  return (
    `${year}-${month}-${day} ${hours}:${minutes}` +
    (withZone && zone ? ` (GMT${offset} ${zone})` : '')
  );
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

export default getLocalTime;
