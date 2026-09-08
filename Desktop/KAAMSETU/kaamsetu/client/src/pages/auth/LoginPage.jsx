import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email) newErrors.email = 'Email is required';
        if (!form.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
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
                    <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h1>
                    <p className="text-gray-500 mb-8">Log in to your KaamSetu account</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                        <div className="relative">
                            <Input
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
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
                            Log In
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                            Create one free
                        </Link>
                    </p>

                    <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500">
                        <p className="font-semibold mb-1 text-gray-700">Demo accounts:</p>
                        <p>Owner: demo@kaamsetu.in / Demo@1234</p>
                        <p>Admin: admin@kaamsetu.in / Admin@1234</p>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    © 2026 KaamSetu · Made in India 🇮🇳
                </p>
            </div>
        </div>
    );
}
