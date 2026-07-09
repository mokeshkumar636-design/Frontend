// Import generated banner showcase assets
import foodBanner from '../assets/food.png';
import accessoriesBanner from '../assets/accessories.png';
import sportsBanner from '../assets/sports.png';
import dressBanner from '../assets/dress.png';

export const CATEGORIES = {
  foods: {
    id: 'foods',
    name: 'Gourmet Foods',
    tagline: 'Savor organic, hand-crafted culinary delights sourced from artisanal farms.',
    banner: foodBanner,
    themeClass: 'theme-foods',
    accentColor: '#E07A5F',
  },
  accessories: {
    id: 'accessories',
    name: 'Luxury Accessories',
    tagline: 'Timeless statement pieces crafted with minimal aesthetics and premium materials.',
    banner: accessoriesBanner,
    themeClass: 'theme-accessories',
    accentColor: '#D4AF37',
  },
  sports: {
    id: 'sports',
    name: 'High Performance Sports',
    tagline: 'Engineered sportswear and gear built to push boundaries and accelerate power.',
    banner: sportsBanner,
    themeClass: 'theme-sports',
    accentColor: '#CCFF00',
  },
  dress: {
    id: 'dress',
    name: 'Chic Dress & Apparel',
    tagline: 'Effortless clothing crafted in flowing lines, breathable fabrics, and classic cuts.',
    banner: dressBanner,
    themeClass: 'theme-dress',
    accentColor: '#E6A5A5',
  }
};

export const PRODUCTS = [
  // --- FOODS ---
  {
    id: 'f1',
    name: 'Raw Wildflower Honeycomb',
    category: 'foods',
    price: 24.99,
    rating: 4.8,
    reviews: 120,
    badge: 'Organic',
    description: 'Raw, unfiltered organic honeycomb cut fresh from local wildflower apiaries. Featuring distinct floral notes and natural beeswax.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    details: [
      '100% Raw Wildflower Honey',
      'Harvested in sustainable small batches',
      'Contains natural propolis and active enzymes',
      'Perfect for cheese boards or toast toppings'
    ]
  },
  {
    id: 'f2',
    name: 'Artisanal Sourdough Starter Kit',
    category: 'foods',
    price: 34.50,
    rating: 4.9,
    reviews: 85,
    badge: 'Popular',
    description: 'Bake professional-quality sourdough at home with our premium starter kit, featuring our 100-year-old dried heritage starter culture.',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80',
    details: [
      'Dehydrated heritage starter culture',
      'Organic stone-ground rye and unbleached flour',
      'Hand-woven linen-lined proofing basket (Banneton)',
      'Stainless steel dough lame and bench scraper'
    ]
  },
  {
    id: 'f3',
    name: 'Estate Cold-Pressed Olive Oil',
    category: 'foods',
    price: 42.00,
    rating: 4.7,
    reviews: 154,
    badge: 'Limited',
    description: 'Single-estate extra virgin olive oil, cold-pressed within 3 hours of hand-harvesting in Kalamata, Greece. Notes of green grass and pepper.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    details: [
      'Single-origin 100% Koroneiki olives',
      'Ultra-low acidity level below 0.3%',
      'Rich in natural polyphenols and antioxidants',
      'Housed in UV-protected glass flask bottle'
    ]
  },
  {
    id: 'f4',
    name: 'Ceremonial Matcha Green Tea',
    category: 'foods',
    price: 28.00,
    rating: 4.9,
    reviews: 210,
    badge: 'New',
    description: 'Stone-ground ceremonial grade matcha sourced directly from shaded tea estates in Uji, Kyoto. Smooth, rich umami flavor with zero bitterness.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
    details: [
      'First harvest spring tea buds',
      'Traditional stone-ground milling',
      'Shade-grown for 21 days to maximize chlorophyll',
      'Vibrant electric green color'
    ]
  },

  // --- ACCESSORIES ---
  {
    id: 'a1',
    name: 'Chrono Slate Smartwatch',
    category: 'accessories',
    price: 299.00,
    rating: 4.7,
    reviews: 340,
    badge: 'Best Seller',
    description: 'Sleek obsidian smartwatch featuring customizable widgets, continuous biometrics tracking, high-res AMOLED display, and a 7-day battery.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    details: [
      'AMOLED Sapphire crystal display',
      'Polished titanium alloy watch body',
      'Heart rate, SpO2, sleep, and fitness tracking',
      'Water resistant up to 5 ATM (50 meters)'
    ]
  },
  {
    id: 'a2',
    name: 'Minimalist Eco-Brass Ring Set',
    category: 'accessories',
    price: 85.00,
    rating: 4.5,
    reviews: 95,
    badge: 'Handcrafted',
    description: 'Hand-forged recycled eco-brass rings finished with a brushed satin texture. Minimalist geometry designed to be worn stacked or separately.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
    details: [
      'Crafted from 100% recycled eco-brass',
      'Brushed satin matte tarnish-resistant finish',
      'Set includes three distinct geometric silhouettes',
      'Lead-free and nickel-safe construction'
    ]
  },
  {
    id: 'a3',
    name: 'Heritage Leather Tech Organizer',
    category: 'accessories',
    price: 145.00,
    rating: 4.9,
    reviews: 180,
    badge: 'Premium',
    description: 'Full-grain vegetable-tanned leather organizer case for charging cords, passports, and daily tech essentials.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
    details: [
      'Conceria Walpier buttero leather',
      'Solid brass heavy-gauge YKK zip closures',
      'Elastic woven loops and mesh pocket sleeves',
      'Develops a deep personalized patina with time'
    ]
  },
  {
    id: 'a4',
    name: 'Symphony Wireless ANC Headphones',
    category: 'accessories',
    price: 349.00,
    rating: 4.8,
    reviews: 512,
    badge: 'Trending',
    description: 'Active noise-cancelling wireless headphones with custom high-fidelity drivers, spatial audio, and plush memory foam leatherette ear cups.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    details: [
      'Hybrid active noise cancellation (40dB depth)',
      '40mm custom bio-cellulose drivers',
      '45-hour battery life with fast USB-C charge',
      'Bluetooth 5.3 multipoint audio streaming'
    ]
  },

  // --- SPORTS ---
  {
    id: 's1',
    name: 'Velocity Carbon Plate Sneakers',
    category: 'sports',
    price: 189.00,
    rating: 4.9,
    reviews: 410,
    badge: 'Pro Edition',
    description: 'Ultra-lightweight marathon running shoes built with dynamic responsive carbon fiber plate propulsion and high-rebound supercritical foam.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    details: [
      'Full-length carbon fiber propulsion plate',
      'Supercritical high-rebound cushioning foam',
      'Single-layer engineered breathable matrix mesh',
      'High-traction decoupled rubber outsole'
    ]
  },
  {
    id: 's2',
    name: 'AeroPur Smart Hydration Flask',
    category: 'sports',
    price: 65.00,
    rating: 4.6,
    reviews: 215,
    badge: 'Innovative',
    description: 'Vacuum-insulated stainless steel flask with integrated UV-C water purification system inside the cap and electronic hydration alarms.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    details: [
      'Built-in 280nm UV-C sanitization light in cap',
      'Destroys 99.9% of bacteria and viruses in 60s',
      'Double-walled 18/8 kitchen-grade steel insulation',
      'Keeps cold beverages icy for up to 24 hours'
    ]
  },
  {
    id: 's3',
    name: 'Kinetic Heavy Resistance Band Set',
    category: 'sports',
    price: 45.00,
    rating: 4.8,
    reviews: 310,
    badge: 'Workout',
    description: 'Heavy-duty natural latex resistance tubes featuring dynamic metal alloy carabiners, foam handles, ankle straps, and a solid door anchor.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    details: [
      'Five colored anti-snap latex resistance bands',
      'Total resistance stackable up to 150 lbs',
      'Sweat-proof cushioned foam grip handles',
      'Includes compact mesh carrying duffel'
    ]
  },
  {
    id: 's4',
    name: 'Balance Grip Natural Rubber Mat',
    category: 'sports',
    price: 75.00,
    rating: 4.7,
    reviews: 168,
    badge: 'Eco-Friendly',
    description: 'Dense natural rubber yoga and fitness mat featuring laser-etched anatomical alignment guides and a high-traction sweat-wicking surface.',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
    details: [
      '100% biodegradable sustainably-sourced rubber',
      '6mm high-density cushioned structural padding',
      'Laser-etched guidelines',
      'Slip-proof dry and wet grip textured surfaces'
    ]
  },

  // --- DRESS ---
  {
    id: 'd1',
    name: 'Studio Structured Linen Coat',
    category: 'dress',
    price: 210.00,
    rating: 4.8,
    reviews: 92,
    badge: 'Minimalist',
    description: 'Classic double-breasted duster jacket coat silhouette re-interpreted in heavy, structured organic Belgian flax linen. Perfect for layering.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    details: [
      '100% Organic Belgian flax linen fiber',
      'Double-breasted front with real horn buttons',
      'Removable wide fabric belt with loops',
      'Breathable half-lined interior back yolk'
    ]
  },
  {
    id: 'd2',
    name: 'Lustrous Mulberry Silk Slip Dress',
    category: 'dress',
    price: 165.00,
    rating: 4.7,
    reviews: 140,
    badge: 'Elegant',
    description: 'Tailored in standard 19 Momme mulberry silk, this dress features a bias cut that contours beautifully to the body with a liquid sheen.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80',
    details: [
      'Grade 6A 100% pure Mulberry Silk',
      'Bias cut draping silhouette with side slit',
      'Adjustable ultra-fine spaghetti straps',
      'V-neckline and elegant low scoop back'
    ]
  },
  {
    id: 'd3',
    name: 'Heavyweight Ribbed Cotton Cardigan',
    category: 'dress',
    price: 125.00,
    rating: 4.6,
    reviews: 112,
    badge: 'Comfort',
    description: 'Warm and heavy combed organic cotton cardigan, presenting dropped shoulders, a relaxed fit, and chunky wood buttons.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
    details: [
      '100% combed organic long-staple cotton',
      'Heavyweight 5-gauge chunky ribbed knit',
      'Corozo eco-wood buttons',
      'Relaxed fit with deep ribbed collar bands'
    ]
  },
  {
    id: 'd4',
    name: 'Merino Wool Pleated Trousers',
    category: 'dress',
    price: 150.00,
    rating: 4.7,
    reviews: 78,
    badge: 'Classic',
    description: 'Tailored wide-leg trousers built in fine Merino wool and Tencel fibers. Designed with front pleats, slant side pockets, and pressed creases.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    details: [
      '70% Merino wool, 30% Lyocell Tencel blend',
      'Classic high-waist double front pleat design',
      'Interior adjustable elastic button waistband',
      'Deep back button welt pockets'
    ]
  }
];
