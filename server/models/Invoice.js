import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['paid', 'pending', 'failed', 'refunded'], default: 'pending' },
    plan: { type: String, required: true },
    period: {
        start: Date,
        end: Date,
    },
    paymentMethod: {
        type: { type: String, default: 'card' },
        last4: String,
        brand: String,
    },
    description: { type: String, default: '' },
}, { timestamps: true });

invoiceSchema.index({ tenant: 1, createdAt: -1 });

export default mongoose.model('Invoice', invoiceSchema);
