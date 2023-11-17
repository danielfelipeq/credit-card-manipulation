export class CardValidator {
    public isValid(cardNumber: string, cvv: string, expirationMonth: number, expirationYear: number): boolean {
        // Validate card number
        if (!this.isValidCardNumber(cardNumber)) {
            return false;
        }

        // Validate CVV
        if (!this.isValidCVV(cvv)) {
            return false;
        }

        // Validate expiration date
        if (!this.isValidExpirationDate(expirationMonth, expirationYear)) {
            return false;
        }

        return true;
    }

    private isValidCardNumber(cardNumber: string): boolean {
        // Check card number length
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            return false;
        }

        // Check card number digits
        for (let i = 0; i < cardNumber.length; i++) {
            if (isNaN(parseInt(cardNumber[i]))) {
                return false;
            }
        }

        // Check card number Luhn algorithm
        return this.isValidLuhn(cardNumber);
    }

    private isValidCVV(cvv: string): boolean {
        // Check CVV length
        if (cvv.length < 3 || cvv.length > 4) {
            return false;
        }

        // Check CVV digits
        for (let i = 0; i < cvv.length; i++) {
            if (isNaN(parseInt(cvv[i]))) {
                return false;
            }
        }

        return true;
    }

    private isValidExpirationDate(expirationMonth: number, expirationYear: number): boolean {
        // Check expiration month
        if (expirationMonth < 1 || expirationMonth > 12) {
            return false;
        }

        // Check expiration year
        if (expirationYear < new Date().getFullYear()) {
            return false;
        }

        return true;
    }

    private isValidLuhn(cardNumber: string): boolean {
        let sum = 0;
        let isOdd = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);

            if (isOdd) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isOdd = !isOdd;
        }

        return sum % 10 === 0;
    }
}
