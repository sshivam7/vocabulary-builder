import emailValidator from 'email-validator';

function validateRegistration(data) {
  const errorMessages = [];

  // ensure email password, check password are all not empty
  // These are all required
  if (!data.email || !data.password || !data.passwordCheck || !data.displayName) {
    errorMessages.push('Missing fields');
  } else {
    // ensure password is longer than 5 (6 or above)
    if (data.password.length < 6) {
      errorMessages.push('The password needs to be at least 6 characters long');
    }
    // check if passwords match 
    if (data.password !== data.passwordCheck) {
      errorMessages.push('The passwords did not match');
    }

    // Validate registration email using "email-validator"
    if (!emailValidator.validate(data.email)) {
      errorMessages.push('Enter a valid email address');
    }
  }

  return {
    errorMessages,
    isValid: errorMessages.length === 0,
  };
}

export default validateRegistration;
