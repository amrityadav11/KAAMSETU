import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload, Globe, MapPin, Clock, Eye, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CATEGORIES = [
    'Diagnostic Lab', 'Clinic', 'Pharmacy', 'Restaurant', 'Salon', 'Gym',
    'Coaching Centre', 'Grocery Store', 'Clothing Store', 'Electronics Store',
    'Mobile Shop', 'Photographer', 'Hotel', 'Repair Service', 'Freelancer', 'Other',
];

export default function MyBusiness() {
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [logoUploading, setLogoUploading] = useState(false);
    const [coverUploading, setCoverUploading] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/businesses/my');
                const b = res.data.data.business;
                setBusiness(b);
                setForm({
                    name: b.name || '',
                    category: b.category || '',
                    description: b.description || '',
                    phone: b.phone || '',
                    whatsapp: b.whatsapp || '',
                    whatsappMessage: b.whatsappMessage || '',
                    email: b.email || '',
                    website: b.website || '',
                    address: b.address || '',
                    city: b.city || '',
                    state: b.state || '',
                    pincode: b.pincode || '',
                    openingHours: b.openingHours || [],
                });
            } catch {
                // No business
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleHoursChange = (day, field, value) => {
        const updated = form.openingHours.map((h) =>
            h.day === day ? { ...h, [field]: value } : h
        );
        setForm({ ...form, openingHours: updated });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put(`/businesses/${business._id}`, form);
            setBusiness(res.data.data.business);
            toast.success('Business updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoUploading(true);
        try {
            const fd = new FormData();
            fd.append('logo', file);
            const res = await api.post(`/businesses/${business._id}/logo`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setBusiness({ ...business, logo: res.data.data.logo });
            toast.success('Logo uploaded');
        } catch {
            toast.error('Logo upload failed');
        } finally {
            setLogoUploading(false);
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverUploading(true);
        try {
            const fd = new FormData();
            fd.append('cover', file);
            const res = await api.post(`/businesses/${business._id}/cover`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setBusiness({ ...business, coverImage: res.data.data.coverImage });
            toast.success('Cover image uploaded');
        } catch {
            toast.error('Cover upload failed');
        } finally {
            setCoverUploading(false);
        }
    };

    const handlePublish = async () => {
        setPublishing(true);
        try {
            const res = await api.put(`/businesses/${business._id}/publish`);
            setBusiness(res.data.data.business);
            toast.success('Business published! 🎉');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to publish');
        } finally {
            setPublishing(false);
        }
    };

    if (loading) return <Loader text="Loading business..." />;

    if (!business) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500 mb-4">You haven't created a business yet.</p>
                <Button onClick={() => navigate('/dashboard/business/setup')}>Create Business</Button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">My Business</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your business profile</p>
                </div>
                <div className="flex gap-3">
                    {business.isPublished && (
                        <a href={`/business/${business.slug}`} target="_blank" rel="noreferrer">
                            <Button variant="secondary" size="sm" icon={Eye}>View Page</Button>
                        </a>
                    )}
                    {!business.isPublished && (
                        <Button onClick={handlePublish} loading={publishing} size="sm" icon={CheckCircle}>
                            Publish
                        </Button>
                    )}
                </div>
            </div>

            {/* Published status */}
            {business.isPublished && (
                <div className="card bg-primary-50 border-primary-200 flex items-center gap-3 py-4">
                    <CheckCircle size={20} className="text-primary-600 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-primary-800">Your business is live!</p>
                        <a
                            href={`/business/${business.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-600 text-sm hover:underline"
                        >
                            kaamsetu.in/business/{business.slug}
                        </a>
                    </div>
                </div>
            )}

            {/* Images */}
            <div className="card space-y-4">
                <h2 className="font-bold text-gray-900">Business Images</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Logo */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Logo</p>
                        <label className="relative block cursor-pointer">
                            <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-primary-400 transition-colors overflow-hidden bg-gray-50">
                                {business.logo ? (
                                    <img src={business.logo} alt="Logo" className="h-full w-full object-contain p-2" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Upload size={24} />
                                        <span className="text-sm">{logoUploading ? 'Uploading...' : 'Upload Logo'}</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={logoUploading} />
                        </label>
                    </div>
                    {/* Cover */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Cover Image</p>
                        <label className="relative block cursor-pointer">
                            <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-primary-400 transition-colors overflow-hidden bg-gray-50">
                                {business.coverImage ? (
                                    <img src={business.coverImage} alt="Cover" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Upload size={24} />
                                        <span className="text-sm">{coverUploading ? 'Uploading...' : 'Upload Cover'}</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={coverUploading} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Basic info */}
            <div className="card space-y-4">
                <h2 className="font-bold text-gray-900">Basic Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Business Name" name="name" value={form.name} onChange={handleChange} required />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                        <select name="category" value={form.category} onChange={handleChange} className="input-field">
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe your business, what makes you unique..."
                        className="input-field resize-none"
                    />
                </div>
            </div>

            {/* Contact */}
            <div className="card space-y-4">
                <h2 className="font-bold text-gray-900">Contact Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
                    <Input label="WhatsApp Number" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="919876543210 (with country code)" />
                    <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                    <Input label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Welcome Message</label>
                    <textarea
                        name="whatsappMessage"
                        value={form.whatsappMessage}
                        onChange={handleChange}
                        rows={2}
                        className="input-field resize-none"
                    />
                </div>
            </div>

            {/* Address */}
            <div className="card space-y-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2"><MapPin size={18} className="text-primary-600" /> Address</h2>
                <Input label="Street Address" name="address" value={form.address} onChange={handleChange} />
                <div className="grid md:grid-cols-3 gap-4">
                    <Input label="City" name="city" value={form.city} onChange={handleChange} />
                    <Input label="State" name="state" value={form.state} onChange={handleChange} />
                    <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
                </div>
            </div>

            {/* Opening Hours */}
            <div className="card">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-primary-600" /> Opening Hours</h2>
                <div className="space-y-3">
                    {(form.openingHours || []).map((h) => (
                        <div key={h.day} className="flex items-center gap-3">
                            <label className="flex items-center gap-2 w-28 flex-shrink-0">
                                <input
                                    type="checkbox"
                                    checked={h.isOpen}
                                    onChange={(e) => handleHoursChange(h.day, 'isOpen', e.target.checked)}
                                    className="accent-primary-600"
                                />
                                <span className="text-sm font-medium text-gray-700">{h.day.slice(0, 3)}</span>
                            </label>
                            {h.isOpen ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="time"
                                        value={h.openTime}
                                        onChange={(e) => handleHoursChange(h.day, 'openTime', e.target.value)}
                                        className="input-field py-2 text-sm flex-1"
                                    />
                                    <span className="text-gray-400 text-sm">to</span>
                                    <input
                                        type="time"
                                        value={h.closeTime}
                                        onChange={(e) => handleHoursChange(h.day, 'closeTime', e.target.value)}
                                        className="input-field py-2 text-sm flex-1"
                                    />
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400">Closed</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end gap-3">
                <Button onClick={handleSave} loading={saving} size="lg">
                    Save Changes
                </Button>
                {!business.isPublished && (
                    <Button onClick={handlePublish} loading={publishing} size="lg" variant="secondary">
                        Save & Publish
                    </Button>
                )}
            </div>
        </div>
    );
}
