export async function analyzeImage(file: File): Promise<{
    dominantColor: string;
    suggestedName: string;
    confidence: number;
    tags: string[];
}> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject("No canvas context");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Sample center 100x100 area for dominant tone
            const centerData = ctx.getImageData(
                Math.max(0, img.width / 2 - 50),
                Math.max(0, img.height / 2 - 50),
                Math.min(100, img.width),
                Math.min(100, img.height)
            ).data;

            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < centerData.length; i += 4) {
                r += centerData[i];
                g += centerData[i + 1];
                b += centerData[i + 2];
                count++;
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            // Logic to determine name based on color
            let name = "Custom Variant";
            let tags = ["Modern"];

            // Simple Color Logic
            if (r > 150 && g < 100 && b < 100) {
                name = "Rustic Red";
                tags.push("Traditional", "Warm");
            } else if (r > 180 && g > 140 && b < 120) {
                name = "Canyon Orange";
                tags.push("Earthy", "Natural");
            } else if (r > 200 && g > 200 && b > 180) {
                name = "Natural Beige";
                tags.push("Light", "Clean");
            } else if (r < 100 && g < 100 && b < 100) {
                name = "Midnight Black";
                tags.push("Bold", "Premium");
            } else if (r > 100 && g > 100 && b > 100 && Math.abs(r - g) < 20) {
                name = "Urban Grey";
                tags.push("Industrial", "Sleek");
            }

            // Simulate "Texture Detection" (Random for now as pixel-peeping is hard)
            const textures = ["Wirecut", "Smooth", "Hand-molded", "Sandblasted"];
            const texture = textures[Math.floor(Math.random() * textures.length)];

            name = `${texture} ${name.split(" ")[1] || "Brick"}`;

            // Hex
            const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

            // Simulate delay for "Thinking"
            setTimeout(() => {
                resolve({
                    dominantColor: hex,
                    suggestedName: name,
                    confidence: 0.85 + Math.random() * 0.1,
                    tags
                });
            }, 1000 + Math.random() * 1000); // 1-2s delay
        };

        img.onerror = reject;
    });
}
