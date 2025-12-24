
export interface CityData {
    name: string;
    slug: string;
    region: 'North' | 'South' | 'West' | 'East';
    metaTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    climateAdvice: string;
    popularProducts: string[];
    areasServed: string[];
    coordinates: {
        lat: number;
        lng: number;
    };
    weatherContext: string;
    possibleKeywords: string[];
}

export const CITIES: Record<string, CityData> = {
    'mumbai': {
        name: 'Mumbai',
        slug: 'mumbai',
        region: 'West',
        metaTitle: 'Buy Terracotta Tiles in Mumbai | Free Samples & Delivery',
        metaDescription: 'Premium terracotta tiles, clay bricks & jaali panels in Mumbai. Handmade, wirecut & pressed. Free samples. Same-day delivery in Mumbai, Navi Mumbai & Thane.',
        heroTitle: 'Premium Terracotta Tiles in',
        heroSubtitle: 'Buy handcrafted terracotta tiles, clay bricks & jaali panels. Free samples. Same-day delivery across Mumbai, Navi Mumbai & Thane.',
        climateAdvice: 'Mumbai\'s humid coastal climate requires low-absorption tiles to prevent algae growth. Our pressed terracotta tiles are perfect for this, offering superior resistance to moisture while maintaining breathability.',
        possibleKeywords: ['terracotta tiles Mumbai', 'exposed brick tiles Mumbai', 'jaali blocks Mumbai'],
        weatherContext: 'Humid Coastal',
        areasServed: [
            'South Mumbai', 'Navi Mumbai', 'Thane', 'Andheri',
            'Bandra', 'Powai', 'Goregaon', 'Borivali',
            'Malad', 'Kandivali', 'Dahisar', 'Mulund',
            'Ghatkopar', 'Kurla', 'Chembur', 'Vashi'
        ],
        coordinates: { lat: 19.0760, lng: 72.8777 },
        popularProducts: ['Pressed Bricks', 'Glazed Roof Tiles', 'Ventilation Jaalis']
    },
    'delhi': {
        name: 'Delhi',
        slug: 'delhi',
        region: 'North',
        metaTitle: 'Terracotta Tiles & Exposed Bricks Delhi NCR | UrbanClay',
        metaDescription: 'Leading supplier of exposed wirecut bricks and terracotta tiles in Delhi, Gurgaon & Noida. Perfect for modern farmhouses and facades. ISO certified.',
        heroTitle: 'Architectural Clay Products in',
        heroSubtitle: 'From modern farmhouses in Chhatarpur to contemporary offices in Gurgaon. Premium clay solutions for the Capital.',
        climateAdvice: 'For Delhi\'s extreme temperature variations, our high-thermal-mass terracotta tiles provide excellent insulation, keeping interiors cooler in summer and warmer in winter.',
        possibleKeywords: ['exposed bricks Delhi', 'wirecut bricks Gurgaon', 'terracotta tiles Noida'],
        weatherContext: 'Extreme Heat/Cold',
        areasServed: [
            'South Delhi', 'Gurgaon', 'Noida', 'Greater Noida',
            'Faridabad', 'Ghaziabad', 'Dwarka', 'Vasant Kunj',
            'Chhatarpur', 'Civil Lines', 'Rohini', 'Karol Bagh'
        ],
        coordinates: { lat: 28.6139, lng: 77.2090 },
        popularProducts: ['Wirecut Bricks', 'Hollow Clay Blocks', 'Facade Jaalis']
    },
    'bangalore': {
        name: 'Bangalore',
        slug: 'bangalore',
        region: 'South',
        metaTitle: 'Terracotta Tiles Bangalore | Sustainable Clay Products',
        metaDescription: 'Eco-friendly terracotta tiles and jaalis for Bangalore homes. Sustainable, breathable, and locally sourced. Perfect for the Garden City.',
        heroTitle: 'Sustainable Clay Studio in',
        heroSubtitle: 'Enhance your home with breathable, eco-friendly terracotta. The preferred choice for Bangalore\'s sustainable architecture.',
        climateAdvice: 'Bangalore\'s moderate climate is perfect for porous handmade tiles that breathe, regulating indoor humidity naturally and adding an earthy charm.',
        possibleKeywords: ['terracotta tiles Bangalore', 'clay jaali Bangalore', 'roofing tiles Bangalore'],
        weatherContext: 'Moderate Tropical',
        areasServed: [
            'Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar',
            'JP Nagar', 'HSR Layout', 'Hebbal', 'Yelahanka',
            'Electronic City', 'Malleswaram', 'Banashankari'
        ],
        coordinates: { lat: 12.9716, lng: 77.5946 },
        popularProducts: ['Handmade Tiles', 'Camp Jali', 'Mangalore Roof Tiles']
    },
    'pune': {
        name: 'Pune',
        slug: 'pune',
        region: 'West',
        metaTitle: 'Terracotta Cladding & Tiles Pune | UrbanClay',
        metaDescription: 'Designer terracotta cladding and floor tiles in Pune. Serving Baner, Wakad, Koregaon Park & more. Architect-preferred clay products.',
        heroTitle: 'Designer Clay Surfaces in',
        heroSubtitle: 'Serving Pune\'s vibrant design community with premium terracotta cladding and flooring solutions.',
        climateAdvice: 'Pune\'s dry heat demands materials with high thermal lag. Our thick terracotta wall cladding ensures your home stays pleasantly cool throughout the day.',
        possibleKeywords: ['exterior cladding Pune', 'terracotta flooring Pune', 'brick slips Pune'],
        weatherContext: 'Dry Heat',
        areasServed: [
            'Koregaon Park', 'Baner', 'Wakad', 'Kalyani Nagar',
            'Viman Nagar', 'Aundh', 'Hadapsar', 'Magarpatta',
            'Kothrud', 'Bavdhan', 'Hinjewadi', 'Pimpri-Chinchwad'
        ],
        coordinates: { lat: 18.5204, lng: 73.8567 },
        popularProducts: ['Linear Cladding', 'Floor Bricks', 'Decorative Jaalis']
    },
    'hyderabad': {
        name: 'Hyderabad',
        slug: 'hyderabad',
        region: 'South',
        metaTitle: 'Terracotta Tiles & Jaalis Hyderabad | UrbanClay',
        metaDescription: 'Premium terracotta jaalis and facade tiles in Hyderabad. Perfect for ventilation in hot climates. Jubilee Hills, Banjara Hills & Hitech City.',
        heroTitle: 'Ventilated Facades for',
        heroSubtitle: 'Beat the Hyderabad heat with our cooling terracotta jaalis and breathable facade tiles.',
        climateAdvice: 'In Hyderabad\'s hot semi-arid climate, our Terracotta Jaalis are essential for reducing solar gain while allowing cool breezes to circulate.',
        possibleKeywords: ['jaali blocks Hyderabad', 'terracotta elevation tiles', 'cooling tiles Hyderabad'],
        weatherContext: 'Hot Semi-Arid',
        areasServed: [
            'Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Gachibowli',
            'Madhapur', 'Kukatpally', 'Secunderabad', 'Manikonda',
            'Kondapur', 'Begumpet'
        ],
        coordinates: { lat: 17.3850, lng: 78.4867 },
        popularProducts: ['Screen Jaalis', 'Cooling Roof Tiles', 'Facade Baguettes']
    },
    'chennai': {
        name: 'Chennai',
        slug: 'chennai',
        region: 'South',
        metaTitle: 'Traditional & Modern Terracotta Chennai | UrbanClay',
        metaDescription: 'Authentic terracotta tiles for Chennai. Weather-proof pressed tiles and cooling roof tiles. Durable solutions for coastal homes.',
        heroTitle: 'Timeless Terracotta in',
        heroSubtitle: 'From traditional Chettinad styles to modern coastal homes. Durable, weather-resistant clay products for Chennai.',
        climateAdvice: 'Chennai\'s coastal humidity and heat require dense, low-porosity pressed tiles that resist salt corrosion while keeping interiors cool.',
        possibleKeywords: ['terracotta flooring Chennai', 'weathering tiles Chennai', 'roof tiles Chennai'],
        weatherContext: 'Hot Humid Coastal',
        areasServed: [
            'Adyar', 'Anna Nagar', 'Besant Nagar', 'ECR',
            'OMR', 'Velachery', 'T Nagar', 'Mylapore',
            'Alwarpet', 'Nungambakkam'
        ],
        coordinates: { lat: 13.0827, lng: 80.2707 },
        popularProducts: ['Weathering Tiles', 'Pressed Pavers', 'Roof Tiles']
    },
    'ahmedabad': {
        name: 'Ahmedabad',
        slug: 'ahmedabad',
        region: 'West',
        metaTitle: 'Exposed Brick & Terracotta Ahmedabad | UrbanClay',
        metaDescription: 'Premium exposed bricks and terracotta architectural products in Ahmedabad. Honoring the city\'s rich heritage of brick architecture.',
        heroTitle: 'Brick Heritage of',
        heroSubtitle: 'Celebrating Ahmedabad\'s legacy of exposed brick architecture with our premium wirecut and handmade collections.',
        climateAdvice: 'For Ahmedabad\'s dry heat, exposed brick walls with cavity construction offer the best thermal comfort and sustainable cooling.',
        possibleKeywords: ['exposed brick Ahmedabad', 'wirecut bricks Gujarat', 'architectural terracotta'],
        weatherContext: 'Hot Dry',
        areasServed: [
            'Satellite', 'Bodakdev', 'Thaltej', 'Vastrapur',
            'Navrangpura', 'Maninagar', 'Gota', 'Science City',
            'SG Highway', 'Gandhinagar'
        ],
        coordinates: { lat: 23.0225, lng: 72.5714 },
        popularProducts: ['Exposed Wirecut', 'Cavity Blocks', 'Brise Soleil']
    },
    'goa': {
        name: 'Goa',
        slug: 'goa',
        region: 'West',
        metaTitle: 'Terracotta Tiles Goa | Portuguese Style Flooring',
        metaDescription: 'Authentic Portuguese-style terracotta tiles for Goa villas. Weather-proof, cooling, and salt-resistant. Perfect for coastal homes and resorts.',
        heroTitle: 'Coastal Luxury in',
        heroSubtitle: 'Handcrafted terracotta tiles that blend perfectly with Goa\'s Portuguese heritage and coastal vibe.',
        climateAdvice: 'Goa\'s tropical humidity and heavy monsoons demand low-porosity tiles. Our specially treated terracotta resists moss growth and withstands coastal weathering.',
        possibleKeywords: ['Goa flooring tiles', 'Portuguese tiles Goa', 'resort architecture'],
        weatherContext: 'Tropical Monsoon',
        areasServed: ['Panjim', 'Margao', 'Mapusa', 'Porvorim', 'Vasco', 'Candolim', 'Calangute', 'Assagao'],
        coordinates: { lat: 15.2993, lng: 74.1240 },
        popularProducts: ['Antique Pavers', 'Roof Tiles', 'Balcony Jaalis']
    },
    'surat': {
        name: 'Surat',
        slug: 'surat',
        region: 'West',
        metaTitle: 'Premium Brick & Terracotta Surat | UrbanClay',
        metaDescription: 'High-quality wirecut bricks and elevation tiles in Surat. Serving Vesu, Adajan & more. Modern cladding solutions for commercial and residential projects.',
        heroTitle: 'Modern Elevations in',
        heroSubtitle: 'Elevate Surat\'s skyline with our precision-engineered wirecut bricks and seamless terracotta cladding.',
        climateAdvice: 'For Surat\'s humid summers, our ventilated terracotta facades reduce heat absorption, lowering indoor temperatures naturally.',
        possibleKeywords: ['elevation tiles Surat', 'brick cladding Gujarat', 'architectural facade'],
        weatherContext: 'Tropical Savanna',
        areasServed: ['Vesu', 'Adajan', 'Piplod', 'Dumas Road', 'City Light', 'Varachha', 'Katargam'],
        coordinates: { lat: 21.1702, lng: 72.8311 },
        popularProducts: ['Linear Brick', 'Ventilated Facade', 'Grey Wirecut']
    }
};

export const regions = {
    South: ['bangalore', 'hyderabad', 'chennai', 'kochi', 'coimbatore'],
    West: ['mumbai', 'pune', 'ahmedabad', 'surat', 'goa'],
    North: ['delhi', 'gurgaon', 'noida', 'chandigarh', 'jaipur', 'lucknow']
};
