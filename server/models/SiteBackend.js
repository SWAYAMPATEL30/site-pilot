import mongoose from 'mongoose';

/**
 * SiteBackend stores the auto-generated backend configuration for each website.
 * The smart agent populates this with endpoints, collections, and sample data.
 */
const siteBackendSchema = new mongoose.Schema({
    website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true, unique: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },

    // The generated API definition from the smart agent
    apiDefinition: {
        type: mongoose.Schema.Types.Mixed,
        default: { endpoints: [], collections: [] },
    },

    // Dynamic data store — each collection's data lives here
    // e.g. data.menu = [{name: 'Pizza', ...}], data.contacts = [{...}]
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    status: { type: String, enum: ['generating', 'active', 'error'], default: 'generating' },
    apiBaseUrl: String,
    lastGenerated: Date,
}, { timestamps: true });

export default mongoose.model('SiteBackend', siteBackendSchema);
