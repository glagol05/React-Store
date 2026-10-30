# Valuta & moms

## Beskrivning

Modulen beräknar svensk moms och konverterar priser mellan SEK, EUR och USD. Syftet är att kunna återanvända samma logik i webbshoppen utan att behöva skriva om beräkningarna i olika delar av applikationen.

## Klasser och ansvar

- **CurrencyVatModule:** Modulens huvudklass. Samordnar de övriga klasserna och hanterar beräkningen genom metoden `run()`.
- **ExchangeRateClient:** Hämtar valutakurser asynkront från API:et och cachar resultatet för att undvika onödiga API-anrop.
- **Money:** Representerar ett penningbelopp med tillhörande valuta. Hanterar valutakonvertering, moms och formatering. Förhindrar även att belopp i olika valutor adderas av misstag.
- **TaxTable:** Innehåller svenska momssatser och ansvarar för att hämta rätt momssats utifrån produktkategori.

## Momssatser

- Standard: 25 %
- Mat: 12 %
- Böcker: 6 %

## Klassernas relationer och designval

Modulen använder komposition. `CurrencyVatModule` skapar och använder instanser av `ExchangeRateClient` och `TaxTable`. Den använder även `Money` för att utföra beräkningar på belopp.

Jag valde denna struktur eftersom varje klass har ett tydligt och avgränsat ansvar. Det gör koden lättare att förstå, testa och återanvända. Det blir också enklare att ändra exempelvis valutahanteringen utan att behöva ändra momsreglerna.

## Användning

Modulen används genom sin publika ingångspunkt `index.js`. Den tar emot ett belopp, en produktkategori och en önskad valuta genom metoden `run(values, context)` och returnerar ett beräknat pris inklusive moms.

## Asynkron funktionalitet och tillstånd

Valutakurser hämtas asynkront från API:et. Kurserna cachas i `ExchangeRateClient` så att samma instans kan återanvända tidigare hämtade kurser mellan flera anrop.

Modulens instans sparar även det senaste beräkningsresultatet. Detta gör att modulen har ett bestående tillstånd mellan körningar.