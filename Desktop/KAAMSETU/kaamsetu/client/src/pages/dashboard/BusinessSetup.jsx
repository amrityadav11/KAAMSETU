import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, ArrowLeft, Building2 } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CATEGORIES = [
    'Diagnostic Lab', 'Clinic', 'Pharmacy', 'Restaurant', 'Salon', 'Gym',
    'Coaching Centre', 'Grocery Store', 'Clothing Store', 'Electronics Store',
    'Mobile Shop', 'Photographer', 'Hotel', 'Repair Service', 'Freelancer', 'Other',
];

const STEPS = [
    'Business Name & Category',
    'Contact Information',
    'Address',
    'Description',
];

export default function BusinessSetup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [businessId, setBusinessId] = useState(null);
    const [form, setForm] = useState({
        name: '',
        category: 'Diagnostic Lab',
        phone: '',
        whatsapp: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        description: '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleNext = async () => {
        if (step === 0) {
            if (!form.name.trim()) return toast.error('Please enter your business name');
            setLoading(true);
            try {
                const res = await api.post('/businesses', { name: form.name, category: form.category });
                setBusinessId(res.data.data.business._id);
                setStep(1);
            } catch (err) {
                if (err.response?.status === 409) {
                    // Business exists, go to edit
                    navigate('/dashboard/business');
                } else {
                    toast.error(err.response?.data?.message || 'Failed to create business');
                }
            } finally {
                setLoading(false);
            }
            return;
        }

        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            // Save all remaining info
            setLoading(true);
            try {
                await api.put(`/businesses/${businessId}`, form);
                toast.success('Business setup complete!');
                navigate('/dashboard/business');
            } catch {
                toast.error('Failed to save. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-600">Step {step + 1} of {STEPS.length}</span>
                        <span className="text-sm text-gray-400">{STEPS[step]}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {step === 0 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <Building2 size={20} className="text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">Name your business</h2>
                                    <p className="text-gray-500 text-sm">This will appear on your page URL</p>
                                </div>
                            </div>
                            <Input
                                label="Business Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g., Vimla Janch Ghar"
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Contact Information</h2>
                            <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
                            <Input label="WhatsApp Number" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="919876543210 (with 91 prefix)" hint="Include country code e.g. 91 for India" />
                            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="business@email.com" />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Your Location</h2>
                            <Input label="Street Address" name="address" value={form.address} onChange={handleChange} placeholder="Shop no, street, area" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="City" name="city" value={form.city} onChange={handleChange} placeholder="Patna" />
                                <Input label="State" name="state" value={form.state} onChange={handleChange} placeholder="Bihar" />
                            </div>
                            <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="800001" />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-black text-gray-900 mb-6">About Your Business</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Tell customers about your business — what you offer, how long you've been running, what makes you unique..."
                                    className="input-field resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                        {step > 0 ? (
                            <Button variant="ghost" onClick={() => setStep(step - 1)} icon={ArrowLeft}>Back</Button>
                        ) : (
                            <div />
                        )}
                        <Button onClick={handleNext} loading={loading} icon={ArrowRight}>
                            {step === STEPS.length - 1 ? 'Complete Setup' : 'Next Step'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
