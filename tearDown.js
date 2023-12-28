export const teardown = () => (process.stdin.unpipe(), process.stdout.unpipe());
