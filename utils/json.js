export const safeParseJSON = (string) => {
  try {
    return JSON.parse(string);
  } catch (error) {
    console.error(error);
    return null;
  }
};
