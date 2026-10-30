export function calculateShipping(cart, destination) {
    const total = cart.reduce(
        (sum, product) => sum + product.price,
        0
    );

    if (cart.length === 0) {
        return 0;
    }

    switch (destination) {
        case "sverige":
        return total >= 1000 ? 0 : 49;

        case "norden":
        return 99;

        case "europa":
        return 149;

        default:
        return 0;
    }
}