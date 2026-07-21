/**
 * Validates an NPI using the Luhn algorithm, exactly as CMS defines it:
 * prepend the constant "80840" to the first 9 digits, then run a standard
 * Luhn check against all 10 given digits + that prefix.
 */
function isValidNPI(npi) {
  if (!/^\d{10}$/.test(npi)) return false;

  const withPrefix = "80840" + npi.slice(0, 9);
  let sum = 0;
  let alternate = true; // rightmost digit of the 14-digit string is doubled first

  for (let i = withPrefix.length - 1; i >= 0; i--) {
    let digit = parseInt(withPrefix[i], 10);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(npi[9], 10);
}

module.exports = { isValidNPI };
