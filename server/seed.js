import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Tenant from './models/Tenant.js';
import Website from './models/Website.js';

dotenv.config();

async function seed() {
    await connectDB();
    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Tenant.deleteMany({});
    await Website.deleteMany({});

    // Create tenants
    const t1 = await Tenant.create({ name: 'Bella Cucina', slug: 'bella-cucina', plan: 'professional' });
    const t2 = await Tenant.create({ name: 'TechStart Inc', slug: 'techstart', plan: 'starter' });
    const t3 = await Tenant.create({ name: 'GreenLeaf Studio', slug: 'greenleaf', plan: 'free' });

    // Create users
    const u1 = await User.create({ name: 'Marco Rossi', email: 'marco@bellacucina.com', password: 'demo123', role: 'owner', tenant: t1._id });
    const u2 = await User.create({ name: 'Sarah Chen', email: 'sarah@techstart.com', password: 'demo123', role: 'owner', tenant: t2._id });
    const u3 = await User.create({ name: 'James Park', email: 'james@greenleaf.com', password: 'demo123', role: 'owner', tenant: t3._id });

    // Set owners
    t1.owner = u1._id; await t1.save();
    t2.owner = u2._id; await t2.save();
    t3.owner = u3._id; await t3.save();

    // Create sample websites
    await Website.create({ name: 'Bella Cucina Restaurant', slug: 'bella-cucina-restaurant', tenant: t1._id, businessType: 'restaurant', status: 'published' });
    await Website.create({ name: 'TechStart Landing', slug: 'techstart-landing', tenant: t2._id, businessType: 'technology', status: 'draft' });
    await Website.create({ name: 'GreenLeaf Portfolio', slug: 'greenleaf-portfolio', tenant: t3._id, businessType: 'creative', status: 'draft' });

    // Update usage
    t1.usage.websites = 1; await t1.save();
    t2.usage.websites = 1; await t2.save();
    t3.usage.websites = 1; await t3.save();

    console.log('✅ Seeded successfully!');
    console.log('\n📧 Demo accounts:');
    console.log('   marco@bellacucina.com / demo123 (Professional)');
    console.log('   sarah@techstart.com / demo123 (Starter)');
    console.log('   james@greenleaf.com / demo123 (Free)');

    process.exit(0);
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
