
import { Product } from './types';

// SEO-Optimized Descriptions conforming to 300+ words best practices
const DESCRIPTIONS: Record<string, string> = {
    // Falls back to category-based descriptions if specific slug not found
    'exposed-brick': `
        Experience the timeless elegance of our Premium Exposed Wirecut Bricks, meticulously crafted for architects and builders who demand both aesthetic superiority and structural integrity. Unlike standard masonry units, our exposed bricks are engineered using high-grade terracotta clay, fired at temperatures exceeding 1000°C to ensure exceptional durability, low water absorption, and resistance to efflorescence.

        **Architectural Excellence & Versatility:**
        These bricks feature a distinct, crisp edge and a rich, natural red-orange hue that brings warmth and character to any façade. Perfect for contemporary residential exteriors, industrial-chic interiors, and commercial landmark projects, they offer a versatile palette for creative laying patterns—from classic stretcher bonds to intricate hit-and-miss jaali walls. The wirecut texture provides a subtle, uniform grain that catches light beautifully, adding depth and shadow play to your building's skin.

        **Performance & Sustainability:**
        Beyond their stunning visual appeal, our exposed bricks act as a natural thermal insulator. The thermal mass properties of terracotta help regulate indoor temperatures, keeping interiors cooler in Indian summers and reducing HVAC loads. This makes them an ideal choice for sustainable, eco-friendly construction projects aiming for IGBC or LEED certification. Being a natural material, they are free from VOCs and toxic coatings, promoting a healthy living environment.

        **Technical Specifications:**
        - **Compressive Strength:** High load-bearing capacity suitable for structural walls.
        - **Water Absorption:** Optimized (<12%) to prevent dampness and moss growth.
        - **Durability:** Weather-resistant surface that ages gracefully, requiring minimal maintenance over decades.
        
        Transform your project with the authentic charm of UrbanClay’s exposed bricks—where traditional craftsmanship meets modern architectural performance.
    `,
    'brick-tile': `
        Redefine your surfaces with our ultra-thin Terracotta Brick Cladding Tiles, the perfect solution for achieving the classic exposed brick look without the structural weight or lost carpet area. Designed for both renovation and new construction, these facings are authentic slices of kiln-fired clay, not imitation concrete or plaster.

        **Seamless Aesthetics for Interiors & Exteriors:**
        Whether you are designing a cozy living room accent wall, a rugged cafe interior, or a massive commercial façade, these tiles offer indistinguishable aesthetics from full-width masonry. At just 20mm thickness, they preserve valuable floor space while delivering the rich texture, variegated tones, and tactile warmth that only real terracotta can provide. Their lightweight nature makes them readily applicable over existing plastered walls, drywall, or plywood substrates.

        **Ease of Installation & Maintenance:**
        Our brick tiles are precision-cut for uniformity, ensuring ease of installation with standard tile adhesives. They are naturally resistant to fading, fire, and pests. Unlike wallpaper or faux-panels, they perform excellently in exterior weather conditions, resisting UV degradation and heavy monsoon rain. Minimal maintenance is required—a simple wash periodically restores their original luster.

        **Sustainable Design Choice:**
        Manufactured from natural clay deposits and fired using energy-efficient kiln technology, these tiles are a sustainable facade alternative. They carry the inherent thermal insulation benefits of clay, contributing to the overall building envelope efficiency. Available in a spectrum of earthy tones—from deep Rustic Red to muted Beige and antique blends—they allow for unlimited design customization.

        Elevate your architectural narrative with UrbanClay Brick Tiles—lightweight, authentic, and enduring.
    `,
    'terracotta-jaali': `
        UrbanClay’s Terracotta Jaali Panels represent the perfect fusion of traditional Indian vernacular perforated masonry and modern bioclimatic design. These architectural screen blocks are engineered to facilitate passive cooling, natural ventilation, and dynamic light play, making them an essential element for climate-responsive architecture in tropical regions like India.

        **Bioclimatic Functionality - "Breathing Walls":**
        The primary function of our Jaali blocks is to temper the harsh glare of the sun while allowing cool breezes to permeate through the building. This "stack effect" reduces the reliance on artificial cooling systems, lowering energy costs and carbon footprints. They are ideal for screening semi-outdoor spaces, verandas, stairwells, and facade skins where privacy and airflow must coexist.

        **Visual Poetry & Privacy:**
        Aesthetically, the Jaali creates a constantly changing tapestry of light and shadow throughout the day. As sunlight filters through the geometric perforations, it paints dynamic patterns on interior floors and walls, creating a serene, temple-like ambiance. From the exterior, they provide an effective visual barrier, offering privacy from the street without blocking the view from the inside—a hallmark of smart urban design.

        **Craftsmanship & Durability:**
        Molded from high-quality terracotta clay and high-fired for strength, our Jaali blocks are structurally robust and practically maintenance-free. They do not fade, rust, or degrade. Their modular design allows for rapid installation and structural reinforcement where necessary.

        Bring your spaces to life with the interplay of light and air. Choose UrbanClay Jaali—where sustainable function meets artistic form.
    `,
    'floor-tile': `
        Ground your spaces in the earthy warmth of our Heritage Terracotta Floor Tiles. Reminiscent of old-world courtyards and colonial bungalows, these tiles offer a sustainable, cool-to-touch flooring solution that naturally regulates indoor temperature and gets more beautiful with time.

        **Thermal Comfort & Natural Feel:**
        Known for their high thermal inertia, terracotta floors remain pleasant to walk on barefoot year-round—cool in the sweltering heat and moderately warm in winter. This makes them a preferred choice for tropical homes, eco-resorts, yoga studios, and heritage restoration projects. The natural porosity, when properly sealed, provides a breathable surface that manages humidity effectively.

        **Ageless Patina:**
        Unlike synthetic vitrified tiles that look sterile, terracotta develops a rich, leather-like patina over years of use. Each tile bears the subtle marks of the firing process, ensuring that no two floors look exactly alike. Available in classic squares, rectangles, and hexagons, they can be laid in varied patterns to suit both rustic and contemporary minimal aesthetics.

        **Eco-Friendly & Non-Toxic:**
        Made from 100% natural clay and water, our floor tiles are free from harmful chemicals, glazes, and volatile organic compounds (VOCs). They are fully biodegradable and recyclable. Their production process has a significantly lower embodied energy compared to ceramic or cement tiles.

        Step onto nature every day. UrbanClay Terracotta Floor Tiles impart a grounding, meditative quality to modern living spaces.
    `
};

export function enhanceProduct(product: Product): Product {
    // 1. Identify best match
    // Check specific slug first (if we had specific ones), then category slug, then tag
    const categorySlug = product.category?.slug || '';
    const tag = product.tag ? product.tag.toLowerCase().replace(/\s+/g, '-') : '';

    let richDescription = '';

    if (DESCRIPTIONS[product.slug]) {
        richDescription = DESCRIPTIONS[product.slug];
    } else if (categorySlug && (categorySlug.includes('exposed') || categorySlug.includes('brick'))) {
        richDescription = DESCRIPTIONS['exposed-brick'];
    } else if (categorySlug && (categorySlug.includes('tile') || categorySlug.includes('cladding'))) {
        richDescription = DESCRIPTIONS['brick-tile'];
    } else if (categorySlug && categorySlug.includes('jaali')) {
        richDescription = DESCRIPTIONS['terracotta-jaali'];
    } else if (tag.includes('floor')) {
        richDescription = DESCRIPTIONS['floor-tile'];
    }

    // 2. Optimization Logic
    // STRICT USER CONTROL: If the user has entered ANY description in the CMS, respect it 100%.
    // Do not append or fallback to generic content, even if the user's text is short.
    if (product.description && product.description.trim().length > 0) {
        return product;
    }

    // Only strictly fallback if the CMS field is undefined or completely empty.
    if (richDescription) {
        // Clean whitespace
        richDescription = richDescription.replace(/^\s+|\s+$/g, '').replace(/\n\s+/g, '\n');

        return {
            ...product,
            description: product.description ? `${product.description}\n\n${richDescription}` : richDescription,
            seo: {
                ...product.seo,
                metaDescription: product.seo?.metaDescription || richDescription.slice(0, 160).replace(/\n/g, ' ') + '...'
            }
        };
    }

    return product;
}

export function enhanceProducts(products: Product[]): Product[] {
    return products.map(enhanceProduct);
}
