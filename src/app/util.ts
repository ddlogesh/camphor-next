const toPlural = (text: string, count: number) => {
  return `${text}${count === 1 ? '' : 's'}`;
}

const parseJSON = (value: string, fallback: string | null = null) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

export {
  toPlural,
  parseJSON
};
