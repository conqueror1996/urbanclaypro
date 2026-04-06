
export interface KnowledgeEntry {
    term: string;
    slug: string;
    definition: string;
    technicalDetail: string;
    relatedProductCategory: string;
    importance: 'High' | 'Medium' | 'Low';
}

export const KNOWLEDGE_BASE: Record<string, KnowledgeEntry> = {
    'efflorescence': {
        term: 'Efflorescence',
        slug: 'efflorescence',
        definition: 'The white salt deposits often seen on brick or stone surfaces when moisture evaporates.',
        technicalDetail: 'In terracotta, efflorescence occurs when soluble salts within the clay or mortar migrate to the surface. UrbanClay products are high-fired and tested for low-efflorescence to ensure a clean, maintenance-free facade.',
        relatedProductCategory: 'exposed-bricks',
        importance: 'High'
    },
    'thermal-mass': {
        term: 'Thermal Mass',
        slug: 'thermal-mass',
        definition: 'The ability of a material to absorb, store, and later release heat energy.',
        technicalDetail: 'Clay products have high thermal mass. This means they absorb heat during the hot Indian afternoons and release it slowly at night, naturally cooling the building interior by up to 5°C.',
        relatedProductCategory: 'facades',
        importance: 'High'
    },
    'wirecut-process': {
        term: 'Wirecut Process',
        slug: 'wirecut-process',
        definition: 'A method of brick manufacturing where clay is extruded through a die and cut by wires.',
        technicalDetail: 'This process results in precision-engineered bricks with sharp edges and uniform textures, ideal for modern architectural masonry where clean lines and low mortar joints are required.',
        relatedProductCategory: 'wirecut-bricks',
        importance: 'Medium'
    },
    'passive-cooling': {
        term: 'Passive Cooling',
        slug: 'passive-cooling',
        definition: 'A building design approach that focuses on heat gain control and heat dissipation without mechanical systems.',
        technicalDetail: 'Using Terracotta Jaali is a prime example of passive cooling. By allowing for cross-ventilation and solar shading, it reduces the indoor temperature significantly without electricity.',
        relatedProductCategory: 'terracotta-jaali',
        importance: 'High'
    },
    'vitrification': {
        term: 'Vitrification',
        slug: 'vitrification',
        definition: 'The process where clay particles fuse together at high temperatures to create a glass-like, non-porous structure.',
        technicalDetail: 'Our floor tiles and pavers are fired to partial vitrification, ensuring high compressive strength and extremely low water absorption (<10%), making them frost and salt resistant.',
        relatedProductCategory: 'floor-tiles',
        importance: 'Medium'
    },
    'rainscreen-cladding': {
        term: 'Rainscreen Cladding',
        slug: 'rainscreen-cladding',
        definition: 'A double-wall construction where the outer layer (the rainscreen) keeps out the rain, and the inner layer (the facade) provides insulation.',
        technicalDetail: 'Our Terracotta Facade Panels are designed for ventilated rainscreen systems. The air cavity between the panel and the building wall allows for moisture dissipation and additional thermal insulation.',
        relatedProductCategory: 'facades',
        importance: 'High'
    }
};

export function getKnowledgeByTerm(term: string): KnowledgeEntry | undefined {
    return Object.values(KNOWLEDGE_BASE).find(k => k.term.toLowerCase() === term.toLowerCase());
}

export function getKnowledgeBySlug(slug: string): KnowledgeEntry | undefined {
    return KNOWLEDGE_BASE[slug];
}
