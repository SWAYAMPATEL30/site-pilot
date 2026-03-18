import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String,
    },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    action: { type: String, required: true },
    entityType: { type: String, enum: ['website', 'page', 'component', 'deployment', 'user', 'tenant', 'billing', 'domain'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
    location: {
        country: String,
        city: String,
    },
}, { timestamps: true });

activityLogSchema.index({ tenant: 1, createdAt: -1 });
activityLogSchema.index({ 'user.id': 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
