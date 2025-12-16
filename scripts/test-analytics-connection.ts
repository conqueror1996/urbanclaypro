
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local manually since we are running outside Next.js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testConnection() {
    // Dynamic import to ensure process.env is populated before module evaluation
    const { getTrafficData } = await import('../lib/analytics-service');

    console.log("----------------------------------------");
    console.log("🧪 Testing Google Analytics Connection...");
    console.log("----------------------------------------");

    const result = await getTrafficData();

    if (result.isDemo) {
        console.error("\n❌ CONNECTION FAILED (Falling back to Demo Mode)");
        console.error("Error Details:", result.error);
        process.exit(1);
    } else {
        console.log("\n✅ CONNECTION SUCCESSFUL!");
        console.log("Fetched Data:", result);
        process.exit(0);
    }
}

testConnection();
