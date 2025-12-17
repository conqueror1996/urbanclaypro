import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { writeClient as client } from '@/sanity/lib/write-client';


export async function GET(req: NextRequest) {
    // 1. Auth Check
    const token = req.cookies.get('uc_admin_token')?.value;
    if (token !== 'clay2025' && token !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const intent = searchParams.get('intent');

    if (intent === 'categories') {
        const categories = await client.fetch(`*[_type == "category"] | order(title asc) { title }`);
        return NextResponse.json(categories.map((c: any) => c.title));
    }

    if (intent === 'categories_full') {
        const categories = await client.fetch(`*[_type == "category"] | order(displayOrder asc, title asc) { 
            _id, 
            title, 
            description, 
            displayOrder,
            "imageUrl": image.asset->url 
        }`);
        return NextResponse.json(categories);
    }

    return NextResponse.json({ error: 'Invalid Intent' }, { status: 400 });
}

export async function POST(req: NextRequest) {
    // 1. Auth Check
    const token = req.cookies.get('uc_admin_token')?.value;
    if (token !== 'clay2025' && token !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { action, data } = body;

        // ==========================================
        // PRODUCTS
        // ==========================================

        if (action === 'create_category') {
            const { title, description, displayOrder, imageAssetId } = data;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 96);

            const doc: any = {
                _type: 'category',
                title,
                slug: { current: slug, _type: 'slug' },
                description: description || '',
                displayOrder: displayOrder || 0
            };

            if (imageAssetId) {
                doc.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } };
            }

            const result = await client.create(doc);
            return NextResponse.json({ success: true, category: result });
        }

        if (action === 'update_category') {
            const { _id, title, description, displayOrder, imageAssetId } = data;

            const patch: any = { title, description, displayOrder };
            if (imageAssetId) {
                patch.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } };
            }

            await client.patch(_id).set(patch).commit();
            return NextResponse.json({ success: true });
        }

        if (action === 'create_product') {
            const { title, category } = data;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 96);

            // 1. Resolve Category Reference
            // specific query to find category by title
            const catQuery = `*[_type == "category" && title == $title][0]._id`;
            let catId = await client.fetch(catQuery, { title: category });

            if (!catId) {
                // Create if not exists (auto-seed categories)
                const newCat = await client.create({
                    _type: 'category',
                    title: category,
                    slug: { _type: 'slug', current: category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
                });
                catId = newCat._id;
            }

            const doc = {
                _type: 'product',
                title,
                tag: category, // Keep legacy tag for now
                category: { _type: 'reference', _ref: catId }, // Actual Reference
                slug: { current: slug, _type: 'slug' },
                description: '',
                priceRange: 'On Request',
                variants: [],
                images: []
            };

            const result = await client.create(doc);
            revalidatePath('/dashboard/products');
            return NextResponse.json({ success: true, product: result });
        }

        if (action === 'update_product') {
            const { _id, ...fields } = data;

            // If tag is being updated, sync the category reference
            if (fields.tag) {
                const catQuery = `*[_type == "category" && title == $title][0]._id`;
                let catId = await client.fetch(catQuery, { title: fields.tag });
                if (!catId) {
                    const newCat = await client.create({
                        _type: 'category',
                        title: fields.tag,
                        slug: { _type: 'slug', current: fields.tag.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
                    });
                    catId = newCat._id;
                }
                fields.category = { _type: 'reference', _ref: catId };
            }

            // Clean up undefined fields
            Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key]);

            await client.patch(_id).set(fields).commit();
            revalidatePath('/dashboard/products');
            revalidatePath('/products');
            return NextResponse.json({ success: true });
        }

        if (action === 'add_variant') {
            const { productId, name, family, imageAssetId, galleryAssetIds } = data;

            const newVariant = {
                _key: crypto.randomUUID(),
                name,
                family: family || undefined,
                image: imageAssetId ? {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: imageAssetId }
                } : undefined,
                gallery: galleryAssetIds ? galleryAssetIds.map((id: string) => ({
                    _type: 'image',
                    _key: crypto.randomUUID(),
                    asset: { _type: 'reference', _ref: id }
                })) : []
            };

            // Add to root variants
            await client.patch(productId)
                .setIfMissing({ variants: [] })
                .append('variants', [newVariant])
                .commit();

            revalidatePath('/dashboard/products');
            return NextResponse.json({ success: true });
        }

        if (action === 'update_variant') {
            const { productId, variantKey, data: variantData } = data;


            // Construct new variant object (partial update not easy with array, so we replace)
            // But to replace, we need to know what to keep.
            // Actually, for now, we just update name and images.
            // Badge is now included in variantData.

            const { name, family, badge, imageAssetId, galleryAssetIds } = variantData;

            // We can use a deep patch if we want, but replacing the item is easier if we have all data.
            // We'll construct the object similar to add_variant, but keeping the key.

            const variantUpdate = {
                _key: variantKey,
                _type: 'object', // Explicitly set type if needed, usually inferred
                name,
                family: family || undefined,
                badge: badge || undefined,
                image: imageAssetId ? {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: imageAssetId }
                } : undefined,
                gallery: galleryAssetIds ? galleryAssetIds.map((id: string) => ({
                    _type: 'image',
                    _key: crypto.randomUUID(),
                    asset: { _type: 'reference', _ref: id }
                })) : []
            };

            // Using insert replace
            await client.patch(productId)
                .insert('replace', `variants[_key=="${variantKey}"]`, [variantUpdate])
                .commit();

            revalidatePath('/dashboard/products');
            revalidatePath('/products');
            return NextResponse.json({ success: true });
        }

        if (action === 'delete_variant') {
            const { productId, variantKey } = data;

            // Remove the variant from the variants array
            await client.patch(productId)
                .unset([`variants[_key=="${variantKey}"]`])
                .commit();

            revalidatePath('/dashboard/products');
            revalidatePath('/products');
            return NextResponse.json({ success: true });
        }

        // ==========================================
        // PROJECTS
        // ==========================================

        if (action === 'create_project') {
            const { title, location, type } = data;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 96);
            const doc = {
                _type: 'project',
                title,
                location,
                type,
                slug: { current: slug, _type: 'slug' },
                description: '',
                gallery: []
            };
            const result = await client.create(doc);
            revalidatePath('/dashboard/projects');
            return NextResponse.json({ success: true, project: result });
        }

        if (action === 'update_project') {
            const { _id, ...fields } = data;
            Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key]);

            await client.patch(_id).set(fields).commit();
            revalidatePath('/dashboard/projects');
            revalidatePath('/projects');
            return NextResponse.json({ success: true });
        }

        if (action === 'add_project_gallery_image') {
            const { _id, assetId } = data;
            if (!_id || !assetId) throw new Error("Missing ID or Asset");

            await client.patch(_id)
                .setIfMissing({ gallery: [] })
                .append('gallery', [{
                    _type: 'image',
                    asset: { _type: 'reference', _ref: assetId },
                    _key: crypto.randomUUID()
                }])
                .commit();

            revalidatePath('/dashboard/projects');
            return NextResponse.json({ success: true });
        }

        // ==========================================
        // RESOURCES
        // ==========================================

        if (action === 'create_resource') {
            const { title, type, description } = data;
            const doc = {
                _type: 'resource',
                title,
                type,
                description: description || '',
            };
            const result = await client.create(doc);
            revalidatePath('/dashboard/resources');
            return NextResponse.json({ success: true, resource: result });
        }

        if (action === 'update_resource') {
            const { _id, ...fields } = data;

            // Handle file upload specifically if present (though usually handled by separate upload + link)
            // If fields contains 'fileAssetId', we need to link it.
            if (fields.fileAssetId) {
                fields.file = { _type: 'file', asset: { _type: 'reference', _ref: fields.fileAssetId } };
                delete fields.fileAssetId;
            }

            Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key]);

            await client.patch(_id).set(fields).commit();
            revalidatePath('/dashboard/resources');
            revalidatePath('/resources'); // Revalidate public page
            return NextResponse.json({ success: true });
        }

        if (action === 'delete_document') {
            const { id } = data;
            await client.delete(id);
            revalidatePath('/dashboard/products');
            revalidatePath('/products');
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });

    } catch (error) {
        console.error("Manage API Error:", error);
        return NextResponse.json({ error: 'Server Error', details: error }, { status: 500 });
    }
}
