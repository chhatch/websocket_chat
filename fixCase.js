export const fixCase = () => (
  process.stdin.unpipe(), process.stdout.unpipe(), process.exit()
);
