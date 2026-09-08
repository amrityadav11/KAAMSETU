import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Phone, MessageCircle, MapPin, Clock, Globe, Mail,
    Share2, Send, ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import useDocumentMeta from '../../hooks/useDocumentMeta';

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function isOpenNow(openingHours) {
    if (!openingHours?.length) return null;
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = openingHours.find((h) => h.day === dayName);
    if (!todayHours || !todayHours.isOpen) return false;
    const [openH, openM] = todayHours.openTime.split(':').map(Number);
    const [closeH, closeM] = todayHours.closeTime.split(':').map(Number);
    const nowMins = now.getHours() * 60 + now.getMinutes();
    return nowMins >= openH * 60 + openM && nowMins <= closeH * 60 + closeM;
}

export default function PublicBusinessPage() {
    const { slug } = useParams();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [hoursOpen, setHoursOpen] = useState(false);
    const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', email: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeGallery, setActiveGallery] = useState(null);

    // Dynamic SEO meta tags
    useDocumentMeta({
        title: business
            ? `${business.name} | ${business.category} | KaamSetu`
            : 'KaamSetu — Local Business Directory',
        description: business
            ? `${business.description || `View services, contact info and location for ${business.name}.`} Find ${business.category} in ${business.city || 'India'} on KaamSetu.`
            : 'Discover local businesses on KaamSetu.',
        ogImage: business?.coverImage || business?.logo || undefined,
        ogUrl: `https://kaamsetu.in/business/${slug}`,
    });

    useEffect(() => {
        const source = new URLSearchParams(window.location.search).get('source');
        const load = async () => {
            try {
                const res = await api.get(`/businesses/slug/${slug}${source ? `?source=${source}` : ''}`);
                setBusiness(res.data.data.business);
            } catch (err) {
                if (err.response?.status === 404) setNotFound(true);
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    const trackWhatsapp = async () => {
        try { await api.post(`/businesses/slug/${slug}/track/whatsapp`); } catch { }
    };

    const trackPhone = async () => {
        try { await api.post(`/businesses/slug/${slug}/track/phone`); } catch { }
    };

    const handleWhatsApp = () => {
        trackWhatsapp();
        const num = business.whatsapp?.replace(/\D/g, '');
        const msg = encodeURIComponent(business.whatsappMessage || `Hello! I found ${business.name} on KaamSetu.`);
        window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
    };

    const handleCall = () => {
        trackPhone();
        window.location.href = `tel:${business.phone}`;
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: business.name, url });
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied!');
        }
    };

    const handleEnquiry = async (e) => {
        e.preventDefault();
        if (!enquiryForm.name || !enquiryForm.phone) return toast.error('Name and phone are required');
        setSubmitting(true);
        try {
            await api.post(`/leads/enquiry/${slug}`, enquiryForm);
            setSubmitted(true);
            toast.success('Enquiry sent! The business will contact you soon.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send enquiry');
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (s) => {
        if (s.priceType === 'free') return 'Free';
        if (s.priceType === 'on_request') return 'On Request';
        if (!s.price) return null;
        return `₹${s.price}${s.priceType === 'starting_from' ? '+' : ''}`;
    };

    if (loading) return <Loader fullScreen />;

    if (notFound) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Business Not Found</h1>
                <p className="text-gray-500 mb-6">This business page may not exist or is not published yet.</p>
                <Link to="/">
                    <Button>Go to KaamSetu</Button>
                </Link>
            </div>
        );
    }

    const openStatus = isOpenNow(business.openingHours);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cover + Hero */}
            <div className="relative">
                {/* Cover image */}
                <div className="h-52 md:h-72 bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden">
                    {business.coverImage && (
                        <img
                            src={business.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover opacity-80"
                        />
                    )}
                </div>

                {/* Top nav */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                        <div className="w-5 h-5 bg-primary-600 rounded-md flex items-center justify-center">
                            <span className="text-white font-black text-xs">K</span>
                        </div>
                        <span className="text-xs font-bold text-gray-700">KaamSetu</span>
                    </Link>
                    <button
                        onClick={handleShare}
                        className="bg-white/90 backdrop-blur-sm rounded-xl p-2 text-gray-700 hover:bg-white"
                    >
                        <Share2 size={16} />
                    </button>
                </div>

                {/* Business profile */}
                <div className="max-w-3xl mx-auto px-4 relative">
                    <div className="flex items-end gap-4 -mt-16 pb-4">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-xl bg-white overflow-hidden flex-shrink-0">
                            {business.logo ? (
                                <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-600 font-black text-3xl">
                                        {business.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="pb-2">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-semibold bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full">
                                    {business.category}
                                </span>
                                {openStatus !== null && (
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${openStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {openStatus ? 'Open Now' : 'Closed'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{business.name}</h1>
                    {business.city && (
                        <p className="text-gray-500 flex items-center gap-1 text-sm mb-4">
                            <MapPin size={13} /> {business.address ? `${business.address}, ` : ''}{business.city}
                            {business.state ? `, ${business.state}` : ''}
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pb-28 space-y-5">
                {/* CTA Buttons */}
                <div className="grid grid-cols-3 gap-3">
                    {business.whatsapp && (
                        <button
                            onClick={handleWhatsApp}
                            className="flex flex-col items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 transition-all active:scale-95 shadow-lg"
                        >
                            <MessageCircle size={22} />
                            <span className="text-xs font-bold">WhatsApp</span>
                        </button>
                    )}
                    {business.phone && (
                        <button
                            onClick={handleCall}
                            className="flex flex-col items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl py-4 transition-all active:scale-95 shadow-lg"
                        >
                            <Phone size={22} />
                            <span className="text-xs font-bold">Call Now</span>
                        </button>
                    )}
                    <a
                        href="#enquiry"
                        className="flex flex-col items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl py-4 transition-all active:scale-95 shadow-sm"
                    >
                        <Send size={22} />
                        <span className="text-xs font-bold">Enquire</span>
                    </a>
                </div>

                {/* About */}
                {business.description && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-3">About</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{business.description}</p>
                    </div>
                )}

                {/* Services */}
                {business.services?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4">Services</h2>
                        <div className="divide-y divide-gray-50">
                            {business.services.map((s) => (
                                <div key={s._id} className="flex items-center justify-between py-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                                        {s.description && (
                                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{s.description}</p>
                                        )}
                                    </div>
                                    {formatPrice(s) && (
                                        <span className="text-primary-600 font-black text-sm ml-4 flex-shrink-0">
                                            {formatPrice(s)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products */}
                {business.products?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4">Products</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {business.products.map((p) => (
                                <div key={p._id} className="border border-gray-100 rounded-xl p-3">
                                    {p.image && (
                                        <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                                    )}
                                    <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {p.discountPrice ? (
                                            <>
                                                <span className="text-primary-600 font-black text-sm">₹{p.discountPrice}</span>
                                                <span className="text-gray-400 text-xs line-through">₹{p.price}</span>
                                            </>
                                        ) : p.price ? (
                                            <span className="text-primary-600 font-black text-sm">₹{p.price}</span>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery */}
                {business.gallery?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4">Gallery</h2>
                        <div className="grid grid-cols-3 gap-2">
                            {business.gallery.slice(0, 9).map((img) => (
                                <div
                                    key={img._id}
                                    className="aspect-square rounded-xl overflow-hidden cursor-pointer"
                                    onClick={() => setActiveGallery(img.url)}
                                >
                                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Opening Hours */}
                {business.openingHours?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <button
                            onClick={() => setHoursOpen(!hoursOpen)}
                            className="w-full flex items-center justify-between"
                        >
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Clock size={16} className="text-primary-600" /> Opening Hours
                            </h2>
                            {hoursOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>
                        {hoursOpen && (
                            <div className="mt-4 space-y-2">
                                {DAYS_ORDER.map((day) => {
                                    const h = business.openingHours.find((x) => x.day === day);
                                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                                    return (
                                        <div key={day} className={`flex justify-between text-sm py-2 border-b border-gray-50 last:border-0 ${isToday ? 'text-primary-700 font-semibold' : 'text-gray-600'}`}>
                                            <span>{day}</span>
                                            {h ? (
                                                h.isOpen ? (
                                                    <span>{h.openTime} – {h.closeTime}</span>
                                                ) : (
                                                    <span className="text-red-400">Closed</span>
                                                )
                                            ) : <span className="text-gray-400">—</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Contact & Address */}
                {(business.address || business.phone || business.email || business.website) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                        <h2 className="font-bold text-gray-900">Contact</h2>
                        {business.address && (
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(`${business.name} ${business.address} ${business.city}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-start gap-3 text-sm text-gray-600 hover:text-primary-600 group"
                            >
                                <MapPin size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                                <span>{business.address}{business.city ? `, ${business.city}` : ''}{business.state ? `, ${business.state}` : ''} {business.pincode}</span>
                                <ExternalLink size={12} className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100" />
                            </a>
                        )}
                        {business.phone && (
                            <a href={`tel:${business.phone}`} onClick={trackPhone} className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600">
                                <Phone size={16} className="text-primary-500 flex-shrink-0" /> {business.phone}
                            </a>
                        )}
                        {business.email && (
                            <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600">
                                <Mail size={16} className="text-primary-500 flex-shrink-0" /> {business.email}
                            </a>
                        )}
                        {business.website && (
                            <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600">
                                <Globe size={16} className="text-primary-500 flex-shrink-0" /> {business.website}
                            </a>
                        )}
                    </div>
                )}

                {/* Enquiry Form */}
                <div id="enquiry" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-900 mb-4">Send Enquiry</h2>
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">✅</div>
                            <p className="font-bold text-gray-900">Enquiry Sent!</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {business.name} will contact you soon.
                            </p>
                            <button
                                onClick={() => { setSubmitted(false); setEnquiryForm({ name: '', phone: '', email: '', message: '' }); }}
                                className="mt-4 text-primary-600 text-sm font-semibold hover:underline"
                            >
                                Send another enquiry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleEnquiry} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        placeholder="Your Name *"
                                        value={enquiryForm.name}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                                        className="input-field text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        placeholder="Phone Number *"
                                        type="tel"
                                        value={enquiryForm.phone}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                                        className="input-field text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <input
                                placeholder="Email (optional)"
                                type="email"
                                value={enquiryForm.email}
                                onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                                className="input-field text-sm"
                            />
                            <textarea
                                placeholder="Your message..."
                                value={enquiryForm.message}
                                onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                                rows={3}
                                className="input-field text-sm resize-none"
                            />
                            <Button type="submit" loading={submitting} className="w-full" size="lg">
                                Send Enquiry
                            </Button>
                        </form>
                    )}
                </div>

                {/* KaamSetu branding — shown on FREE plan */}
                {business.subscription?.plan === 'FREE' && (
                    <div className="text-center py-2">
                        <Link to="/" className="text-xs text-gray-400 hover:text-primary-600 transition-colors">
                            Powered by <span className="font-bold text-primary-600">KaamSetu</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Sticky WhatsApp FAB */}
            {business.whatsapp && (
                <button
                    onClick={handleWhatsApp}
                    className="whatsapp-fab"
                    aria-label="Chat on WhatsApp"
                >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                </button>
            )}

            {/* Gallery lightbox */}
            {activeGallery && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setActiveGallery(null)}
                >
                    <img
                        src={activeGallery}
                        alt="Gallery"
                        className="max-w-full max-h-full rounded-2xl object-contain"
                    />
                </div>
            )}
        </div>
    );
}
