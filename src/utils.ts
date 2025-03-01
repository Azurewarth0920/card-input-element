const cardPattern = {
  visa: ["4"],
  mastercard: ["5"],
  amex: ["34", "37"],
  discover: ["6"],
  diners: ["30", "36", "38"],
  jcb: ["35"],
};

type CardType = keyof typeof cardPattern;

export function matchType(cardNumber: string): CardType | undefined {
  return Object.entries(cardPattern).find(([_, patterns]) =>
    patterns.some((pattern) => cardNumber.startsWith(pattern))
  )?.[0] as CardType | undefined;
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
