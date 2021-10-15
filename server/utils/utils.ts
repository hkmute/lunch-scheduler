export const generateRandomNumber = (max: number, min = 0) => {
  return Math.floor(Math.random() * (max + 1)) + Math.ceil(min);
};

export const generateRandomNumbers = (quantity: number, max: number, min = 0) => {
  const result: number[] = [];
  while (result.length < quantity) {
    const randomNumber = generateRandomNumber(max, min);
    if (result.includes(randomNumber)) {
      result.push(randomNumber);
    }
  }
  return result;
};
