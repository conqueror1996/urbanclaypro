
const { getProducts } = require('./lib/products.ts');

async function debugProducts() {
    try {
        console.log('Fetching products...');
        const products = await getProducts();
        console.log(`Fetched ${products.length} products`);

        products.slice(0, 5).forEach(p => {
            console.log(`\nProduct: ${p.title}`);
            console.log(`  imageUrl: ${p.imageUrl}`);
            console.log(`  images[0]: ${p.images ? p.images[0] : 'N/A'}`);

            let raw = p.imageUrl || (p.images && p.images[0]);
            if (raw) {
                const final = raw.includes('?')
                    ? `${raw}&w=1800&q=90&auto=format`
                    : `${raw}?w=1800&q=90&auto=format`;
                console.log(`  FINAL URL: ${final}`);
            } else {
                console.log('  NO IMAGE SOURCE FOUND');
            }
        });

    } catch (e) {
        console.error(e);
    }
}

// Mocking the getProducts because we can't easily run TS file directly without setup
// Actually, I can try to run it with ts-node if available, or just inspect the file.
// Since I can't restart the dev server or run ts-node easily, I'll use the existing dev server logs if possible, 
// OR I will modify the Page component to print these details to the webpage visible interface temporarily.
