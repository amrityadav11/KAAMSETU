const slugifyLib = require('slugify');
const Business = require('../models/Business');

const createSlug = (name) => {
    return slugifyLib(name, {
        lower: true,
        strict: true,
        locale: 'en',
    });
};

const generateUniqueSlug = async (name, existingId = null) => {
    let slug = createSlug(name);
    let counter = 0;
    let finalSlug = slug;

    while (true) {
        const query = { slug: finalSlug };
        if (existingId) {
            query._id = { $ne: existingId };
        }
        const existing = await Business.findOne(query);
        if (!existing) break;
        counter++;
        finalSlug = `${slug}-${counter}`;
    }

    return finalSlug;
};

module.exports = { createSlug, generateUniqueSlug };
