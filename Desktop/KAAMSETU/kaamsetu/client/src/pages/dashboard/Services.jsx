import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

const PRICE_TYPES = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'starting_from', label: 'Starting From' },
    { value: 'on_request', label: 'On Request' },
    { value: 'free', label: 'Free' },
];

const defaultForm = { name: '', description: '', price: '', priceType: 'fixed', isActive: true };

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadServices = async () => {
        try {
            const res = await api.get('/services');
            setServices(res.data.data.services);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { loadServices(); }, []);

    const openAdd = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
    const openEdit = (s) => { setForm({ name: s.name, description: s.description || '', price: s.price || '', priceType: s.priceType, isActive: s.isActive }); setEditingId(s._id); setModalOpen(true); };

    const handleSave = async () => {
        if (!form.name.trim()) return toast.error('Service name is required');
        setSaving(true);
        try {
            if (editingId) {
                const res = await api.put(`/services/${editingId}`, form);
                setServices(services.map((s) => s._id === editingId ? res.data.data.service : s));
            } else {
                const res = await api.post('/services', form);
                setServices([...services, res.data.data.service]);
            }
            toast.success(editingId ? 'Service updated' : 'Service added');
            setModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/services/${deleteId}`);
            setServices(services.filter((s) => s._id !== deleteId));
            toast.success('Service deleted');
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    const formatPrice = (s) => {
        if (s.priceType === 'free') return 'Free';
        if (s.priceType === 'on_request') return 'On Request';
        if (!s.price) return '—';
        return `₹${s.price}${s.priceType === 'starting_from' ? '+' : ''}`;
    };

    if (loading) return <Loader />;

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Services</h1>
                    <p className="text-gray-500 text-sm mt-1">{services.length} service{services.length !== 1 ? 's' : ''}</p>
                </div>
                <Button onClick={openAdd} icon={Plus}>Add Service</Button>
            </div>

            {services.length === 0 ? (
                <EmptyState
                    icon={Wrench}
                    title="No services yet"
                    description="Add the services your business offers so customers know what you provide."
                    action={openAdd}
                    actionLabel="Add First Service"
                />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s) => (
                        <div key={s._id} className="card group">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-gray-900">{s.name}</h3>
                                <span className={s.isActive ? 'badge-green' : 'badge-gray'}>{s.isActive ? 'Active' : 'Hidden'}</span>
                            </div>
                            {s.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{s.description}</p>}
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                <span className="text-lg font-black text-primary-600">{formatPrice(s)}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(s)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => setDeleteId(s._id)} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Service' : 'Add Service'}>
                <div className="space-y-4">
                    <Input label="Service Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Complete Blood Count (CBC)" required />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" placeholder="Brief description of this service..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Type</label>
                            <select value={form.priceType} onChange={(e) => setForm({ ...form, priceType: e.target.value })} className="input-field">
                                {PRICE_TYPES.map((pt) => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
                            </select>
                        </div>
                        {['fixed', 'starting_from'].includes(form.priceType) && (
                            <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="250" />
                        )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-primary-600" />
                        <span className="text-sm font-medium text-gray-700">Show on business page</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleSave} loading={saving}>
                            {editingId ? 'Update' : 'Add Service'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Service?"
                message="This service will be removed from your business page."
                loading={deleting}
            />
        </div>
    );
}
