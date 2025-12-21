'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects, Project } from '@/lib/products';
import { authenticatedFetch } from '@/lib/auth-utils';

type ViewMode = 'list' | 'create' | 'edit';

export default function ProjectDashboardPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
            if (selectedProject) {
                const updated = data.find(p => p.slug === selectedProject.slug); // Assuming slug stable or ID used
                if (updated) setSelectedProject(updated);
            }
        } catch (e) {
            console.error("Failed to load projects", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleCreateProject = async (title: string, location: string, type: string) => {
        if (!title) return;
        try {
            const res = await authenticatedFetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'create_project',
                    data: { title, location, type } // Server will handle slug gen
                })
            });
            const json = await res.json();
            if (json.success) {
                await refresh();
                // We might not know the exact new object immediately without ID, but re-fetch helps
                setViewMode('list');
                alert("Project Started! Select it to add details.");
            }
        } catch (e) { alert('Failed to create project'); }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex gap-8">
            {/* LEFT SIDEBAR: Projects List */}
            <div className="w-1/3 bg-white rounded-3xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-[#1a1512] font-serif text-xl">Projects</h2>
                    <button
                        onClick={() => { setSelectedProject(null); setViewMode('create'); }}
                        className="w-8 h-8 bg-[var(--terracotta)] text-white rounded-full flex items-center justify-center hover:bg-[#a85638] transition-colors shadow-lg shadow-orange-900/20"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-100/80 animate-pulse rounded-2xl" />)}
                        </div>
                    ) : (
                        projects.map((project: any) => (
                            <div
                                key={project._id || project.slug}
                                onClick={() => { setSelectedProject(project); setViewMode('edit'); }}
                                className={`group p-4 rounded-xl border transition-all cursor-pointer flex gap-4 ${selectedProject?.slug === project.slug
                                    ? 'bg-orange-50 border-[var(--terracotta)] ring-1 ring-[var(--terracotta)]'
                                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    {project.imageUrl && <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <h4 className={`font-bold text-sm truncate ${selectedProject?.slug === project.slug ? 'text-[#2A1E16]' : 'text-gray-900'}`}>{project.title}</h4>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider flex items-center gap-2">
                                        {(project as any).isFeatured && <span className="text-[var(--terracotta)] font-bold">★ Featured</span>}
                                        <span>{project.location}</span>
                                        <span>•</span>
                                        <span>{project.type}</span>
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        {project.gallery && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-bold">{project.gallery.length} Photos</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: Detail View */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col relative">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' && !selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 opacity-50"
                        >
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h3 className="font-serif text-2xl text-gray-300">Select a Project</h3>
                            <p className="text-gray-400 mt-2">Manage project details, location, and gallery images.</p>
                        </motion.div>
                    )}

                    {viewMode === 'edit' && selectedProject && (
                        <ProjectEditor project={selectedProject} key={selectedProject.slug} onRefresh={refresh} />
                    )}

                    {viewMode === 'create' && (
                        <CreateProjectWizard onCancel={() => setViewMode('list')} onCreate={handleCreateProject} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function CreateProjectWizard({ onCancel, onCreate }: { onCancel: () => void, onCreate: (t: string, l: string, ty: string) => void }) {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('Residential');

    return (
        <div className="p-10 flex flex-col items-center justify-center h-full max-w-lg mx-auto w-full">
            <h3 className="text-2xl font-serif mb-6">New Project Entry</h3>
            <div className="w-full space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. The Brick House" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                    <input value={location} onChange={e => setLocation(e.target.value)} placeholder="New Delhi" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Hospitality</option>
                        <option>Institutional</option>
                    </select>
                </div>
                <div className="flex gap-4 pt-4">
                    <button onClick={onCancel} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                    <button onClick={() => onCreate(title, location, type)} className="flex-1 py-3 bg-[var(--terracotta)] text-white font-bold rounded-xl shadow-lg hover:bg-[#a85638]">Start Entry</button>
                </div>
            </div>
        </div>
    )
}

export function ProjectEditor({ project, onRefresh }: { project: Project, onRefresh: () => void }) {
    const [form, setForm] = useState(project);
    const [isSaving, setIsSaving] = useState(false);

    const [isDraggingMain, setIsDraggingMain] = useState(false);
    const [isDraggingGallery, setIsDraggingGallery] = useState(false);

    useEffect(() => { setForm(project); }, [project]);

    const handleDragMain = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDraggingMain(true);
        } else if (e.type === "dragleave") {
            setIsDraggingMain(false);
        }
    };

    const handleDropMain = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingMain(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0], true);
        }
    };

    const handleDragGallery = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDraggingGallery(true);
        } else if (e.type === "dragleave") {
            setIsDraggingGallery(false);
        }
    };

    const handleDropGallery = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingGallery(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach(file => handleImageUpload(file, false));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await authenticatedFetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'update_project',
                    data: {
                        _id: (project as any)._id,
                        title: form.title,
                        location: form.location,
                        type: form.type,
                        description: form.description,
                        isFeatured: (form as any).isFeatured
                    }
                })
            });
            onRefresh();
        } catch (e) { alert("Failed to save"); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${project.title}"? This cannot be undone.`)) return;

        try {
            await authenticatedFetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'delete_document',
                    data: { id: (project as any)._id }
                })
            });
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Failed to delete project");
        }
    };

    // Helper to convert problematic JPEGs to PNG
    const convertImageToPng = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) { reject(new Error("Canvas context failed")); return; }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", { type: "image/png" });
                        resolve(newFile);
                    } else reject(new Error("Blob creation failed"));
                }, 'image/png');
            };
            img.onerror = (e) => reject(e);
            img.src = URL.createObjectURL(file);
        });
    };

    const handleImageUpload = async (originalFile: File, isMain: boolean = false) => {
        if (!originalFile) return;

        const performUpload = async (fileToUpload: File) => {
            const fd = new FormData();
            fd.append('file', fileToUpload);

            const upRes = await authenticatedFetch('/api/upload', { method: 'POST', body: fd });
            if (!upRes.ok) {
                const errText = await upRes.text();
                // Check for specific Sanity metadata error
                if (upRes.status === 500 && errText.includes('could not read metadata')) {
                    throw new Error("METADATA_ERROR");
                }
                throw new Error(`Upload server error: ${upRes.status} ${errText}`);
            }
            const upJson = await upRes.json();
            if (!upJson.success) throw new Error(upJson.error || "Upload failed");
            return upJson.asset._id;
        };

        try {
            let assetId: string;

            try {
                assetId = await performUpload(originalFile);
            } catch (e: any) {
                if (e.message === "METADATA_ERROR" && (originalFile.type === 'image/jpeg' || originalFile.type === 'image/jpg')) {
                    console.log("Attempting to convert problematic JPEG to PNG...");
                    const pngFile = await convertImageToPng(originalFile);
                    assetId = await performUpload(pngFile);
                } else {
                    throw e; // Re-throw other errors
                }
            }

            // Should probably handle this in 'manage' API for atomicity, but simple separate calls work for MVP
            const updateBody: any = {
                action: 'update_project',
                data: { _id: (project as any)._id }
            };

            if (isMain) {
                updateBody.data.image = { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
            } else {
                updateBody.action = 'add_project_gallery_image';
                updateBody.data.assetId = assetId;
            }

            const manageRes = await authenticatedFetch('/api/products/manage', { method: 'POST', body: JSON.stringify(updateBody) });
            if (!manageRes.ok) {
                const errText = await manageRes.text();
                throw new Error(`Manage API error: ${manageRes.status} ${errText}`);
            }

            onRefresh();

        } catch (e) {
            console.error("Upload Error Details:", e);
            alert(e instanceof Error ? e.message : "Upload failed");
        }
    };

    const handleDeleteGalleryImage = async (imageUrl: string) => {
        if (!confirm("Remove this image?")) return;
        try {
            const res = await authenticatedFetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'remove_project_gallery_image',
                    data: { _id: (project as any)._id, imageUrl }
                })
            });
            if (!res.ok) throw new Error("Failed to remove image");
            onRefresh();
        } catch (e) { alert("Could not remove image"); }
    };

    return (
        <motion.div
            // ... (keep props)
            className="flex flex-col h-full"
        >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
                {/* ... (keep header content) */}
                <div>
                    <h1 className="text-3xl font-serif text-[#1a1512]">{form.title}</h1>
                    <div className="flex gap-4 mt-2 text-xs font-bold uppercase tracking-wider text-gray-400 items-center">
                        {(project as any).isFeatured && (
                            <span className="bg-[var(--terracotta)] text-white px-2 py-0.5 rounded-full">Featured</span>
                        )}
                        <span>{form.location}</span>
                        <span>•</span>
                        <span>{form.type}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Project"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold uppercase hover:bg-white hover:shadow-sm transition-all text-gray-500">View on Site</button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg bg-[var(--terracotta)] text-white text-xs font-bold uppercase shadow-lg shadow-orange-900/20 hover:bg-[#a85638] transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* ... (keep form fields) */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-4">
                        {/* Featured Checkbox and Main Image */}
                        <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <div>
                                <h4 className="font-bold text-sm text-[#2A1E16]">Featured Project</h4>
                                <p className="text-xs text-gray-500">Enable this to display this project as the main hero on the Projects page.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={(form as any).isFeatured || false}
                                    onChange={e => setForm({ ...form, isFeatured: e.target.checked } as any)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--terracotta)]"></div>
                            </label>
                        </div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Image</label>
                        <div
                            className={`h-64 rounded-xl overflow-hidden relative group cursor-pointer border-2 transition-all duration-300 ${isDraggingMain ? 'border-[var(--terracotta)] bg-orange-50 scale-[1.02] shadow-xl' : 'border-transparent bg-gray-100 hover:border-[var(--terracotta)]'}`}
                            onDragEnter={handleDragMain}
                            onDragOver={handleDragMain}
                            onDragLeave={handleDragMain}
                            onDrop={handleDropMain}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {project.imageUrl ?
                                <img src={project.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                : <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                    <svg className="w-10 h-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p className="text-sm font-medium">Drag & Drop Main Image Here</p>
                                </div>
                            }
                            <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center ${isDraggingMain ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-2xl flex flex-col items-center gap-2">
                                    <svg className="w-8 h-8 text-[var(--terracotta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-800">{isDraggingMain ? 'Drop to Upload' : 'Change Main Image'}</span>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], true)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Title</label>
                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                        <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                        <select value={form.type || 'Residential'} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <option>Residential</option>
                            <option>Commercial</option>
                            <option>Hospitality</option>
                            <option>Institutional</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gallery Images</label>
                    <div
                        className={`rounded-xl p-4 transition-all duration-300 border-2 border-dashed relative ${isDraggingGallery ? 'border-[var(--terracotta)] bg-orange-50/50 scale-[1.01] ring-4 ring-orange-100' : 'border-gray-200/50 bg-gray-50/30'}`}
                        onDragEnter={handleDragGallery}
                        onDragOver={handleDragGallery}
                        onDragLeave={handleDragGallery}
                        onDrop={handleDropGallery}
                    >
                        {isDraggingGallery && (
                            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl border-4 border-dashed border-[var(--terracotta)] m-2 pointer-events-none animate-pulse">
                                <svg className="w-16 h-16 text-[var(--terracotta)] mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <h4 className="text-2xl font-serif text-[var(--terracotta)] font-bold">Release to Upload</h4>
                                <p className="text-sm text-[var(--terracotta)]/70 mt-2 font-medium">Add photos to gallery</p>
                            </div>
                        )}
                        <div className="grid grid-cols-4 gap-4">
                            {project.gallery?.map((img, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group shadow-sm border border-gray-200">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => handleDeleteGalleryImage(img)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform hover:scale-110"
                                        title="Remove Image"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] hover:bg-white transition-all relative cursor-pointer group bg-white">
                                <div className="group-hover:-translate-y-1 transition-transform duration-300">
                                    <svg className="w-8 h-8 mb-2 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    <span className="text-xs font-bold uppercase block text-center">Add Photos</span>
                                    <span className="text-[9px] text-gray-300 uppercase block text-center mt-1 group-hover:text-[var(--terracotta)]/70">or drag & drop</span>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            Array.from(e.target.files).forEach(f => handleImageUpload(f, false));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
