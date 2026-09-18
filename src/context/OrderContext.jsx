import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const ORDER_STAGES = [
  { id: 'order_placed', order: 1 },
  { id: 'payment_confirmed', order: 2 },
  { id: 'measurement_verified', order: 3 },
  { id: 'stitching_started', order: 4 },
  { id: 'aari_work', order: 5 },
  { id: 'finishing', order: 6 },
  { id: 'quality_check', order: 7 },
  { id: 'ready', order: 8 },
  { id: 'shipped', order: 9 },
  { id: 'delivered', order: 10 }
];

const SEED_ORDERS = [
  {
    id: 'ATCHU-2026-7891',
    type: 'online',
    customer: {
      name: 'Kavitha Ramachandran',
      phone: '+91 94432 18900',
      email: 'kavitha.r@gmail.com',
      address: 'Plot 12, Sri Nagar 2nd Street, Anna Nagar, Chennai, Tamil Nadu - 600040'
    },
    items: [
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
    ],
    totalAmount: 4250,
    paymentMethod: 'online_upi',
    paymentStatus: 'paid',
    productionStatus: 'aari_work',
    createdAt: '2026-09-14T11:20:00Z',
    targetDate: '2026-09-28',
    notes: 'Bride wedding muhurtham on Oct 2nd. Priority embroidery finishing required.'
  },
  {
    id: 'ATCHU-2026-7892',
    type: 'offline_walkin',
    customer: {
      name: 'Dr. Meenakshi Sundaram',
      phone: '+91 98421 55670',
      email: 'meenakshi.s@outlook.com',
      address: 'Direct Walk-in Store Pickup (Madurai Atelier)'
    },
    items: [
      {
        productName_en: 'Temple Arch Kundan Aari Silk Blouse',
        productName_ta: 'கோவில் வளைவு குந்தன் ஆரி பட்டு பிளவுஸ்',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
        unitPrice: 3800,
        quantity: 1,
        customization: {
          neck: 'Sweetheart Neck',
          sleeve: 'Elbow Length + Heavy Aari Border',
          back: 'Deep U Back with Dori Ties',
          aari: 'Festive Medium Aari Work',
          addons: ['Pure Cotton Double Lining']
        },
        measurements: {
          unit: 'inches',
          bust: '38',
          waist: '32',
          shoulder: '15',
          armhole: '17',
          sleeveLength: '11',
          sleeveRound: '12',
          blouseLength: '14.5',
          frontNeck: '7.5',
          backNeck: '9'
        }
      }
    ],
    totalAmount: 3800,
    paidAmount: 2000,
    balanceDue: 1800,
    paymentMethod: 'cash_advance',
    paymentStatus: 'partial_paid',
    productionStatus: 'stitching_started',
    createdAt: '2026-09-16T14:45:00Z',
    targetDate: '2026-09-25',
    notes: 'Customer dropped pure Kanjivaram crimson silk saree blouse bit at store. Advance ₹2000 paid in cash.'
  },
  {
    id: 'ATCHU-2026-7893',
    type: 'online',
    customer: {
      name: 'Ananya Subbiah',
      phone: '+91 97909 33214',
      email: 'ananya.subbiah@yahoo.in',
      address: 'Flat 4B, Emerald Haven, Trichy Road, Coimbatore - 641018'
    },
    items: [
      {
        productName_en: 'Grand Annam Bird Maggam Bridal Blouse',
        productName_ta: 'கிராண்ட் அன்னப்பறவை மக்கம் மணப்பெண் பிளவுஸ்',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
        unitPrice: 5400,
        quantity: 1,
        customization: {
          neck: 'Classic Round Neck',
          sleeve: 'Full Length Sheer Aari Sleeve',
          back: 'Royal Pot Neck with Latkans',
          aari: 'Royal Muhurtham Heritage Maggam',
          addons: ['Padded Cups Fitting', 'Handmade Zari Tassels', 'Pure Cotton Double Lining']
        },
        measurements: {
          unit: 'inches',
          bust: '34',
          waist: '28',
          shoulder: '14',
          armhole: '15.5',
          sleeveLength: '19',
          sleeveRound: '9.5',
          blouseLength: '13.5',
          frontNeck: '6.5',
          backNeck: '10'
        }
      }
    ],
    totalAmount: 5400,
    paymentMethod: 'offline_upi_transfer',
    paymentStatus: 'verification_pending',
    paymentProof: {
      utr: 'UPI/428910024512',
      screenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      submittedAt: '2026-09-17T09:15:00Z'
    },
    productionStatus: 'order_placed',
    createdAt: '2026-09-17T09:10:00Z',
    targetDate: '2026-10-05',
    notes: 'Transferred via Google Pay to boutique UPI ID. Awaiting receipt verification.'
  }
];

const SEED_QUOTES = [
  {
    id: 'QUOTE-2026-101',
    customerName: 'Sangeetha Sivakumar',
    phone: '+91 99401 88290',
    email: 'sangeetha.s@gmail.com',
    eventDate: '2026-10-18',
    fabricSource: 'boutiqueProvides',
    targetBudget: '4000 - 5500',
    requirements: 'Need intricate Krishna peacock flute Aari design on deep emerald green silk with matching dori latkans.',
    referenceImages: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'quote_sent',
    createdAt: '2026-09-16T10:00:00Z',
    itemizedQuote: {
      baseStitching: 1100,
      aariWork: 3200,
      fabricRawSilk: 600,
      tassels: 350,
      discount: 250,
      total: 5000,
      estimatedDays: '10 Business Days',
      designerNotes: 'Raw silk emerald green fabric included. Master Aari artist will trace Lord Krishna flute motif with kundan stones.'
    }
  },
  {
    id: 'QUOTE-2026-102',
    customerName: 'Priya Dharshini',
    phone: '+91 98840 12345',
    email: 'priya.dh@gmail.com',
    eventDate: '2026-10-25',
    fabricSource: 'fabricOwned',
    targetBudget: '3000 - 4000',
    requirements: 'Illusion net cutwork back with pearl hangings and temple neck front for daughter engagement.',
    referenceImages: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'pending_review',
    createdAt: '2026-09-17T16:30:00Z',
    itemizedQuote: null
  }
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('atchu_orders');
      return saved ? JSON.parse(saved) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  const [quotes, setQuotes] = useState(() => {
    try {
      const saved = localStorage.getItem('atchu_quotes');
      return saved ? JSON.parse(saved) : SEED_QUOTES;
    } catch {
      return SEED_QUOTES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('atchu_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('atchu_quotes', JSON.stringify(quotes));
    } catch (e) {
      console.warn('Failed to save quotes', e);
    }
  }, [quotes]);

  // Create new customer order (Direct Order Flow A)
  const createOrder = (orderData) => {
    const orderId = `ATCHU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      productionStatus: orderData.paymentMethod === 'online_upi' ? 'payment_confirmed' : 'order_placed',
      paymentStatus: orderData.paymentMethod === 'online_upi' ? 'paid' : 'verification_pending',
      ...orderData
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Create Offline Walk-in Order (Admin Flow)
  const createOfflineOrder = (offlineData) => {
    const orderId = `ATCHU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      type: 'offline_walkin',
      createdAt: new Date().toISOString(),
      productionStatus: 'stitching_started',
      paymentStatus: Number(offlineData.paidAmount) >= Number(offlineData.totalAmount) ? 'paid' : 'partial_paid',
      ...offlineData
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Update production status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, productionStatus: newStatus } : ord))
    );
  };

  // Verify payment proof
  const verifyPayment = (orderId, isVerified) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: isVerified ? 'paid' : 'rejected',
            productionStatus: isVerified ? 'payment_confirmed' : ord.productionStatus
          };
        }
        return ord;
      })
    );
  };

  // Create custom quote inquiry (Flow B)
  const submitQuoteRequest = (quoteData) => {
    const quoteId = `QUOTE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newQuote = {
      id: quoteId,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
      itemizedQuote: null,
      ...quoteData
    };
    setQuotes((prev) => [newQuote, ...prev]);
    return newQuote;
  };

  // Admin submit quote back to customer
  const sendQuoteEstimate = (quoteId, itemized) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === quoteId ? { ...q, itemizedQuote: itemized, status: 'quote_sent' } : q
      )
    );
  };

  // Customer accepts quote and moves to official order
  const acceptQuoteAndCreateOrder = (quoteId, paymentMethod = 'online_upi') => {
    const targetQuote = quotes.find((q) => q.id === quoteId);
    if (!targetQuote || !targetQuote.itemizedQuote) return null;

    const newOrder = createOrder({
      type: 'quote_converted',
      customer: {
        name: targetQuote.customerName,
        phone: targetQuote.phone,
        email: targetQuote.email,
        address: 'Specified during quote confirmation'
      },
      items: [
        {
          productName_en: `Bespoke Custom Blouse (Quote #${quoteId})`,
          productName_ta: `விருப்ப ஆரி பிளவுஸ் (கோரிக்கை #${quoteId})`,
          image: targetQuote.referenceImages?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
          unitPrice: targetQuote.itemizedQuote.total,
          quantity: 1,
          customization: {
            details: targetQuote.requirements,
            fabric: targetQuote.fabricSource
          },
          measurements: targetQuote.measurements || { status: 'Consultation with Tailor' }
        }
      ],
      totalAmount: targetQuote.itemizedQuote.total,
      paymentMethod,
      targetDate: targetQuote.eventDate,
      notes: `Converted from custom quote ${quoteId}. ${targetQuote.itemizedQuote.designerNotes || ''}`
    });

    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'accepted' } : q))
    );

    return newOrder;
  };

  // Search orders
  const findOrder = (query) => {
    const clean = (query || '').trim().toLowerCase();
    if (!clean) return null;
    return orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        (o.customer?.phone && o.customer.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')))
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        quotes,
        createOrder,
        createOfflineOrder,
        updateOrderStatus,
        verifyPayment,
        submitQuoteRequest,
        sendQuoteEstimate,
        acceptQuoteAndCreateOrder,
        findOrder,
        ORDER_STAGES
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
