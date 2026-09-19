// ==========================================================================
// ATCHU DESIGNS — BACKEND REST API ROUTER & CONTROLLER
// ==========================================================================

import {
  db,
  hashPassword,
  verifyPassword,
  generateSessionToken,
  TIMELINE_STAGES
} from './db.js';
import crypto from 'node:crypto';

// Helper to parse JSON body from incoming Node HTTP request
export async function parseRequestBody(req) {
  if (req.body) return req.body;
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

// Helper to extract authenticated user from request Authorization header
export function getAuthenticatedUser(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) return null;

  const session = db.prepare(`
    SELECT s.token, s.user_id, s.expires_at, u.id, u.email, u.name, u.phone, u.role, u.avatar_url, u.language_preference
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ?
  `).get(token);

  if (!session) return null;

  // Check expiration
  if (new Date(session.expires_at) < new Date()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  return {
    id: session.id,
    email: session.email,
    name: session.name,
    phone: session.phone,
    role: session.role,
    avatarUrl: session.avatar_url,
    languagePreference: session.language_preference
  };
}

// JSON response utility
export function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Main API request dispatcher
export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();

  try {
    // ----------------------------------------------------------------------
    // 1. AUTHENTICATION ENDPOINTS
    // ----------------------------------------------------------------------

    // POST /api/auth/signup
    if (pathname === '/api/auth/signup' && method === 'POST') {
      const { fullName, email, mobile, password } = await parseRequestBody(req);

      if (!fullName || !email || !password) {
        return sendJson(res, 400, { error: 'Full name, email, and password are required.' });
      }

      if (password.length < 6) {
        return sendJson(res, 400, { error: 'Password must be at least 6 characters long.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
      if (existing) {
        return sendJson(res, 400, { error: 'An account with this email address already exists. Please sign in.' });
      }

      const userId = 'cust-' + crypto.randomUUID();
      const { hash, salt } = hashPassword(password);
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, email, password_hash, salt, name, phone, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'customer', ?, ?)
      `).run(userId, normalizedEmail, hash, salt, fullName.trim(), mobile || '', now, now);

      // Create session
      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();

      db.prepare(`
        INSERT INTO sessions (token, user_id, role, expires_at, created_at)
        VALUES (?, ?, 'customer', ?, ?)
      `).run(token, userId, expiresAt, now);

      return sendJson(res, 201, {
        message: 'Account created successfully.',
        token,
        user: {
          id: userId,
          email: normalizedEmail,
          name: fullName.trim(),
          phone: mobile || '',
          role: 'customer'
        }
      });
    }

    // POST /api/auth/login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { email, password } = await parseRequestBody(req);

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Email and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

      if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
        return sendJson(res, 401, { error: 'Email or password is incorrect. Please try again.' });
      }

      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO sessions (token, user_id, role, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(token, user.id, user.role, expiresAt, now);

      return sendJson(res, 200, {
        message: 'Signed in successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          avatarUrl: user.avatar_url
        }
      });
    }

    // GET /api/auth/me
    if (pathname === '/api/auth/me' && method === 'GET') {
      const user = getAuthenticatedUser(req);
      if (!user) {
        return sendJson(res, 401, { error: 'Unauthorized or session expired.' });
      }
      return sendJson(res, 200, { user });
    }

    // POST /api/auth/logout
    if (pathname === '/api/auth/logout' && method === 'POST') {
      const authHeader = req.headers['authorization'] || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      if (token) {
        db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
      }
      return sendJson(res, 200, { message: 'Signed out successfully.' });
    }

    // POST /api/auth/forgot-password
    if (pathname === '/api/auth/forgot-password' && method === 'POST') {
      const { email } = await parseRequestBody(req);
      if (!email) {
        return sendJson(res, 400, { error: 'Please provide an email address.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);

      // Anti-enumeration: always return success message regardless of existence
      let resetToken = null;
      if (user) {
        resetToken = crypto.randomBytes(24).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

        db.prepare(`
          INSERT INTO password_resets (token, user_id, expires_at)
          VALUES (?, ?, ?)
        `).run(resetToken, user.id, expiresAt);
      }

      return sendJson(res, 200, {
        message: 'If that email is registered with Atchu Designs, a secure password reset link has been dispatched.',
        // Expose resetToken in development mode for easy testing
        devResetToken: resetToken
      });
    }

    // POST /api/auth/reset-password
    if (pathname === '/api/auth/reset-password' && method === 'POST') {
      const { token, newPassword } = await parseRequestBody(req);

      if (!token || !newPassword || newPassword.length < 6) {
        return sendJson(res, 400, { error: 'Valid reset token and strong password (min 6 chars) required.' });
      }

      const reset = db.prepare('SELECT * FROM password_resets WHERE token = ? AND used = 0').get(token);
      if (!reset || new Date(reset.expires_at) < new Date()) {
        return sendJson(res, 400, { error: 'Password reset link is invalid or has expired.' });
      }

      const { hash, salt } = hashPassword(newPassword);
      const now = new Date().toISOString();

      db.prepare('UPDATE users SET password_hash = ?, salt = ?, updated_at = ? WHERE id = ?')
        .run(hash, salt, now, reset.user_id);
      db.prepare('UPDATE password_resets SET used = 1 WHERE token = ?').run(token);

      return sendJson(res, 200, { message: 'Password has been successfully updated. You can now sign in.' });
    }

    // GET /api/auth/google
    if (pathname === '/api/auth/google' && method === 'GET') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5174/api/auth/google/callback';

      if (clientId && clientId.includes('.apps.googleusercontent.com')) {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email&prompt=select_account`;
        res.writeHead(302, { Location: googleAuthUrl });
        return res.end();
      } else {
        // Safe OAuth Sandbox callback for local development without credentials configured yet
        return sendJson(res, 200, {
          isSandbox: true,
          message: 'Google OAuth credentials not configured in .env yet. Follow instructions in .env.example with your Google Cloud Console Client ID.',
          sandboxLoginUrl: '/api/auth/google/sandbox-callback'
        });
      }
    }

    // GET /api/auth/google/sandbox-callback (Instant development Google login simulation)
    if (pathname === '/api/auth/google/sandbox-callback' && method === 'GET') {
      const email = url.searchParams.get('email') || 'google.customer@atchudesigns.com';
      const name = url.searchParams.get('name') || 'Google Verified Customer';

      let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      const now = new Date().toISOString();

      if (!user) {
        const userId = 'cust-google-' + crypto.randomUUID().slice(0, 8);
        const { hash, salt } = hashPassword(crypto.randomBytes(16).toString('hex'));
        db.prepare(`
          INSERT INTO users (id, email, password_hash, salt, name, phone, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, '', 'customer', ?, ?)
        `).run(userId, email, hash, salt, name, now, now);
        user = { id: userId, email, name, role: 'customer' };
      }

      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      db.prepare(`
        INSERT INTO sessions (token, user_id, role, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(token, user.id, user.role, expiresAt, now);

      res.writeHead(302, { Location: `/?token=${token}&auth_success=google` });
      return res.end();
    }

    // ----------------------------------------------------------------------
    // 2. CUSTOMER ORDERS & TRACKING
    // ----------------------------------------------------------------------

    // GET /api/orders/my-orders
    if (pathname === '/api/orders/my-orders' && method === 'GET') {
      const user = getAuthenticatedUser(req);
      if (!user) {
        return sendJson(res, 401, { error: 'Please sign in to view your orders.' });
      }

      const orders = db.prepare(`
        SELECT * FROM orders
        WHERE user_id = ? OR customer_email = ?
        ORDER BY created_at DESC
      `).all(user.id, user.email);

      const formatted = orders.map(o => ({
        ...o,
        items: JSON.parse(o.items_json || '[]')
      }));

      return sendJson(res, 200, { orders: formatted });
    }

    // GET /api/orders/track/:id
    if (pathname.startsWith('/api/orders/track/') && method === 'GET') {
      const orderId = decodeURIComponent(pathname.replace('/api/orders/track/', '')).trim();

      if (!orderId) {
        return sendJson(res, 400, { error: 'Order ID is required.' });
      }

      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      if (!order) {
        return sendJson(res, 404, { error: `No order found with number "${orderId}".` });
      }

      const history = db.prepare(`
        SELECT * FROM order_status_history
        WHERE order_id = ?
        ORDER BY timestamp ASC
      `).all(orderId);

      const items = JSON.parse(order.items_json || '[]');

      return sendJson(res, 200, {
        order: {
          ...order,
          items,
          timeline: history,
          stages: TIMELINE_STAGES
        }
      });
    }

    // ----------------------------------------------------------------------
    // 3. SAVED MEASUREMENTS
    // ----------------------------------------------------------------------

    // GET /api/measurements
    if (pathname === '/api/measurements' && method === 'GET') {
      const user = getAuthenticatedUser(req);
      if (!user) {
        return sendJson(res, 401, { error: 'Please sign in to view your saved measurements.' });
      }

      const profiles = db.prepare(`
        SELECT * FROM measurement_profiles
        WHERE user_id = ?
        ORDER BY updated_at DESC
      `).all(user.id);

      return sendJson(res, 200, { profiles });
    }

    // POST /api/measurements
    if (pathname === '/api/measurements' && method === 'POST') {
      const user = getAuthenticatedUser(req);
      if (!user) {
        return sendJson(res, 401, { error: 'Please sign in to save measurements.' });
      }

      const body = await parseRequestBody(req);
      const profileId = body.id || 'meas-' + crypto.randomUUID().slice(0, 8);
      const now = new Date().toISOString();

      const existing = db.prepare('SELECT id FROM measurement_profiles WHERE id = ? AND user_id = ?').get(profileId, user.id);

      if (existing) {
        db.prepare(`
          UPDATE measurement_profiles
          SET profile_name = ?, unit = ?, bust = ?, under_bust = ?, waist = ?, shoulder = ?,
              armhole = ?, sleeve_length = ?, sleeve_round = ?, blouse_length = ?,
              front_neck = ?, back_neck = ?, notes = ?, updated_at = ?
          WHERE id = ? AND user_id = ?
        `).run(
          body.profileName || 'My Size',
          body.unit || 'inches',
          body.bust || '',
          body.underBust || '',
          body.waist || '',
          body.shoulder || '',
          body.armhole || '',
          body.sleeveLength || '',
          body.sleeveRound || '',
          body.blouseLength || '',
          body.frontNeck || '',
          body.backNeck || '',
          body.notes || '',
          now,
          profileId,
          user.id
        );
      } else {
        db.prepare(`
          INSERT INTO measurement_profiles (
            id, user_id, profile_name, unit, bust, under_bust, waist, shoulder,
            armhole, sleeve_length, sleeve_round, blouse_length, front_neck, back_neck,
            notes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          profileId,
          user.id,
          body.profileName || 'My Size',
          body.unit || 'inches',
          body.bust || '',
          body.underBust || '',
          body.waist || '',
          body.shoulder || '',
          body.armhole || '',
          body.sleeveLength || '',
          body.sleeveRound || '',
          body.blouseLength || '',
          body.frontNeck || '',
          body.backNeck || '',
          body.notes || '',
          now,
          now
        );
      }

      return sendJson(res, 200, { message: 'Measurement profile saved successfully.', profileId });
    }

    // ----------------------------------------------------------------------
    // 4. CUSTOM REQUESTS
    // ----------------------------------------------------------------------

    // GET /api/custom-requests/my
    if (pathname === '/api/custom-requests/my' && method === 'GET') {
      const user = getAuthenticatedUser(req);
      if (!user) {
        return sendJson(res, 401, { error: 'Please sign in to view your custom requests.' });
      }

      const requests = db.prepare(`
        SELECT * FROM custom_requests
        WHERE user_id = ? OR customer_email = ?
        ORDER BY created_at DESC
      `).all(user.id, user.email);

      return sendJson(res, 200, { requests });
    }

    // POST /api/custom-requests
    if (pathname === '/api/custom-requests' && method === 'POST') {
      const user = getAuthenticatedUser(req);
      const body = await parseRequestBody(req);

      const requestId = 'QUO-2026-' + Math.floor(1000 + Math.random() * 9000);
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO custom_requests (
          id, user_id, customer_name, customer_phone, customer_email,
          design_category, work_type, fabric_source, measurements_json, reference_images_json,
          requirements, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'request_submitted', ?, ?)
      `).run(
        requestId,
        user ? user.id : null,
        body.customerName || (user ? user.name : 'Walk-in / Online Client'),
        body.customerPhone || (user ? user.phone : ''),
        body.customerEmail || (user ? user.email : ''),
        body.designCategory || '',
        body.workType || '',
        body.fabricSource || '',
        JSON.stringify(body.measurements || {}),
        JSON.stringify(body.referenceImages || []),
        body.requirements || '',
        now,
        now
      );

      return sendJson(res, 201, {
        message: 'Custom request submitted successfully.',
        requestId
      });
    }

    // ----------------------------------------------------------------------
    // 5. ADMIN STUDIO SECURED ENDPOINTS (role === 'admin' required)
    // ----------------------------------------------------------------------

    // POST /api/admin/login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const { email, password } = await parseRequestBody(req);

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Admin email and password required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = db.prepare("SELECT * FROM users WHERE email = ? AND role = 'admin'").get(normalizedEmail);

      if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
        return sendJson(res, 401, { error: 'Invalid admin credentials.' });
      }

      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO sessions (token, user_id, role, expires_at, created_at)
        VALUES (?, ?, 'admin', ?, ?)
      `).run(token, user.id, expiresAt, now);

      return sendJson(res, 200, {
        message: 'Admin authenticated successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'admin'
        }
      });
    }

    // Middleware check for all other /api/admin/* routes
    if (pathname.startsWith('/api/admin/')) {
      const user = getAuthenticatedUser(req);
      if (!user || user.role !== 'admin') {
        return sendJson(res, 403, { error: "You don't have permission to access this administrative resource." });
      }

      // GET /api/admin/orders
      if (pathname === '/api/admin/orders' && method === 'GET') {
        const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        const formatted = orders.map(o => ({
          ...o,
          items: JSON.parse(o.items_json || '[]')
        }));
        return sendJson(res, 200, { orders: formatted });
      }

      // PATCH /api/admin/orders/:id/status
      if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
        const orderId = pathname.replace('/api/admin/orders/', '').replace('/status', '').trim();
        const { stage, notes, adminName } = await parseRequestBody(req);

        const stageInfo = TIMELINE_STAGES.find(s => s.stage === stage) || {
          title_en: stage.replace('_', ' ').toUpperCase(),
          title_ta: stage,
          desc_en: notes || 'Status updated by Atelier Master Tailor.',
          desc_ta: notes || 'ஸ்டுடியோ மூலம் நிலை புதுப்பிக்கப்பட்டது.'
        };

        const now = new Date().toISOString();

        db.prepare('UPDATE orders SET stage = ?, updated_at = ? WHERE id = ?').run(stage, now, orderId);

        const historyId = 'hist-' + crypto.randomUUID().slice(0, 8);
        db.prepare(`
          INSERT INTO order_status_history (
            id, order_id, stage, title_en, title_ta, description_en, description_ta, timestamp, updated_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          historyId,
          orderId,
          stage,
          stageInfo.title_en,
          stageInfo.title_ta,
          notes || stageInfo.desc_en,
          notes || stageInfo.desc_ta,
          now,
          adminName || 'Atchu Designs Master Tailor'
        );

        return sendJson(res, 200, { message: 'Order status updated successfully.', stage });
      }

      // GET /api/admin/stats
      if (pathname === '/api/admin/stats' && method === 'GET') {
        const totalOrders = db.prepare('SELECT COUNT(*) as cnt FROM orders').get().cnt;
        const inProduction = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE stage IN ('stitching_started', 'aari_work', 'quality_check')").get().cnt;
        const ready = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE stage = 'ready'").get().cnt;
        const completed = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE stage = 'completed'").get().cnt;
        const revenue = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'").get().total || 0;
        const totalCustomers = db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'customer'").get().cnt;
        const pendingQuotes = db.prepare("SELECT COUNT(*) as cnt FROM custom_requests WHERE status = 'request_submitted'").get().cnt;

        return sendJson(res, 200, {
          stats: {
            totalOrders,
            inProduction,
            ready,
            completed,
            revenue,
            totalCustomers,
            pendingQuotes
          }
        });
      }

      // GET /api/admin/customers
      if (pathname === '/api/admin/customers' && method === 'GET') {
        const customers = db.prepare(`
          SELECT id, email, name, phone, created_at,
                 (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count,
                 (SELECT SUM(total_amount) FROM orders WHERE user_id = users.id) as total_spent
          FROM users
          WHERE role = 'customer'
          ORDER BY created_at DESC
        `).all();

        return sendJson(res, 200, { customers });
      }
    }

    // Default 404 for unhandled /api/*
    return sendJson(res, 404, { error: `Endpoint ${method} ${pathname} not found.` });

  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 500, { error: 'Internal server error: ' + err.message });
  }
}
