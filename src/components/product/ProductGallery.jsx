import React, { useState } from 'react';

export default function ProductGallery({ images = [], alt = '' }) {
  const [activeImage, setActiveImage] = useState(images[0] || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Main Image Frame */}
      <div
        style={{
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: '#F6F2EC',
          aspectRatio: '4/5',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative'
        }}
      >
        <img
          src={activeImage || images[0]}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: activeImage === img ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                opacity: activeImage === img ? 1 : 0.7,
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <img
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
