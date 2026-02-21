import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)

        // Dynamic params from URL fallback to defaults
        const name = searchParams.get('name') || 'Prashant Basnet'
        const roles = searchParams.get('roles')?.split(',') || ['Full-Stack Developer', 'UI/UX Enthusiast']

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backgroundColor: '#050511',
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1a2e 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a2e 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        padding: '80px',
                        position: 'relative',
                    }}
                >
                    {/* Decorative Border */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 40,
                            left: 40,
                            right: 40,
                            bottom: 40,
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '24px',
                        }}
                    />

                    {/* Top accent */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3B82F6', marginRight: '10px' }} />
                        <span style={{ fontSize: '24px', color: '#3B82F6', fontWeight: 600, letterSpacing: '0.1em' }}>PORTFOLIO</span>
                    </div>

                    {/* Name */}
                    <h1
                        style={{
                            fontSize: '80px',
                            fontWeight: 900,
                            color: 'white',
                            margin: 0,
                            padding: 0,
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {name}
                    </h1>

                    {/* Role Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '30px' }}>
                        {roles.map((role, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '10px 24px',
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '100px',
                                    color: '#93c5fd',
                                    fontSize: '24px',
                                    fontWeight: 500,
                                }}
                            >
                                {role}
                            </div>
                        ))}
                    </div>

                    {/* Bottom Branding */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 80,
                            left: 80,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '20px' }}>prashant.dev</span>
                        <div style={{ width: 40, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', margin: '0 20px' }} />
                        <span style={{ color: '#3B82F6', fontSize: '20px', fontWeight: 600 }}>Available for Projects</span>
                    </div>

                    {/* Abstract Glow */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-10%',
                            right: '-10%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                            borderRadius: '50%',
                        }}
                    />
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
