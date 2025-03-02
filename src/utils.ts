const cardPattern = {
  "4": "visa",
  "5": "mastercard",
  "34": "amex",
  "37": "amex",
  "6": "discover",
  "30": "diners",
  "36": "diners",
  "38": "diners",
  "35": "jcb",
} as const;

type CardPattern = keyof typeof cardPattern;
type CardType = (typeof cardPattern)[CardPattern];

export function matchType(cardNumber: string): CardType | undefined {
  const firstDigit = cardNumber.slice(0, 1);
  const firstTwoDigits = cardNumber.slice(0, 2);

  return (
    cardPattern[firstDigit as CardPattern] ||
    cardPattern[firstTwoDigits as CardPattern]
  );
}

export function addSpace(cardNumber: string) {
  cardNumber = cardNumber.replace(/\D/g, "");
  const type = matchType(cardNumber);

  let units: Array<string>;
  switch (type) {
    case "amex":
    case "diners":
      units = (cardNumber.match(/^(.{1,4})(.{0.6}(.*))/) || [])
        .slice(1)
        .filter(Boolean);
      break;
    default:
      units = cardNumber.match(/.{1,4}/g) || [];
  }

  return units.join(" ");
}
