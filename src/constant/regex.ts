import { isNumber } from "lodash";

export const REGEX_INPUT_DECIMAL = (min?: number, max?: number) => {
  if (!isNumber(min) || !isNumber(max)) {
    return RegExp(String.raw`^[0-9]*\.?[0-9]*$`);
  }

  return RegExp(String.raw`^([0-9]+\.?[0-9]{${min},${max}}|)$`);
};
