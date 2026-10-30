import CurrencyVatModule from "../modules/currency-vat/index.js";

const currencyModule = new CurrencyVatModule();

export async function calculateProductPrice(product, currency) {
    const categories = {
        Elektronik: "standard",
        Accessoarer: "standard",
        Mat: "food",
        Böcker: "books",
    };

    const category = categories[product.category] || "standard";

    return await currencyModule.run(
        {
            amount: product.price,
            category,
            currency,
        },
        {
            productId: product.id,
        }
    );
}