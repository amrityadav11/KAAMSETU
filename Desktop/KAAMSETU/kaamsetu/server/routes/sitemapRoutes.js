const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// @desc    XML sitemap for SEO crawlers
// @route   GET /sitemap.xml
// @access  Public
router.get('/', async (req, res) => {
  try {
    const businesses = await Business.find({ isPublished: true, isActive: true })
      .select('slug updatedAt')
      .lean();

    const baseUrl = process.env.CLIENT_URL || 'https://kaamsetu.in';

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/businesses', priority: '0.9', changefreq: 'daily' },
      { url: '/login', priority: '0.5', changefreq: 'monthly' },
      { url: '/register', priority: '0.6', changefreq: 'monthly' },
    ];

    const businessPages = businesses.map((b) => ({
      url: `/business/${b.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: b.updatedAt ? b.updatedAt.toISOString().split('T')[0] : undefined,
    }));

    const allPages = [...staticPages, ...businessPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><error>Sitemap unavailable</error>');
  }
});

module.exports = router;
