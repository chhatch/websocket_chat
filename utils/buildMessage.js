export function buildMessage(type, data, from) {
  return JSON.stringify({ type, data, from });
}
