import emailValidator from 'email-validator';

function validateLogin(data) {
     const errorMessages = [];

     // Ensure that email and password fields are not empty 
     // Both are required
     if (!data.email || !data.password) {
          errorMessages.push('Missing fields')
     }

     // Use "email-validator" to validated email 
     if (!emailValidator.validate(data.email)) {
          errorMessages.push('Enter a valid email address');
     }

     return {
          errorMessages,
          isValid: errorMessages.length === 0
     }
}

export default validateLogin;