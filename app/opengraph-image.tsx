import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SparkMade - AI-Powered Product Creation & Crowdfunding';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            left: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            zIndex: 10,
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              marginBottom: 40,
            }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M43.75 18.75L31.25 43.75H40L36.25 61.25L48.75 36.25H40L43.75 18.75Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            SparkMade
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: '#a0a0a0',
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            AI-Powered Product Design & Smart Crowdfunding
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: 40,
              marginTop: 50,
              fontSize: 20,
              color: '#6366f1',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>✨</span>
              <span>AI Design</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🎨</span>
              <span>Image Generation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🚀</span>
              <span>Pre-Orders</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
