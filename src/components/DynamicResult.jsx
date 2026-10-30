function DynamicResult({ result }) {
    if (!result) return null;

    return (
        <section className="result">
        <h2>Resultat</h2>

        <p>
            Ursprungligt pris: {result.originalPrice}
        </p>

        <p>
            Momssats: {result.taxRate} %
        </p>

        <p>
            Vald valuta: {result.currency}
        </p>

        <h3>Pris inklusive moms: {result.finalPrice}</h3>
        </section>
    );
}

export default DynamicResult;