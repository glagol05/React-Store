const campaigns = {
        NORDIC10: 10,
        SOMMAR20: 20,
        WELCOME15: 15,
    };

    export function getDiscount(code) {
        const normalizedCode = code.trim().toUpperCase();

        if (campaigns[normalizedCode]) {
            return campaigns[normalizedCode];
        }

        return 0;
}