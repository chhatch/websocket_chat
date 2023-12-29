export function buildMessage(type, data) {
  return JSON.stringify({ type, data });
}
