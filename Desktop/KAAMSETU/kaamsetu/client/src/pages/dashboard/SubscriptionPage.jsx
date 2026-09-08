import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, Crown, Zap } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const PLANS = [
    {
        id: 'FREE',
        name: 'Free',
        price: 0,
        icon: Zap,
        color: 'border-gray-200',
        badge: null,
        features: [
            'Professional business page',
            'Basic business information',
            'WhatsApp button',
            'Call button',
            'Basic services list',
            'KaamSetu branding',
        ],
    },
    {
        id: 'STARTER',
        name: 'Starter',
        price: 499,
        icon: Zap,
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
        id: 'PRO',
        name: 'Pro',
        price: 999,
        icon: Crown,
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

export default function SubscriptionPage() {
    const [business, setBusiness] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [bRes, pRes] = await Promise.all([
                    api.get('/businesses/my'),
                    api.get('/payments').catch(() => ({ data: { data: { payments: [] } } })),
                ]);
                setBusiness(bRes.data.data.business);
                setPayments(pRes.data.data.payments);
            } catch { }
            setLoading(false);
        };
        load();
    }, []);

    const handleUpgrade = async (planId) => {
        setPaying(planId);
        try {
            // Create Razorpay order
            const orderRes = await api.post('/payments/create-order', { plan: planId });
            const { orderId, amount, currency, key, paymentId, businessName } = orderRes.data.data;

            // Open Razorpay checkout
            const options = {
                key,
                amount,
                currency,
                name: 'KaamSetu',
                description: `${planId} Plan — Annual Subscription`,
                order_id: orderId,
                handler: async (response) => {
                    try {
                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            paymentId,
                        });
                        toast.success(`🎉 ${planId} plan activated!`);
                        // Refresh business
                        const res = await api.get('/businesses/my');
                        setBusiness(res.data.data.business);
                    } catch {
                        toast.error('Payment verification failed. Contact support.');
                    }
                },
                prefill: { name: businessName },
                theme: { color: '#16a34a' },
                modal: { ondismiss: () => setPaying(null) },
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // Load Razorpay script dynamically
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                };
                document.head.appendChild(script);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment failed to initialize');
            setPaying(null);
        }
    };

    if (loading) return <Loader />;

    const currentPlan = business?.subscription?.plan || 'FREE';
    const expiresAt = business?.subscription?.expiresAt;

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">Subscription</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your KaamSetu plan</p>
            </div>

            {/* Current plan */}
            <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-primary-200 text-sm font-medium mb-1">Current Plan</p>
                        <p className="text-3xl font-black">{currentPlan}</p>
                        {expiresAt && (
                            <p className="text-primary-200 text-sm mt-1">
                                Expires: {new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        )}
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Crown size={28} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Plans grid */}
            <div className="grid md:grid-cols-3 gap-5">
                {PLANS.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrent = currentPlan === plan.id;
                    return (
                        <div key={plan.id} className={`relative rounded-2xl border-2 ${plan.color} p-6 bg-white ${plan.badge ? 'shadow-xl' : 'shadow-sm'}`}>
                            {plan.badge && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 ${plan.badge ? 'bg-primary-100' : 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
                                    <Icon size={18} className={plan.badge ? 'text-primary-600' : 'text-gray-600'} />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900">{plan.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {plan.price === 0 ? 'Free forever' : `₹${plan.price}/year`}
                                    </p>
                                </div>
                            </div>
                            <ul className="space-y-2 mb-6">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle size={14} className="text-primary-500 flex-shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            {isCurrent ? (
                                <div className="w-full py-2.5 text-center bg-primary-50 text-primary-700 font-semibold rounded-xl text-sm">
                                    ✓ Current Plan
                                </div>
                            ) : plan.price === 0 ? (
                                <div className="w-full py-2.5 text-center bg-gray-50 text-gray-500 font-medium rounded-xl text-sm">
                                    Free Plan
                                </div>
                            ) : (
                                <Button
                                    className="w-full"
                                    variant={plan.badge ? 'primary' : 'secondary'}
                                    onClick={() => handleUpgrade(plan.id)}
                                    loading={paying === plan.id}
                                >
                                    Upgrade to {plan.name}
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Payment history */}
            {payments.length > 0 && (
                <div className="card">
                    <h2 className="font-bold text-gray-900 mb-4">Payment History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-100">
                                    <th className="pb-3 font-semibold">Date</th>
                                    <th className="pb-3 font-semibold">Plan</th>
                                    <th className="pb-3 font-semibold">Amount</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map((p) => (
                                    <tr key={p._id}>
                                        <td className="py-3 text-gray-600">
                                            {new Date(p.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="py-3 font-semibold text-gray-900">{p.plan}</td>
                                        <td className="py-3 text-gray-900">₹{p.amount}</td>
                                        <td className="py-3">
                                            <span className={`badge-${p.status === 'paid' ? 'green' : p.status === 'failed' ? 'red' : 'gray'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
