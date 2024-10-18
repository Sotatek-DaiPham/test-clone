import { isNumber } from "lodash";

export const REGEX_INPUT_DECIMAL = (min?: number, max?: number) => {
  if (!isNumber(min) || !isNumber(max)) {
    return RegExp(String.raw`^[0-9]*\.?[0-9]*$`);
  }

  return RegExp(String.raw`^([0-9]+\.?[0-9]{${min},${max}}|)$`);
};

export const TwitterUrlRegex =
  /^http(?:s)?:\/\/(?:www\.)?(twitter|x)\.com(\/\S*)*$/;

export const TelegramUrlRegex =
  /(https?:\/\/)?(www[.])?(((web\.)?telegram)\.org|t\.(me))(\/\S*)*$/;

export const WebsiteUrlRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export const DiscordUrlRegex = /http(?:s)?:\/\/(?:www\.)?discord\.com(\/\S*)*$/;
