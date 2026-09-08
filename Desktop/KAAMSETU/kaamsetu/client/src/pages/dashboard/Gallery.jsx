import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, Trash2, Image } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadGallery = async () => {
        try {
            const res = await api.get('/gallery');
            setImages(res.data.data.images);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { loadGallery(); }, []);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        try {
            const fd = new FormData();
            files.forEach((f) => fd.append('images', f));
            const res = await api.post('/gallery', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImages((prev) => [...prev, ...res.data.data.images]);
            toast.success(`${res.data.data.images.length} image(s) uploaded`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/gallery/${deleteId}`);
            setImages(images.filter((i) => i._id !== deleteId));
            toast.success('Image deleted');
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Gallery</h1>
                    <p className="text-gray-500 text-sm mt-1">{images.length} photo{images.length !== 1 ? 's' : ''}</p>
                </div>
                <label className="cursor-pointer">
                    <Button icon={Upload} loading={uploading} as="span">
                        {uploading ? 'Uploading...' : 'Upload Photos'}
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            </div>

            {images.length === 0 ? (
                <EmptyState
                    icon={Image}
                    title="No photos yet"
                    description="Upload photos of your business, services, or products to attract more customers."
                    action={() => document.querySelector('input[type=file]')?.click()}
                    actionLabel="Upload First Photo"
                />
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <div key={img._id} className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100 shadow-sm">
                            <img
                                src={img.url}
                                alt={img.caption || 'Gallery'}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                                <button
                                    onClick={() => setDeleteId(img._id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl shadow"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            {img.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                    <p className="text-white text-xs truncate">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Upload more tile */}
                    <label className="cursor-pointer aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary-400 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary-500 bg-gray-50">
                        <Upload size={22} />
                        <span className="text-sm font-medium">Add More</span>
                        <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
                    </label>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Photo?"
                message="This photo will be permanently removed from your gallery."
                loading={deleting}
            />
        </div>
    );
}
