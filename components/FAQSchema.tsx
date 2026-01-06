'use client';

export default function FAQSchema() {
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What types of terracotta tiles do you offer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer three main types: Wirecut bricks (precision-cut, modern aesthetic), Handmade bricks (rustic, unique variations), and Pressed bricks (extremely dense and durable). Each type is available in various sizes and finishes for walls, floors, and facades."
                }
            },
            {
                "@type": "Question",
                "name": "Do you deliver terracotta tiles across India?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide pan-India delivery to all major cities including Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, and Ahmedabad. We offer same-day delivery in select cities and fast shipping nationwide."
                }
            },
            {
                "@type": "Question",
                "name": "Can I order free samples of terracotta tiles?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can order up to 5 free samples to see and feel the quality before making a purchase. Simply add samples to your sample box and provide your delivery address. Samples are shipped within 24-48 hours."
                }
            },
            {
                "@type": "Question",
                "name": "What is the price range for terracotta tiles in India?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our terracotta tiles range from ₹45 to ₹180 per square foot depending on the type (wirecut, handmade, or pressed), size, and finish. Bulk orders and project pricing are available. Contact us for a detailed quote."
                }
            },
            {
                "@type": "Question",
                "name": "Are your terracotta tiles suitable for exterior walls?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our terracotta tiles are specifically designed for exterior facades. They are low-efflorescence, weather-resistant, and provide excellent thermal insulation. They're perfect for modern facades, exposed brick walls, and architectural cladding."
                }
            },
            {
                "@type": "Question",
                "name": "How do I calculate how many tiles I need?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use our built-in Quantity Estimator tool on each product page. Simply enter your wall dimensions (length and height), and it will calculate the exact number of pieces needed, including 10% wastage. You can also contact our team for assistance."
                }
            },
            {
                "@type": "Question",
                "name": "How do you prevent efflorescence in terracotta facade tiles?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "UrbanClay uses a high-temperature firing process and low-alkali clay sources to significantly reduce soluble salts. When installed with low-cement masonry and proper drainage, our products are virtually efflorescence-free."
                }
            },
            {
                "@type": "Question",
                "name": "Are terracotta tiles suitable for hot climates like Hyderabad and Delhi?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. Terracotta has high thermal mass, which acts as a natural buffer against extreme heat. In cities like Delhi and Hyderabad, our tiles and jaalis can reduce indoor temperatures by up to 5-7°C naturally."
                }
            },
            {
                "@type": "Question",
                "name": "What is the compressive strength of your wirecut exposed bricks?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our wirecut exposed bricks are engineered for a compressive strength of 15 N/mm² to 25 N/mm², making them suitable for both load-bearing structures and architectural cladding."
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer terracotta installation technical sheets?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide comprehensive technical data sheets (TDS) and installation guides for architects and contractors. These cover everything from adhesive specifications to expansion joint placements."
                }
            },
            {
                "@type": "Question",
                "name": "What is the difference between wirecut and handmade bricks?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wirecut bricks are precision-cut with sharp edges for a modern aesthetic. Handmade bricks are molded by artisans for a rustic, unique variations. Both offer premium durability but cater to different architectural styles."
                }
            },
            {
                "@type": "Question",
                "name": "How can I buy terracotta tiles in Mumbai and Bangalore?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "UrbanClay has established logistical hubs in Mumbai and Bangalore. We offer local delivery within 48-72 hours. You can browse our collection online and request a site delivery quote."
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
    );
}
