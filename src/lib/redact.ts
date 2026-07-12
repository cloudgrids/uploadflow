export function redactSensitiveData(
  text: string,
  rules: {
    email: boolean;
    phone: boolean;
    creditCard: boolean;
    ip: boolean;
  }
): { redactedText: string; matchesCount: number } {
  let redactedText = text;
  let matchesCount = 0;

  const patterns = {
    email: {
      regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      label: '[REDACTED_EMAIL]'
    },
    phone: {
      regex: /\b(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      label: '[REDACTED_PHONE]'
    },
    creditCard: {
      regex: /\b(?:\d{4}[- ]?){3}\d{4}\b/g,
      label: '[REDACTED_CARD]'
    },
    ip: {
      regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
      label: '[REDACTED_IP]'
    }
  };

  Object.entries(patterns).forEach(([key, rule]) => {
    if (rules[key as keyof typeof rules]) {
      const matches = redactedText.match(rule.regex);
      if (matches) {
        matchesCount += matches.length;
        redactedText = redactedText.replace(rule.regex, rule.label);
      }
    }
  });

  return { redactedText, matchesCount };
}
