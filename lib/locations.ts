
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
    },
    'maharashtra': {
        name: 'Maharashtra',
        slug: 'maharashtra',
        region: 'West',
        metaTitle: 'Premium Terracotta Tiles & Bricks Maharashtra | UrbanClay',
        metaDescription: 'India\'s leading terracotta supplier serving Maharashtra. Durable clay tiles, bricks & jaalis for Mumbai, Pune, Nagpur & Nashik. Weather-proof architectural solutions.',
        heroTitle: 'Clay Excellence across',
        heroSubtitle: 'From the rainy Konkan coast to the vibrant cities of the Deccan. High-performance terracotta for Maharashtra\'s diverse landscape.',
        climateAdvice: 'Maharashtra\'s varied climate, from humidity in the Konkan to dry heat in Vidarbha, demands versatile materials. Our low-efflorescence bricks and moisture-resistant tiles are engineered for all-weather durability.',
        possibleKeywords: ['terracotta tiles Maharashtra', 'brick suppliers Maharashtra', 'cladding tiles Mumbai Pune'],
        weatherContext: 'Varied Tropical',
        areasServed: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur'],
        coordinates: { lat: 19.7515, lng: 75.7139 },
        popularProducts: ['Pressed Bricks', 'Roof Tiles', 'Wall Cladding']
    },
    'gujarat': {
        name: 'Gujarat',
        slug: 'gujarat',
        region: 'West',
        metaTitle: 'Terracotta Tiles & Exposed Bricks Gujarat | UrbanClay India',
        metaDescription: 'Finest clay architectural products in Gujarat. Serving Ahmedabad, Surat, Vadodara & Rajkot. Perfect for the state\'s rich architectural heritage and extreme heat.',
        heroTitle: 'Heritage & Innovation in',
        heroSubtitle: 'Blending Gujarat\'s traditional brick legacy with modern terracotta technology for cooling and aesthetics.',
        climateAdvice: 'Gujarat\'s intense summer heat requires materials with high thermal mass. Our clay hollow blocks and terracotta cladding significantly reduce HVAC loads in regions like Kutch and Ahmedabad.',
        possibleKeywords: ['exposed brick Gujarat', 'terracotta tiles Ahmedabad', 'clay jaali Surat'],
        weatherContext: 'Arid to Semi-Arid',
        areasServed: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar'],
        coordinates: { lat: 22.2587, lng: 71.1924 },
        popularProducts: ['Hollow Blocks', 'Wirecut Bricks', 'Shield Jaalis']
    },
    'karnataka': {
        name: 'Karnataka',
        slug: 'karnataka',
        region: 'South',
        metaTitle: 'Terracotta Roofing & Tiles Karnataka | UrbanClay Studio',
        metaDescription: 'Premium terracotta tiles and jaalis for Karnataka. Specialists in Mangalore roof tiles and breathable clay products for Bangalore, Mysore & Hubli.',
        heroTitle: 'Sustainable Living in',
        heroSubtitle: 'Eco-friendly, breathable clay products for Karnataka\'s green architecture. The home of the authentic Mangalore roof tile.',
        climateAdvice: 'With heavy monsoons in the Western Ghats and moderate weather in the plateau, Karnataka is the heartland of terracotta. Our tiles offer natural insulation and superior water runoff.',
        possibleKeywords: ['terracotta tiles Karnataka', 'Mangalore roof tiles prices', 'clay jaali Bangalore'],
        weatherContext: 'Tropical Wet & Dry',
        areasServed: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary'],
        coordinates: { lat: 15.3173, lng: 75.7139 },
        popularProducts: ['Mangalore Roof Tiles', 'Balcony Jaalis', 'Floor Bricks']
    },
    'tamil-nadu': {
        name: 'Tamil Nadu',
        slug: 'tamil-nadu',
        region: 'South',
        metaTitle: 'Terracotta Tiles & Jaalis Tamil Nadu | UrbanClay India',
        metaDescription: 'Traditional and modern clay products for Tamil Nadu. Serving Chennai, Coimbatore, Madurai & Trichy. High-durability terracotta for coastal and inland heat.',
        heroTitle: 'Timeless Architecture in',
        heroSubtitle: 'Upholding Tamil Nadu\'s rich architectural heritage with premium, low-maintenance terracotta solutions.',
        climateAdvice: 'Tamil Nadu\'s high humidity and coastal salt-air (in Chennai/Tuticorin) require dense, vitrified clay tiles. Our products resist salt-weathering and keep interiors naturally cool.',
        possibleKeywords: ['terracotta flooring Tamil Nadu', 'cool roof tiles Chennai', 'brick tiles Coimbatore'],
        weatherContext: 'Hot Humid',
        areasServed: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'],
        coordinates: { lat: 11.1271, lng: 78.6569 },
        popularProducts: ['Pressed Floor Tiles', 'Louvers', 'Heritage Bricks']
    },
    'rajasthan': {
        name: 'Rajasthan',
        slug: 'rajasthan',
        region: 'North',
        metaTitle: 'Terracotta Cladding & Bricks Rajasthan | UrbanClay',
        metaDescription: 'Heat-resistant terracotta cladding and exposed bricks for Rajasthan. Ideal for luxury desert villas and contemporary homes in Jaipur, Jodhpur & Udaipur.',
        heroTitle: 'Resilient Design in',
        heroSubtitle: 'Cooling clay solutions designed to thrive in Rajasthan\'s golden sands and vibrant architecture.',
        climateAdvice: 'For Rajasthan\'s extreme desert heat, terracotta is the ultimate material. It acts as a thermal buffer, preventing the harsh sun from heating up your interiors.',
        possibleKeywords: ['terracotta cladding Rajasthan', 'exposed brick Jaipur', 'heat resistant tiles Jodhpur'],
        weatherContext: 'Hot Arid Desert',
        areasServed: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar'],
        coordinates: { lat: 27.0238, lng: 74.2179 },
        popularProducts: ['Thick Cladding', 'Hollow Bricks', 'Desert Jaalis']
    },
    'kerala': {
        name: 'Kerala',
        slug: 'kerala',
        region: 'South',
        metaTitle: 'Authentic Terracotta Roof & Floor Tiles Kerala | UrbanClay',
        metaDescription: 'High-quality terracotta for the tropical climate of Kerala. Water-proof roofing, breathable jaalis and cool floor tiles for Kochi, Trivandrum & Kozhikode.',
        heroTitle: 'Tropical Sanctuary in',
        heroSubtitle: 'Seamlessly blending with Kerala\'s lush landscapes and traditional Naalukettu architecture.',
        climateAdvice: 'In Kerala\'s heavy monsoons, water-proofing is key. Our terracotta tiles feature deep grooves for rapid drainage and anti-fungal properties to resist moss.',
        possibleKeywords: ['terracotta roof tiles Kerala', 'clay flooring Kochi', 'jaali design Kerala'],
        weatherContext: 'Tropical Wet',
        areasServed: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur'],
        coordinates: { lat: 10.8505, lng: 76.2711 },
        popularProducts: ['Interlocking Roof Tiles', 'Polished Floor Tiles', 'Garden Jaalis']
    },
    'telangana': {
        name: 'Telangana',
        slug: 'telangana',
        region: 'South',
        metaTitle: 'Terracotta Facades & Bricks Telangana | UrbanClay',
        metaDescription: 'Leading supplier of ventilated clay facades and jaalis in Telangana. Serving Hyderabad, Warangal & Nizamabad. Expert cooling solutions for hot climates.',
        heroTitle: 'Architectural Innovation in',
        heroSubtitle: 'Transforming Telangana\'s urban landscape with sustainable, high-precision clay facades and jaali screens.',
        climateAdvice: 'Telangana\'s semi-arid heat is perfectly countered by our ventilated terracotta facade systems, which create a natural air-gap to insulate buildings.',
        possibleKeywords: ['terracotta facade Telangana', 'brick tiles Hyderabad', 'jaali screens Telangana'],
        weatherContext: 'Semi-Arid Hot',
        areasServed: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda'],
        coordinates: { lat: 18.1124, lng: 79.0193 },
        popularProducts: ['Facade Panels', 'Screen Jaalis', 'Wirecut Bricks']
    },
    'west-bengal': {
        name: 'West Bengal',
        slug: 'west-bengal',
        region: 'East',
        metaTitle: 'Terracotta Tiles & Clay Bricks West Bengal | UrbanClay',
        metaDescription: 'Premium terracotta products for West Bengal. Honoring the legacy of Bishnupur with modern clay technology. Serving Kolkata, Siliguri & Durgapur.',
        heroTitle: 'Clay Heritage in',
        heroSubtitle: 'A modern tribute to West Bengal\'s historic terracotta tradition. Precision-crafted bricks and tiles for a new age.',
        climateAdvice: 'West Bengal\'s tropical humidity requires salt-resistant, low-porosity clay. Our vitrified terracotta range is designed to prevent salt-damp and moss growth.',
        possibleKeywords: ['terracotta tiles West Bengal', 'exposed brick Kolkata', 'clay bricks Siliguri'],
        weatherContext: 'Tropical Wet/Humid',
        areasServed: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol', 'Maheshtala', 'Rajpur Sonarpur', 'Gopalpur'],
        coordinates: { lat: 22.9868, lng: 87.8550 },
        popularProducts: ['Handmade Bricks', 'Roof Tiles', 'Heritage Plaques']
    },
    'uttar-pradesh': {
        name: 'Uttar Pradesh',
        slug: 'uttar-pradesh',
        region: 'North',
        metaTitle: 'Terracotta Tiles & Bricks Uttar Pradesh | UrbanClay',
        metaDescription: 'Largest supplier of exposed bricks and terracotta tiles in Uttar Pradesh. Serving Lucknow, Kanpur, Agra & Varanasi. High-thermal mass clay products.',
        heroTitle: 'Building Legacy in',
        heroSubtitle: 'Premium clay products for Uttar Pradesh\'s rising infrastructure, from heritage restorations to modern villas.',
        climateAdvice: 'For the extreme heatwaves and winters of UP, our hollow clay blocks provide the best thermal insulation, significantly improving energy efficiency.',
        possibleKeywords: ['exposed bricks Uttar Pradesh', 'terracotta tiles Lucknow', 'brick suppliers Kanpur'],
        weatherContext: 'Humid Subtropical',
        areasServed: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Bareilly', 'Aligarh'],
        coordinates: { lat: 26.8467, lng: 80.9462 },
        popularProducts: ['Wirecut Bricks', 'Hollow Blocks', 'Pressed Tiles']
    },
    'madhya-pradesh': {
        name: 'Madhya Pradesh',
        slug: 'madhya-pradesh',
        region: 'North',
        metaTitle: 'Terracotta Tiles & Cladding Madhya Pradesh | UrbanClay',
        metaDescription: 'Earthy terracotta tiles and bricks for Madhya Pradesh. Serving Indore, Bhopal, Jabalpur & Gwalior. Sustainable building materials for Central India.',
        heroTitle: 'Earthy Heart of',
        heroSubtitle: 'Bringing sustainable, high-quality clay architecture to the heart of India.',
        climateAdvice: 'Madhya Pradesh\'s central climate benefits from terracotta\'s natural cooling properties. Our floor and wall tiles regulate indoor temperature without active cooling.',
        possibleKeywords: ['terracotta tiles MP', 'exposed brick Indore', 'cladding tiles Bhopal'],
        weatherContext: 'Subtropical',
        areasServed: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna'],
        coordinates: { lat: 22.9734, lng: 78.6569 },
        popularProducts: ['Floor Bricks', 'Elevation Tiles', 'Decorative Bricks']
    },
    'andhra-pradesh': {
        name: 'Andhra Pradesh',
        slug: 'andhra-pradesh',
        region: 'South',
        metaTitle: 'Terracotta Tiles & Bricks Andhra Pradesh | UrbanClay',
        metaDescription: 'Sustainable clay building materials for Andhra Pradesh. Serving Visakhapatnam, Vijayawada & Guntur. Architectural terracotta and jaalis for the coast.',
        heroTitle: 'Coastal Resilience in',
        heroSubtitle: 'High-performance terracotta solutions for Andhra Pradesh\'s dynamic urban and coastal growth.',
        climateAdvice: 'Andhra\'s humid coastline requires salt-resistant vitrified terracotta. Our products are tested to withstand saline environments without losing their earthy finish.',
        possibleKeywords: ['terracotta tiles Vizag', 'clay jaali Vijayawada', 'brick suppliers Andhra'],
        weatherContext: 'Tropical Humid',
        areasServed: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada'],
        coordinates: { lat: 15.9129, lng: 79.7400 },
        popularProducts: ['Vitrified Bricks', 'Cooling Tiles', 'Facade Screens']
    },
    'punjab': {
        name: 'Punjab',
        slug: 'punjab',
        region: 'North',
        metaTitle: 'Exposed Wirecut Bricks Punjab | UrbanClay India',
        metaDescription: 'Premium wirecut and handmade bricks for Punjab\'s luxury villas and farmhouses. Serving Ludhiana, Amritsar & Jalandhar. Timeless clay architecture.',
        heroTitle: 'Royal Heritage in',
        heroSubtitle: 'Elevating Punjab\'s grand architecture with the world\'s finest exposed bricks and terracotta tiles.',
        climateAdvice: 'Punjab\'s semi-arid extremes (hot summers, cold winters) are best managed with clay\'s high thermal mass, providing natural year-round insulation.',
        possibleKeywords: ['exposed bricks Punjab', 'wirecut bricks Ludhiana', 'terracotta tiles Amritsar'],
        weatherContext: 'Semi-Arid',
        areasServed: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur'],
        coordinates: { lat: 31.1471, lng: 75.3412 },
        popularProducts: ['Wirecut Bricks', 'Antique Bricks', 'Floor Tiles']
    },
    'haryana': {
        name: 'Haryana',
        slug: 'haryana',
        region: 'North',
        metaTitle: 'Terracotta Cladding & Bricks Haryana | UrbanClay',
        metaDescription: 'Leading supplier of architectural clay products in Haryana. Serving Gurgaon, Faridabad, Panipat & Ambala. Modern facade and wall solutions.',
        heroTitle: 'Modern Landscapes in',
        heroSubtitle: 'Precision-engineered clay solutions for Haryana\'s rapidly evolving urban and industrial landscape.',
        climateAdvice: 'For Haryana\'s dry climate, our terracotta louvers and jaalis provide effective sun-shading while allowing natural ventilation to cool large spaces.',
        possibleKeywords: ['terracotta tiles Gurgaon', 'brick cladding Faridabad', 'clay jaali Panipat'],
        weatherContext: 'Arid/Semi-Arid',
        areasServed: ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal'],
        coordinates: { lat: 29.0588, lng: 76.0856 },
        popularProducts: ['Louvers', 'Linear Cladding', 'Hollow Blocks']
    },
    'bihar': {
        name: 'Bihar',
        slug: 'bihar',
        region: 'East',
        metaTitle: 'Terracotta Tiles & Bricks Bihar | UrbanClay India',
        metaDescription: 'Durable and traditional clay building materials for Bihar. Serving Patna, Gaya & Muzaffarpur. High-quality terracotta for residential and institutional projects.',
        heroTitle: 'Timeless Building in',
        heroSubtitle: 'Honoring Bihar\'s ancient architectural roots with modern, high-durability clay products.',
        climateAdvice: 'Bihar\'s humid subtropical climate benefits from terracotta\'s breathability, preventing indoor dampness and maintaining a comfortable temperature.',
        possibleKeywords: ['terracotta tiles Patna', 'brick suppliers Bihar', 'clay bricks Gaya'],
        weatherContext: 'Humid Subtropical',
        areasServed: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah', 'Begusarai'],
        coordinates: { lat: 25.0961, lng: 85.3131 },
        popularProducts: ['Pressed Bricks', 'Standard Tiles', 'Facade Panels']
    },
    'odisha': {
        name: 'Odisha',
        slug: 'odisha',
        region: 'East',
        metaTitle: 'Terracotta Tiles & Jaalis Odisha | UrbanClay',
        metaDescription: 'Premium terracotta solutions for Odisha. Serving Bhubaneswar, Cuttack & Rourkela. Weather-proof clay tiles for a tropical and coastal state.',
        heroTitle: 'Earthy Grace in',
        heroSubtitle: 'Perfectly complementing Odisha\'s temple architecture and modern coastal developments with clay excellence.',
        climateAdvice: 'Odisha\'s cyclone-prone and humid coast demands high-strength, low-porosity tiles. Our range is built to withstand extreme wind-driven rain.',
        possibleKeywords: ['terracotta tiles Bhubaneswar', 'clay jaali Cuttack', 'brick tiles Odisha'],
        weatherContext: 'Tropical Humid',
        areasServed: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur', 'Puri', 'Balasore', 'Bhadrak'],
        coordinates: { lat: 20.9517, lng: 85.0985 },
        popularProducts: ['Roof Tiles', 'Wall Cladding', 'Decorative Jaalis']
    }
};

export const regions = {
    South: ['bangalore', 'hyderabad', 'chennai', 'kochi', 'coimbatore'],
    West: ['mumbai', 'pune', 'ahmedabad', 'surat', 'goa'],
    North: ['delhi', 'gurgaon', 'noida', 'chandigarh', 'jaipur', 'lucknow']
};
