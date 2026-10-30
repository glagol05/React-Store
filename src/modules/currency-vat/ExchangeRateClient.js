class ExchangeRateClient {
    constructor() {
        this.rates = null;
        this.lastUpdated = null;
    }

    async fetchRates() {
        try {
            const response = await fetch("/api/rates");

            if (!response.ok) {
                throw new Error("Kunde inte hämta valutakurser.");
            }

            const rates = await response.json();

            if (
                !rates ||
                typeof rates !== "object" ||
                !rates.SEK ||
                !rates.EUR ||
                !rates.USD
            ) {
                throw new Error("Ogiltiga valutakurser från API:et.");
            }

            this.rates = rates;
            this.lastUpdated = Date.now();

            return this.rates;
        } catch (error) {
            throw new Error(`Fel vid hämtning av valutakurser: ${error.message}`);
        }
    }

    async getRates() {
        if (this.rates) {
            return this.rates;
        }

        return await this.fetchRates();
    }

    clearCache() {
        this.rates = null;
        this.lastUpdated = null;
    }
}

export default ExchangeRateClient;