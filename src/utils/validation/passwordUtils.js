// Utility functions for password validation and strength

export function getPasswordStrength(password) {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  let strength = 0;
  if (hasMinLength) strength++;
  if (hasLetter) strength++;
  if (hasNumber) strength++;

  if (strength === 0 || strength === 1) return "Too weak";
  if (strength === 2) return "Medium";
  return "Strong";
}

export function getPasswordCriteria(password) {
  return {
    hasMinLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}
