import { EmailValidationStrategy } from "./EmailValidationStrategy";
import { PhoneValidationStrategy } from "./PhoneRegexValidationStrategy";
import { StatusChangeValidationStrategy } from "./StatusChangeValidationStrategy";
import { ALLOWED_EMAIL_DOMAIN, PHONE_REGEX, STATUS_RULES } from "../constants";

export const getValidationStrategies = () => [
  new EmailValidationStrategy(ALLOWED_EMAIL_DOMAIN),
  new PhoneValidationStrategy(PHONE_REGEX),
  new StatusChangeValidationStrategy(STATUS_RULES),
];