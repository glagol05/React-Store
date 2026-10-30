class Money {
    constructor(amount, currency) {
        if (typeof amount !== "number" || !Number.isFinite(amount)) {
            throw new Error("Beloppet måste vara ett giltigt nummer.");
        }

        if (amount < 0) {
            throw new Error("Beloppet får inte vara negativt.");
        }

        if (!["SEK", "EUR", "USD"].includes(currency)) {
            throw new Error("Valutan stöds inte.");
        }

        this.amount = amount;
        this.currency = currency;
    }

    convert(targetCurrency, rates) {
        if (
            !rates ||
            !Number.isFinite(rates[this.currency]) ||
            rates[this.currency] <= 0 ||
            !Number.isFinite(rates[targetCurrency]) ||
            rates[targetCurrency] <= 0
        ) {
            throw new Error("Ogiltig eller saknad valutakurs.");
        }

        const amountInSEK = this.amount / rates[this.currency];
        const convertedAmount = amountInSEK * rates[targetCurrency];

        return new Money(convertedAmount, targetCurrency);
    }

    addTax(vatRate) {
        if (
            !Number.isFinite(vatRate) ||
            vatRate < 0 ||
            vatRate > 100
        ) {
            throw new Error("Ogiltig momssats.");
        }

        const taxedAmount = this.amount * (1 + vatRate / 100);

        return new Money(taxedAmount, this.currency);
    }

    add(otherMoney) {
        if (!(otherMoney instanceof Money)) {
            throw new Error("Du kan bara addera ett annat penningbelopp.");
        }

        if (this.currency !== otherMoney.currency) {
            throw new Error("Kan inte addera olika valutor.");
        }

        return new Money(
            this.amount + otherMoney.amount,
            this.currency
        );
    }

    format() {
        return new Intl.NumberFormat("sv-SE", {
            style: "currency",
            currency: this.currency,
        }).format(this.amount);
    }
}

export default Money;