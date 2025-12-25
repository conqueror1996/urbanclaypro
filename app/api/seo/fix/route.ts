
import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '../../../../sanity/lib/write-client';
import { generateSEOAttributes } from '../../../../lib/ai/seo-optimizer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { docId, issueId, keyword, currentMeta } = body;

        console.log(`[SEO Expert] Executing AI Fix for issue: ${issueId} on doc: ${docId}`);

        if (!docId) {
            return NextResponse.json({ success: false, error: 'Document ID required' }, { status: 400 });
        }

        // 1. Generate Expert SEO via AI
        // We provide the AI with the current context and the specific issue we're fixing
        const aiResponse = await generateSEOAttributes({
            title: currentMeta.title || keyword,
            description: currentMeta.description || `Premium ${keyword} by UrbanClay.`,
            currentTags: keyword ? [keyword] : []
        });

        if (!aiResponse) {
            return NextResponse.json({ success: false, error: 'AI Generation failed.' }, { status: 500 });
        }

        // 2. Logic Router - Map AI response to specific Sanity fields based on the issue
        let updateData: any = {};

        // Title Fixes
        if (issueId.includes('title') || issueId === 'h1-missing') {
            updateData["seo.title"] = aiResponse.metaTitle;
            // Also update the main title if it's missing or an H1 issue
            if (issueId === 'h1-missing' || !currentMeta.title) {
                updateData.title = aiResponse.metaTitle.split('|')[0].trim();
            }
        }

        // Description Fixes
        if (issueId.includes('meta') || issueId.includes('desc')) {
            updateData["seo.description"] = aiResponse.metaDescription;
        }

        // Keyword Fixes
        if (issueId.includes('kw') || issueId === 'keyword-density') {
            // Merge existing tags naturally
            updateData["seo.keywords"] = aiResponse.keywords;
        }

        if (Object.keys(updateData).length === 0) {
            // Fallback: Just update everything if issue is ambiguous
            updateData = {
                "seo.title": aiResponse.metaTitle,
                "seo.description": aiResponse.metaDescription,
                "seo.keywords": aiResponse.keywords
            };
        }

        // Execute Update
        await writeClient.patch(docId)
            .set(updateData)
            .commit();

        return NextResponse.json({
            success: true,
            message: 'Fixed successfully',
            changes: updateData
        });

    } catch (error: any) {
        console.error('SEO Fix Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
