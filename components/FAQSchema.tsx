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
                "name": "What is the difference between wirecut and handmade bricks?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wirecut bricks are precision-cut with sharp edges and uniform dimensions, ideal for modern facades. Handmade bricks are molded by hand with unique variations and rustic charm, perfect for heritage or traditional looks. Both are high-quality terracotta products."
                }
            },
            {
                "@type": "Question",
                "name": "Do you provide installation services?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We provide detailed installation guides and technical specifications. We can also connect you with experienced contractors in your area. For large projects, we offer on-site consultation and support."
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
