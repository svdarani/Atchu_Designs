// ==========================================================================
// ATCHU DESIGNS — PERSISTENT DATABASE SYSTEM (SQLite / Node 22)
// ==========================================================================

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'atchu.db');
export const db = new DatabaseSync(dbPath);

// Initialize Tables
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    language_preference TEXT DEFAULT 'en',
    google_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS measurement_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    profile_name TEXT NOT NULL,
    unit TEXT DEFAULT 'inches',
    bust TEXT,
    under_bust TEXT,
    waist TEXT,
    shoulder TEXT,
    armhole TEXT,
    sleeve_length TEXT,
    sleeve_round TEXT,
    blouse_length TEXT,
    front_neck TEXT,
    back_neck TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT DEFAULT 'online',
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT,
    items_json TEXT NOT NULL,
    total_amount REAL NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    stage TEXT NOT NULL DEFAULT 'order_created',
    target_date TEXT,
    internal_notes TEXT,
    customer_notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_status_history (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    stage TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_ta TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ta TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    updated_by TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS custom_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    design_category TEXT,
    work_type TEXT,
    fabric_source TEXT,
    measurements_json TEXT,
    reference_images_json TEXT,
    requirements TEXT,
    quote_amount REAL,
    status TEXT DEFAULT 'request_submitted',
    admin_notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// 13 Order Stages Definition
export const TIMELINE_STAGES = [
  {
    stage: 'order_created',
    order: 1,
    title_en: 'Order Created',
    title_ta: 'ஆர்டர் பதிவு செய்யப்பட்டது',
    desc_en: 'Order received successfully.',
    desc_ta: 'ஆர்டர் வெற்றிகரமாக பெறப்பட்டது.'
  },
  {
    stage: 'payment_pending',
    order: 2,
    title_en: 'Payment Pending',
    title_ta: 'பணம் செலுத்த காத்திருக்கிறது',
    desc_en: 'Payment is waiting for confirmation.',
    desc_ta: 'பணம் செலுத்துதல் உறுதிப்படுத்தலுக்காக காத்திருக்கிறது.'
  },
  {
    stage: 'payment_confirmed',
    order: 3,
    title_en: 'Payment Confirmed',
    title_ta: 'பணம் உறுதி செய்யப்பட்டது',
    desc_en: 'Payment has been successfully confirmed.',
    desc_ta: 'பணம் வெற்றிகரமாக உறுதி செய்யப்பட்டது.'
  },
  {
    stage: 'order_review',
    order: 4,
    title_en: 'Order Review',
    title_ta: 'ஆர்டர் மறுபரிசீலனை',
    desc_en: 'Our team is reviewing your order and customization details.',
    desc_ta: 'எங்கள் குழு உங்கள் ஆர்டர் மற்றும் தனிப்பயன் விவரங்களை சரிபார்க்கிறது.'
  },
  {
    stage: 'approved',
    order: 5,
    title_en: 'Approved',
    title_ta: 'அனுமதிக்கப்பட்டது',
    desc_en: 'Order has been approved for production.',
    desc_ta: 'ஆர்டர் தயாரிப்பிற்கு அனுமதிக்கப்பட்டது.'
  },
  {
    stage: 'stitching_started',
    order: 6,
    title_en: 'Stitching Started',
    title_ta: 'தையல் வேலை துவங்கியது',
    desc_en: 'Your blouse stitching has started.',
    desc_ta: 'உங்கள் பிளவுஸ் தையல் வேலை துவங்கியுள்ளது.'
  },
  {
    stage: 'aari_work',
    order: 7,
    title_en: 'Aari Work',
    title_ta: 'ஆரி வேலைப்பாடு',
    desc_en: 'Your blouse is currently being worked on with Aari embroidery.',
    desc_ta: 'உங்கள் பிளவுஸில் ஆரி வேலைப்பாடு கைவினைஞர்களால் நடைபெறுகிறது.'
  },
  {
    stage: 'quality_check',
    order: 8,
    title_en: 'Quality Check',
    title_ta: 'தரப் பரிசோதனை',
    desc_en: 'Final stitching and embroidery quality are being checked.',
    desc_ta: 'இறுதி தையல் மற்றும் வேலைப்பாடு தரம் முழுமையாக சரிபார்க்கப்படுகிறது.'
  },
  {
    stage: 'ready',
    order: 9,
    title_en: 'Ready',
    title_ta: 'தயாராகிவிட்டது',
    desc_en: 'Your blouse is ready.',
    desc_ta: 'உங்கள் பிளவுஸ் முழுமையாக தயாராகிவிட்டது.'
  },
  {
    stage: 'shipped',
    order: 10,
    title_en: 'Shipped',
    title_ta: 'அனுப்பப்பட்டது',
    desc_en: 'Your blouse has been dispatched.',
    desc_ta: 'உங்கள் பிளவுஸ் கொரியர் மூலம் அனுப்பப்பட்டுள்ளது.'
  },
  {
    stage: 'out_for_delivery',
    order: 11,
    title_en: 'Out for Delivery',
    title_ta: 'டெலிவரிக்கு வந்துள்ளது',
    desc_en: 'Your order is on the way.',
    desc_ta: 'உங்கள் ஆர்டர் விநியோகத்திற்கு வந்து கொண்டிருக்கிறது.'
  },
  {
    stage: 'delivered',
    order: 12,
    title_en: 'Delivered',
    title_ta: 'டெலிவரி செய்யப்பட்டது',
    desc_en: 'Your blouse has been delivered.',
    desc_ta: 'உங்கள் பிளவுஸ் வெற்றிகரமாக டெலிவரி செய்யப்பட்டது.'
  },
  {
    stage: 'completed',
    order: 13,
    title_en: 'Completed',
    title_ta: 'நிறைவடைந்தது',
    desc_en: 'Order successfully completed.',
    desc_ta: 'ஆர்டர் வெற்றிகரமாக நிறைவடைந்தது.'
  }
];

// Cryptographic Password Helpers
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  try {
    const check = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
  } catch {
    return false;
  }
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Initial Seeding
export function initSeedData() {
  // 1. Provision Primary Boutique Owner Admin
  const adminEmail = 'orders.atchudesigns@gmail.com';
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (!existingAdmin) {
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AtchuAdmin@2026!';
    const { hash, salt } = hashPassword(initialPassword);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, salt, name, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'admin', ?, ?)
    `).run(
      'admin-atchu-master',
      adminEmail,
      hash,
      salt,
      'Atchu Designs Admin',
      '+91 84385 51865',
      now,
      now
    );
  }

  // 2. Provision Demo Customer (Kavitha) for immediate verification
  const demoEmail = 'kavitha.r@gmail.com';
  const existingDemo = db.prepare('SELECT id FROM users WHERE email = ?').get(demoEmail);

  let demoUserId = existingDemo?.id;
  if (!existingDemo) {
    demoUserId = 'cust-atchu-demo';
    const { hash, salt } = hashPassword('Kavitha@2026!');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, salt, name, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'customer', ?, ?)
    `).run(
      demoUserId,
      demoEmail,
      hash,
      salt,
      'Kavitha Ramachandran',
      '+91 94432 18900',
      now,
      now
    );

    // Add demo address
    db.prepare(`
      INSERT INTO addresses (id, user_id, name, phone, address, city, state, pincode, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      'addr-demo-1',
      demoUserId,
      'Home',
      '+91 94432 18900',
      'Plot 12, Sri Nagar 2nd Street, Anna Nagar',
      'Chennai',
      'Tamil Nadu',
      '600040'
    );

    // Add demo saved measurement profile
    db.prepare(`
      INSERT INTO measurement_profiles (
        id, user_id, profile_name, unit, bust, under_bust, waist, shoulder,
        armhole, sleeve_length, sleeve_round, blouse_length, front_neck, back_neck,
        notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'meas-demo-1',
      demoUserId,
      'My Regular Bridal Fit',
      'inches',
      '36',
      '31',
      '30',
      '14.5',
      '16',
      '10.5',
      '11',
      '14',
      '7',
      '9.5',
      'Preferred comfortable armhole curve with padded cup support',
      now,
      now
    );
  }

  // 3. Seed Sample Orders with realistic 13-stage timeline history
  const orderCount = db.prepare('SELECT COUNT(*) as cnt FROM orders').get();
  if (orderCount.cnt === 0) {
    const now = new Date();
    const order1Id = 'BL-2026-000123';
    const order1Items = [
      {
        productName_en: 'Royal Mayura Peacock Zardosi Blouse',
        productName_ta: 'ராயல் மயூரா மயில் சர்தோசி பிளவுஸ்',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        unitPrice: 4250,
        quantity: 1,
        customization: {
          neck: 'Royal Boat Neck',
          sleeve: 'Elbow Length + Heavy Aari Border',
          back: 'Royal Pot Neck with Latkans',
          aari: 'Grand Bridal Zardosi & Cutwork',
          addons: ['Padded Cups Fitting', 'Handmade Zari Tassels']
        },
        measurements: {
          unit: 'inches',
          bust: '36',
          waist: '30',
          shoulder: '14.5',
          armhole: '16',
          sleeveLength: '10.5',
          sleeveRound: '11',
          blouseLength: '14',
          frontNeck: '7',
          backNeck: '9.5'
        }
      }
    ];

    db.prepare(`
      INSERT INTO orders (
        id, user_id, type, customer_name, customer_phone, customer_email, customer_address,
        items_json, total_amount, payment_method, payment_status, stage,
        target_date, internal_notes, customer_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      order1Id,
      demoUserId,
      'online',
      'Kavitha Ramachandran',
      '+91 94432 18900',
      'kavitha.r@gmail.com',
      'Plot 12, Sri Nagar 2nd Street, Anna Nagar, Chennai, Tamil Nadu - 600040',
      JSON.stringify(order1Items),
      4250,
      'online_upi',
      'paid',
      'aari_work', // Stage 7
      '2026-09-28',
      'Bride wedding muhurtham on Oct 2nd. Priority embroidery finishing required.',
      'Grand peacock Aari embroidery with rich cutwork on sleeve borders.',
      new Date(now.getTime() - 4 * 86400000).toISOString(),
      now.toISOString()
    );

    // Append 7 completed timeline events for order 1
    const stagesToSeed = TIMELINE_STAGES.slice(0, 7);
    stagesToSeed.forEach((st, idx) => {
      const stageTime = new Date(now.getTime() - (4 - idx * 0.6) * 86400000).toISOString();
      db.prepare(`
        INSERT INTO order_status_history (
          id, order_id, stage, title_en, title_ta, description_en, description_ta, timestamp, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `hist-1-${idx}`,
        order1Id,
        st.stage,
        st.title_en,
        st.title_ta,
        st.desc_en,
        st.desc_ta,
        stageTime,
        'Master Karigar - Atchu Studio'
      );
    });

    // Seed second completed order
    const order2Id = 'BL-2026-000098';
    const order2Items = [
      {
        productName_en: 'Temple Arch Kundan Aari Silk Blouse',
        productName_ta: 'கோவில் வளைவு குந்தன் ஆரி பட்டு பிளவுஸ்',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
        unitPrice: 3800,
        quantity: 1,
        customization: {
          neck: 'Sweetheart Neckline',
          sleeve: 'Short Puff Sleeve',
          back: 'Deep V with Pearl String',
          aari: 'Kundan Stone & Thread Motif',
          addons: ['Extra Lining Cotton']
        }
      }
    ];

    db.prepare(`
      INSERT INTO orders (
        id, user_id, type, customer_name, customer_phone, customer_email, customer_address,
        items_json, total_amount, payment_method, payment_status, stage,
        target_date, internal_notes, customer_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      order2Id,
      demoUserId,
      'online',
      'Kavitha Ramachandran',
      '+91 94432 18900',
      'kavitha.r@gmail.com',
      'Plot 12, Sri Nagar 2nd Street, Anna Nagar, Chennai, Tamil Nadu - 600040',
      JSON.stringify(order2Items),
      3800,
      'online_upi',
      'paid',
      'completed',
      '2026-08-30',
      'Delivered and customer confirmed perfect fit.',
      'Traditional kundan work for family engagement function.',
      new Date(now.getTime() - 25 * 86400000).toISOString(),
      new Date(now.getTime() - 10 * 86400000).toISOString()
    );

    // Seed custom quote request
    db.prepare(`
      INSERT INTO custom_requests (
        id, user_id, customer_name, customer_phone, customer_email,
        design_category, work_type, fabric_source, requirements, quote_amount, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'QUO-2026-4412',
      demoUserId,
      'Kavitha Ramachandran',
      '+91 94432 18900',
      'kavitha.r@gmail.com',
      'Bridal Reception Saree Blouse',
      'Heavy Zardosi + Antique Gold Pearl Work',
      'Boutique Provides Raw Silk',
      'Need peacock motifs on sleeve with kundan stones for wedding silk saree.',
      5500,
      'quote_prepared',
      new Date(now.getTime() - 2 * 86400000).toISOString(),
      now.toISOString()
    );
  }
}

// Execute initial seed on import
initSeedData();
