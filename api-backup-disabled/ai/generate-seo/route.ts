
import { NextRequest, NextResponse } from 'next/server';
import { generateSEOAttributes } from '@/lib/ai/seo-optimizer';

export async function POST(req: NextRequest) {
    // Auth Check
    const token = req.cookies.get('uc_admin_token')?.value;
    if (token !== 'clay2025' && token !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, currentTags } = body;

        if (!title || !description) {
            return NextResponse.json(
                { success: false, error: 'Product title and description are required' },
                { status: 400 }
            );
        }

        const generatedSeo = await generateSEOAttributes({
            title,
            description,
            currentTags
        });

        if (!generatedSeo) {
            return NextResponse.json(
                { success: false, error: 'Failed to generate SEO content' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: generatedSeo
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
