function validateDeck(data) {
     const errorMessages = [];

     // Ensure title is not empty (this is a required field)
     if (!data.title) {
          errorMessages.push('Missing fields');
     }

     return {
          errorMessages,
          isValid: errorMessages.length === 0,
     }

}

export default validateDeck;