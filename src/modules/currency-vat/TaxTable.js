class TaxTable {
    constructor() {
        this.taxRates = {
            standard: 25,
            food: 12,
            books: 6,
        };
    }

    getTaxRate(category) {
        const rate = this.taxRates[category];

        if (rate === undefined) {
            throw new Error(`Okänd momskategori: ${category}`);
        }

        return rate;
    }

    calculateTax(amount, category) {
        if (
            !Number.isFinite(amount) ||
            amount < 0
        ) {
            throw new Error("Ange ett giltigt belopp för momsberäkningen.");
        }

        const rate = this.getTaxRate(category);

        return amount * (rate / 100);
    }

    calculatePriceIncludingTax(amount, category) {
        const tax = this.calculateTax(amount, category);

        return amount + tax;
    }
}

export default TaxTable;