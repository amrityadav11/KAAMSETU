import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email) newErrors.email = 'Email is required';
        if (!form.password) newErrors.password = 'Password is required';
        if (form.password && form.password.length < 8) newErrors.password = 'Minimum 8 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register(form);
            toast.success('Account created! Let\'s set up your business.');
            navigate('/dashboard/business/setup');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-black">K</span>
                        </div>
                        <span className="text-2xl font-black text-gray-900">
                            Kaam<span className="text-primary-600">Setu</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-1">Create your account</h1>
                    <p className="text-gray-500 mb-8">Start building your professional business page</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            name="name"
                            type="text"
                            placeholder="Ramesh Kumar"
                            value={form.name}
                            onChange={handleChange}
                            icon={User}
                            error={errors.name}
                            required
                        />
                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            icon={Mail}
                            error={errors.email}
                            required
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={form.phone}
                            onChange={handleChange}
                            icon={Phone}
                            error={errors.phone}
                            hint="Optional — for business contact"
                        />
                        <div className="relative">
                            <Input
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 8 characters"
                                value={form.password}
                                onChange={handleChange}
                                icon={Lock}
                                error={errors.password}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            Create Free Account
                        </Button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        By registering, you agree to our Terms of Service and Privacy Policy.
                    </p>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
