import mongoose from 'mongoose';

const deploymentSchema = new mongoose.Schema({
    website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    deployedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    version: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'building', 'deploying', 'live', 'failed', 'rolled_back'], default: 'pending' },
    environment: { type: String, enum: ['preview', 'production'], default: 'production' },
    url: { type: String, default: '' },
    buildTime: { type: Number, default: 0 },
    changelog: { type: String, default: '' },
    rollbackFrom: { type: Number },
}, { timestamps: true });

deploymentSchema.index({ website: 1, createdAt: -1 });

export default mongoose.model('Deployment', deploymentSchema);
