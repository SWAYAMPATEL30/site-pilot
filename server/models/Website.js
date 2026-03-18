import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    businessType: { type: String, default: 'general' },
    generatedHTML: { type: String, default: '' },
    settings: {
        favicon: { type: String, default: '' },
        analytics: { type: String, default: '' },
        customCSS: { type: String, default: '' },
        customJS: { type: String, default: '' },
    },
    seo: {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        keywords: [String],
        ogImage: { type: String, default: '' },
    },
    domain: { type: String, default: '' },
    publishedAt: { type: Date },
    publishedVersion: { type: Number, default: 0 },
    currentVersion: { type: Number, default: 1 },

    // Chat history — persisted for session continuity
    chatHistory: [{
        role: { type: String, enum: ['user', 'ai'], required: true },
        content: { type: String, default: '' },
        ts: { type: Number },
    }],

    // Prompt history for AI context
    promptHistory: [{ prompt: String }],

    // Version control — stores previous HTML versions
    versions: [{
        version: { type: Number, required: true },
        html: { type: String, required: true },
        prompt: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
        label: { type: String, default: '' },
    }],
}, { timestamps: true });

websiteSchema.index({ tenant: 1, slug: 1 }, { unique: true });

export default mongoose.model('Website', websiteSchema);
