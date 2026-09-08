import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

const defaultForm = { name: '', description: '', price: '', discountPrice: '', category: '', isAvailable: true };

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data.data.products);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { loadProducts(); }, []);

    const openAdd = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
    const openEdit = (p) => {
        setForm({ name: p.name, description: p.description || '', price: p.price || '', discountPrice: p.discountPrice || '', category: p.category || '', isAvailable: p.isAvailable });
        setEditingId(p._id);
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) return toast.error('Product name is required');
        setSaving(true);
        try {
            if (editingId) {
                const res = await api.put(`/products/${editingId}`, form);
                setProducts(products.map((p) => p._id === editingId ? res.data.data.product : p));
            } else {
                const res = await api.post('/products', form);
                setProducts([...products, res.data.data.product]);
            }
            toast.success(editingId ? 'Product updated' : 'Product added');
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
            await api.delete(`/products/${deleteId}`);
            setProducts(products.filter((p) => p._id !== deleteId));
            toast.success('Product deleted');
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
                    <h1 className="text-2xl font-black text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
                </div>
                <Button onClick={openAdd} icon={Plus}>Add Product</Button>
            </div>

            {products.length === 0 ? (
                <EmptyState icon={Package} title="No products yet" description="Add products you sell so customers know what's available." action={openAdd} actionLabel="Add First Product" />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <div key={p._id} className="card group">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-gray-900">{p.name}</h3>
                                <span className={p.isAvailable ? 'badge-green' : 'badge-red'}>{p.isAvailable ? 'Available' : 'Out of Stock'}</span>
                            </div>
                            {p.category && <span className="badge-gray text-xs mb-2 inline-block">{p.category}</span>}
                            {p.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{p.description}</p>}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                <div>
                                    {p.discountPrice ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-primary-600">₹{p.discountPrice}</span>
                                            <span className="text-sm text-gray-400 line-through">₹{p.price}</span>
                                        </div>
                                    ) : (
                                        <span className="text-lg font-black text-primary-600">{p.price ? `₹${p.price}` : '—'}</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(p)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700"><Pencil size={15} /></button>
                                    <button onClick={() => setDeleteId(p._id)} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Product' : 'Add Product'}>
                <div className="space-y-4">
                    <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g., Medicines, Electronics" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        <Input label="Discount Price (₹)" type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-primary-600" />
                        <span className="text-sm font-medium text-gray-700">Available</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleSave} loading={saving}>{editingId ? 'Update' : 'Add'}</Button>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Product?" loading={deleting} />
        </div>
    );
}
