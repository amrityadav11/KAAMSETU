import React from 'react';
import { Link } from 'react-router-dom';
import {
    Smartphone, QrCode, MessageCircle, Phone, BarChart3,
    Star, CheckCircle, ArrowRight, Building2, Stethoscope,
    Utensils, Scissors, Dumbbell, BookOpen, ShoppingBag, ChevronDown,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';

const features = [
    { icon: Smartphone, title: 'Professional Business Page', desc: 'Beautiful, mobile-first page that looks great on every device.' },
    { icon: MessageCircle, title: 'WhatsApp Enquiries', desc: 'Customers reach you directly on WhatsApp with one tap.' },
    { icon: QrCode, title: 'QR Code', desc: 'Print your QR code and let customers scan to discover you.' },
    { icon: BarChart3, title: 'Analytics', desc: 'See who viewed your page, clicked WhatsApp, and enquired.' },
    { icon: CheckCircle, title: 'Services & Products', desc: 'List all your services and products with prices.' },
    { icon: Phone, title: 'Direct Call Button', desc: 'Customers can call you directly from your page.' },
];

const categories = [
    { icon: Stethoscope, name: 'Diagnostic Labs', color: 'bg-blue-50 text-blue-600' },
    { icon: Stethoscope, name: 'Clinics', color: 'bg-purple-50 text-purple-600' },
    { icon: Utensils, name: 'Restaurants', color: 'bg-orange-50 text-orange-600' },
    { icon: Scissors, name: 'Salons', color: 'bg-pink-50 text-pink-600' },
    { icon: Dumbbell, name: 'Gyms', color: 'bg-red-50 text-red-600' },
    { icon: BookOpen, name: 'Coaching Centres', color: 'bg-yellow-50 text-yellow-600' },
    { icon: ShoppingBag, name: 'Local Shops', color: 'bg-green-50 text-green-600' },
    { icon: Building2, name: 'Many More', color: 'bg-gray-50 text-gray-600' },
];

const steps = [
    { step: '1', title: 'Create your account', desc: 'Sign up free in 30 seconds.' },
    { step: '2', title: 'Add your business', desc: 'Fill in your business name, category, address and services.' },
    { step: '3', title: 'Publish', desc: 'Your professional page goes live instantly.' },
    { step: '4', title: 'Share your QR code', desc: 'Print it on your board, pamphlets, visiting cards.' },
    { step: '5', title: 'Get customers', desc: 'Customers find you, WhatsApp you, call you.' },
];

const plans = [
    {
        name: 'FREE',
        price: '₹0',
        period: 'forever',
        color: 'border-gray-200',
        badge: null,
        features: [
            'Professional business page',
            'Basic business info',
            'WhatsApp button',
            'Call button',
            'Basic services list',
            'KaamSetu branding',
        ],
    },
    {
        name: 'STARTER',
        price: '₹499',
        period: '/year',
        color: 'border-primary-500',
        badge: 'Most Popular',
        features: [
            'Everything in Free',
            'Remove KaamSetu branding',
            'Unlimited services',
            'Gallery (20 photos)',
            'QR code download',
            'Enquiry management',
            'Basic analytics',
        ],
    },
    {
        name: 'PRO',
        price: '₹999',
        period: '/year',
        color: 'border-gray-200',
        badge: null,
        features: [
            'Everything in Starter',
            'Advanced analytics',
            'Priority support',
            'Multiple staff users',
            'Advanced lead management',
            'Custom domain support',
        ],
    },
];

const faqs = [
    { q: 'Do I need coding knowledge?', a: 'Not at all. KaamSetu is designed for non-technical business owners. Creating your page takes less than 10 minutes.' },
    { q: 'Is there a free plan?', a: 'Yes! You can create a professional business page completely free. Paid plans remove branding and add advanced features.' },
    { q: 'How do customers contact me?', a: 'Customers can WhatsApp you, call you directly, or submit an enquiry form — all from your business page.' },
    { q: 'What is the QR code for?', a: 'Your QR code links directly to your business page. Print it on boards, pamphlets, or visiting cards so customers can scan and find you instantly.' },
    { q: 'Can I change my business information later?', a: 'Yes, you can update your business info, services, photos, and opening hours any time from your dashboard.' },
];

export default function LandingPage() {
    const [openFaq, setOpenFaq] = React.useState(null);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-8">
                        <Star size={14} className="text-yellow-300 fill-yellow-300" />
                        Trusted by 500+ local businesses across India
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
                        Apne Business Ko
                        <br />
                        <span className="text-green-300">Online Layein</span>
                        <br />
                        Sirf 10 Minutes Mein
                    </h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
                        KaamSetu helps local businesses — labs, clinics, restaurants, salons — create a
                        professional online presence and receive WhatsApp enquiries from customers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button size="xl" className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl w-full sm:w-auto">
                                Create My Business Free
                                <ArrowRight size={18} />
                            </Button>
                        </Link>
                        <Link to="/business/vimla-janch-ghar">
                            <Button size="xl" variant="ghost" className="border border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                                See Demo Page
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-primary-200 text-sm">No credit card required · Free forever plan available</p>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-b border-gray-100 py-12">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '500+', label: 'Businesses' },
                        { value: '10 min', label: 'Setup Time' },
                        { value: '₹0', label: 'To Start' },
                        { value: '24/7', label: 'Discoverable' },
                    ].map((s) => (
                        <div key={s.label}>
                            <div className="text-3xl font-black text-primary-600">{s.value}</div>
                            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 bg-gray-50" id="how-it-works">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">How It Works</h2>
                    <p className="text-gray-500 mb-14 max-w-xl mx-auto">From zero to online in under 10 minutes. No tech skills needed.</p>
                    <div className="grid md:grid-cols-5 gap-6">
                        {steps.map((s, i) => (
                            <div key={i} className="relative flex flex-col items-center">
                                <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-xl font-black mb-4 shadow-lg">
                                    {s.step}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 text-sm">{s.title}</h3>
                                <p className="text-xs text-gray-500">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white" id="features">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Everything You Need</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">One platform. All the tools a local business needs to go online and attract customers.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div key={f.title} className="p-6 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors group">
                                    <div className="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
                                        <Icon size={22} className="text-primary-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                                    <p className="text-gray-500 text-sm">{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Who is it for */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Built For Indian Local Businesses</h2>
                    <p className="text-gray-500 mb-12 max-w-xl mx-auto">If you run a local business in India, KaamSetu is for you.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((c) => {
                            const Icon = c.icon;
                            return (
                                <div key={c.name} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                                        <Icon size={22} />
                                    </div>
                                    <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 bg-white" id="pricing">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-500 mb-14 max-w-xl mx-auto">Start free. Upgrade when you're ready.</p>
                    <div className="grid md:grid-cols-3 gap-6 items-start">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl border-2 ${plan.color} p-8 ${plan.badge ? 'shadow-xl' : 'shadow-sm'}`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-lg font-black text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                                        <span className="text-gray-500 text-sm mb-1">{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8 text-left">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle size={15} className="text-primary-500 flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register">
                                    <Button
                                        variant={plan.badge ? 'primary' : 'secondary'}
                                        className="w-full"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <button
                                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 hover:bg-gray-50"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    {faq.q}
                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-primary-600 text-white text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        Your customers are already online.
                        <br />
                        Is your business?
                    </h2>
                    <p className="text-primary-100 mb-8 text-lg">
                        Join thousands of Indian local businesses on KaamSetu. Start free today.
                    </p>
                    <Link to="/register">
                        <Button size="xl" className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl">
                            Create My Business Page Free
                            <ArrowRight size={18} />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-sm">K</span>
                            </div>
                            <span className="text-xl font-black text-white">
                                Kaam<span className="text-primary-400">Setu</span>
                            </span>
                        </Link>
                        <div className="flex gap-6 text-sm">
                            <Link to="/businesses" className="hover:text-white transition-colors">Businesses</Link>
                            <Link to="/#features" className="hover:text-white transition-colors">Features</Link>
                            <Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
                        </div>
                        <p className="text-sm">© 2026 KaamSetu. Made in India 🇮🇳</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
