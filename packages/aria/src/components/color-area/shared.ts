export function createLinearScale(input: [number, number], output: [number, number]) {
  const [inputMin, inputMax] = input;
  const [outputMin, outputMax] = output;

  if (inputMax === inputMin) {
    return () => outputMin;
  }

  const ratio = (outputMax - outputMin) / (inputMax - inputMin);

  return (value: number) => outputMin + (value - inputMin) * ratio;
}

export function convertValueToPercentage(value: number, min: number, max: number) {
  if (max === min) {
    return 0;
  }

  return ((value - min) / (max - min)) * 100;
}
