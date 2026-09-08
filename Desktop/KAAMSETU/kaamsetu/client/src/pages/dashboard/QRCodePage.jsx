import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { QrCode, Download, RefreshCw, Printer, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

export default function QRCodePage() {
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/businesses/my');
                setBusiness(res.data.data.business);
            } catch { }
            setLoading(false);
        };
        load();
    }, []);

    const generateQR = async () => {
        setGenerating(true);
        try {
            const res = await api.post(`/businesses/${business._id}/qr`);
            setBusiness({ ...business, qrCode: res.data.data.qrCode });
            toast.success('QR code regenerated');
        } catch {
            toast.error('Failed to generate QR code');
        } finally {
            setGenerating(false);
        }
    };

    const downloadQR = () => {
        if (!business?.qrCode) return;
        const link = document.createElement('a');
        link.href = business.qrCode;
        link.download = `${business.slug}-qr-code.png`;
        link.click();
        toast.success('QR code downloaded');
    };

    const printCard = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Card — ${business.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', Arial, sans-serif; background: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          .card { width: 320px; padding: 32px 24px; border: 2px solid #16a34a; border-radius: 20px; text-align: center; }
          .brand { color: #16a34a; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
          .qr { width: 200px; height: 200px; margin: 0 auto 20px; border: 4px solid #16a34a; border-radius: 12px; padding: 8px; }
          .qr img { width: 100%; height: 100%; }
          .scan { font-size: 15px; color: #374151; font-weight: 600; margin-bottom: 8px; }
          .biz-name { font-size: 22px; font-weight: 900; color: #111827; margin-bottom: 4px; }
          .category { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
          .footer { font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">KaamSetu</div>
          <div class="qr"><img src="${business.qrCode}" alt="QR Code" /></div>
          <p class="scan">📱 Scan to view our business</p>
          <p class="biz-name">${business.name}</p>
          <p class="category">${business.category}</p>
          <div class="footer">Powered by KaamSetu · kaamsetu.in</div>
        </div>
      </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) return <Loader />;

    if (!business) {
        return (
            <div className="p-6 text-center text-gray-500">
                Please create your business first.
            </div>
        );
    }

    if (!business.isPublished) {
        return (
            <div className="p-6 md:p-8">
                <div className="card text-center py-16 max-w-md mx-auto">
                    <QrCode size={40} className="text-gray-300 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Publish First</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Your QR code will be generated once you publish your business page.
                    </p>
                    <a href="/dashboard/business">
                        <Button>Go to My Business</Button>
                    </a>
                </div>
            </div>
        );
    }

    const businessUrl = `${window.location.origin}/business/${business.slug}`;

    return (
        <div className="p-6 md:p-8 max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">QR Code</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Share this QR code so customers can find your business instantly
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* QR Preview Card */}
                <div className="card text-center">
                    <div className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-4">
                        KaamSetu
                    </div>
                    {business.qrCode ? (
                        <div className="inline-block border-4 border-primary-500 rounded-2xl p-3 mb-4 bg-white shadow-lg">
                            <img
                                src={business.qrCode}
                                alt="QR Code"
                                className="w-44 h-44 rounded-xl"
                            />
                        </div>
                    ) : (
                        <div className="w-52 h-52 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <QrCode size={48} className="text-gray-300" />
                        </div>
                    )}
                    <p className="text-sm font-semibold text-gray-700 mb-1">📱 Scan to view our business</p>
                    <p className="text-lg font-black text-gray-900 mb-0.5">{business.name}</p>
                    <p className="text-sm text-gray-500 mb-4">{business.category}</p>
                    <p className="text-xs text-gray-400">Powered by KaamSetu</p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <div className="card bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Business URL</p>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-primary-600 font-medium flex-1 break-all">{businessUrl}</p>
                            <a href={businessUrl} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-primary-600">
                                <ExternalLink size={15} />
                            </a>
                        </div>
                    </div>

                    <Button onClick={downloadQR} disabled={!business.qrCode} className="w-full" icon={Download} size="lg">
                        Download QR Code
                    </Button>

                    <Button onClick={printCard} disabled={!business.qrCode} variant="secondary" className="w-full" icon={Printer} size="lg">
                        Print QR Card
                    </Button>

                    <Button onClick={generateQR} loading={generating} variant="outline" className="w-full" icon={RefreshCw}>
                        Regenerate QR Code
                    </Button>

                    <div className="card bg-primary-50 border-primary-200">
                        <p className="text-sm font-semibold text-primary-800 mb-2">💡 Tips for using your QR code</p>
                        <ul className="text-xs text-primary-700 space-y-1">
                            <li>• Print and stick it at your shop entrance</li>
                            <li>• Add it to your visiting cards and pamphlets</li>
                            <li>• Share the image on WhatsApp groups</li>
                            <li>• Add it to your social media bio</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
