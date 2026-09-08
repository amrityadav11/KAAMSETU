const AnalyticsEvent = require('../models/AnalyticsEvent');
const Business = require('../models/Business');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get analytics for owner's business
// @route   GET /api/analytics
// @access  Private
const getAnalytics = asyncHandler(async (req, res) => {
  const business = await Business.findOne({ owner: req.user._id });
  if (!business) return sendError(res, 'Business not found', 404);

  const { period = '30' } = req.query;
  const days = Math.min(parseInt(period) || 30, 365); // cap at 365 days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [eventCounts, recentEvents] = await Promise.all([
    AnalyticsEvent.aggregate([
      { $match: { business: business._id, createdAt: { $gte: startDate } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]),
    AnalyticsEvent.aggregate([
      {
        $match: {
          business: business._id,
          createdAt: { $gte: startDate },
          type: 'page_view',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const counts = {
    page_view: 0,
    whatsapp_click: 0,
    phone_click: 0,
    enquiry: 0,
    qr_scan: 0,
  };
  eventCounts.forEach((e) => { counts[e._id] = e.count; });

  const totalInteractions = counts.whatsapp_click + counts.phone_click + counts.enquiry;
  const conversionRate =
    counts.page_view > 0
      ? ((totalInteractions / counts.page_view) * 100).toFixed(1)
      : '0.0';

  return sendSuccess(res, 'Analytics fetched', {
    period: days,
    counts,
    conversionRate,
    chartData: recentEvents,
    businessStats: {
      totalViews: business.views,
      totalWhatsappClicks: business.whatsappClicks,
      totalPhoneClicks: business.phoneClicks,
      totalEnquiries: business.enquiryCount,
    },
  });
});

module.exports = { getAnalytics };
