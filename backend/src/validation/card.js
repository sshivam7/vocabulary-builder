function validateDeck(data) {
     const errorMessages = [];

     // check for empty title and definition tags (these are required)
     if (!data.title || !data.definition) {
          errorMessages.push('Missing fields');
     }

     // ensure difficulty falls between 1 and 5
     if (data.difficulty < 1 || data.difficulty > 5) {
          errorMessages.push('Enter a valid difficulty');
     }

     return {
          errorMessages,
          isValid: errorMessages.length === 0,
     }

}

export default validateDeck;