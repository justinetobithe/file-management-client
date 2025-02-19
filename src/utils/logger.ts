export default function log(message: string, data?: unknown) {
  return console.log(
    `%c${message}`,
    'background-color: #ffcc33; color: black; font-weight: bold; font-size: 16px; padding: 5px;',
    data
  );
}
