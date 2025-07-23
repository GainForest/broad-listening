import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get parameters
    const title = searchParams.get('title') || 'Broad Listening'
    const description = searchParams.get('description') || 'Transform interview data into actionable insights with AI-powered analysis'
    const type = searchParams.get('type') || 'landing' // landing, dashboard, topic
    const stats = searchParams.get('stats') // For topic pages: "claims,people,subtopics,quotes"

    // Load the logo image
    const logoResponse = await fetch(new URL('../../../public/broadlistening-logo.png', import.meta.url))
    const logoArrayBuffer = await logoResponse.arrayBuffer()
    const logoBase64 = Buffer.from(logoArrayBuffer).toString('base64')

    // Parse stats for topic pages
    let parsedStats = null
    if (stats) {
      const [claims, people, subtopics, quotes] = stats.split(',')
      parsedStats = { claims, people, subtopics, quotes }
    }

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
            backgroundColor: '#667eea',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
          }}
        >
          {/* Subtle pattern overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10,
              maxWidth: '900px',
              textAlign: 'center',
              padding: '40px',
            }}
          >
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${logoBase64}`}
              alt="Broad Listening Logo"
              style={{
                width: '80px',
                height: '80px',
                marginBottom: '24px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '8px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            />
            
            {/* Title */}
            <h1
              style={{
                fontSize: type === 'topic' ? '48px' : '56px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                lineHeight: 1.2,
                maxWidth: '800px',
              }}
            >
              {title}
            </h1>
            
            {/* Description */}
            <p
              style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: parsedStats ? '32px' : '0',
                lineHeight: 1.4,
                maxWidth: '700px',
              }}
            >
              {description}
            </p>
            
            {/* Stats for topic pages */}
            {parsedStats && (
              <div
                style={{
                  display: 'flex',
                  gap: '32px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>
                    {parsedStats.claims}
                  </span>
                  <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Claims
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>
                    {parsedStats.people}
                  </span>
                  <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    People
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>
                    {parsedStats.subtopics}
                  </span>
                  <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Subtopics
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>
                    {parsedStats.quotes}
                  </span>
                  <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Quotes
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Brand watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
            }}
          >
            <span>Powered by DeepGov</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.log(`Failed to generate image: ${e instanceof Error ? e.message : 'Unknown error'}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
} 