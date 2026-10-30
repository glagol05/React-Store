import ExchangeRateClient from "./ExchangeRateClient.js";
import Money from "./Money.js";
import TaxTable from "./TaxTable.js";

class CurrencyVatModule {
    static descriptor = {
        name: "Valuta och moms",
        description: "Beräknar moms och konverterar priser mellan valutor.",
        fields: [
            {
                name: "amount",
                label: "Pris exklusive moms (SEK)",
                type: "number",
                required: true,
            },
            {
                name: "category",
                label: "Produktkategori",
                type: "select",
                options: [
                    { value: "standard", label: "Standard – 25 %" },
                    { value: "food", label: "Mat – 12 %" },
                    { value: "books", label: "Böcker – 6 %" },
                ],
                required: true,
            },
            {
                name: "currency",
                label: "Visa pris i",
                type: "select",
                options: [
                    { value: "SEK", label: "SEK" },
                    { value: "EUR", label: "EUR" },
                    { value: "USD", label: "USD" },
                ],
                required: true,
            },
        ],
    };

    constructor() {
        this.exchangeRateClient = new ExchangeRateClient();
        this.taxTable = new TaxTable();
        this.lastResult = null;
    }

    async run(values, context) {
        if (!values || typeof values !== "object") {
            throw new Error("Ogiltiga indata. Kontrollera formuläret.");
        }

        const { amount, category, currency } = values;

        if (
            amount === "" ||
            amount === null ||
            amount === undefined ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) < 0
        ) {
            throw new Error("Ange ett giltigt pris.");
        }

        if (!["SEK", "EUR", "USD"].includes(currency)) {
            throw new Error("Välj en giltig valuta.");
        }

        const taxRate = this.taxTable.getTaxRate(category);
        const rates = await this.exchangeRateClient.getRates();

        const price = new Money(Number(amount), "SEK");
        const priceIncludingTax = price.addTax(taxRate);
        const convertedPrice = priceIncludingTax.convert(currency, rates);

        this.lastResult = {
            originalPrice: price.format(),
            taxRate,
            currency,
            finalAmount: convertedPrice.amount,
            finalPrice: convertedPrice.format(),
            context,
        };

        return this.lastResult;
    }

    async convertAmount(amount, currency) {
        const rates = await this.exchangeRateClient.getRates();
        const price = new Money(Number(amount), "SEK");
        const convertedPrice = price.convert(currency, rates);

        return convertedPrice.amount;
    }
}

export default CurrencyVatModule;