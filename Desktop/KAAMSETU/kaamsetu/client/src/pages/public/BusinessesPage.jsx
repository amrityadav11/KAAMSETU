import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, MapPin, MessageCircle, Building2 } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const CATEGORIES = [
    'All', 'Diagnostic Lab', 'Clinic', 'Pharmacy', 'Restaurant', 'Salon',
    'Gym', 'Coaching Centre', 'Grocery Store', 'Other',
];

export default function BusinessesPage() {
    const { category: categoryParam } = useParams();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [category, setCategory] = useState(categoryParam || 'All');
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

    const loadBusinesses = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 12 });
            if (search) params.append('search', search);
            if (city) params.append('city', city);
            if (category !== 'All') params.append('category', category);
            const res = await api.get(`/businesses?${params}`);
            setBusinesses(res.data.data.businesses);
            setPagination(res.data.data.pagination);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { loadBusinesses(); }, [category, city]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadBusinesses();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-14 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-black mb-4">Discover Local Businesses</h1>
                    <p className="text-primary-100 mb-8">Find trusted businesses in your area</p>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                placeholder="Search businesses, services..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                            />
                        </div>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full sm:w-36 pl-10 pr-4 py-3 rounded-xl border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                            />
                        </div>
                        <Button type="submit" className="bg-white text-primary-700 hover:bg-primary-50 flex-shrink-0" size="lg">
                            Search
                        </Button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${category === cat
                                    ? 'bg-primary-600 text-white shadow'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-sm text-gray-500 mb-5">
                    {pagination.total} business{pagination.total !== 1 ? 'es' : ''} found
                    {category !== 'All' ? ` in ${category}` : ''}
                    {city ? ` in ${city}` : ''}
                </p>

                {loading ? (
                    <Loader />
                ) : businesses.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 size={40} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No businesses found</h3>
                        <p className="text-gray-400 text-sm">Try a different search or category</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {businesses.map((b) => (
                            <Link
                                key={b._id}
                                to={`/business/${b.slug}`}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                            >
                                {/* Cover */}
                                <div className="h-36 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden relative">
                                    {b.coverImage ? (
                                        <img src={b.coverImage} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-white font-black text-4xl opacity-30">
                                                {b.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    {b.logo && (
                                        <div className="absolute bottom-2 left-3 w-10 h-10 rounded-xl border-2 border-white bg-white overflow-hidden shadow">
                                            <img src={b.logo} alt="Logo" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="p-4">
                                    <span className="text-xs text-primary-600 font-semibold">{b.category}</span>
                                    <h3 className="font-bold text-gray-900 mt-1 mb-1 line-clamp-1">{b.name}</h3>
                                    {b.city && (
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                            <MapPin size={11} /> {b.city}
                                        </p>
                                    )}
                                    {b.description && (
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{b.description}</p>
                                    )}
                                    {b.whatsapp && (
                                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                            <MessageCircle size={11} /> WhatsApp available
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => loadBusinesses(p)}
                                className={`w-10 h-10 rounded-xl text-sm font-semibold ${p === pagination.page ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
