import { NextResponse } from 'next/server'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://example.com'
  
  return NextResponse.json({
    accountAssociation: {
      header: 'eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ',
      payload: 'eyJkb21haW4iOiJtdXJkby10ZW4tay52ZXJjZWwuYXBwIn0',
      signature: 'MHgwNDdmNDhmODZhZTE1MDYyOTkwNDY4OTI4YmFiMWVmZTVmOGU1ZDYzNjRlMzVmYTc5NTJhMzI5YmE2ODk5MjNhMGUyMWNkOWE1Nzk5ZTUzNmYwZjM5MzBiNGYyZDVkMDI4NjUzMWY2ODA5NTllMmIwYmEwNmU4MTU0OTdmZDQ5YTFj'
    },
    frame: {
      version: '1',
      name: 'Ten-K Cast Trending',
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: 'Open',
      webhookUrl: `${appUrl}/api/webhook`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: '#555555',
      primaryCategory: 'social',
      tags: ['farcaster', 'trending', 'posts', 'social', 'feed']
    }
  })
}
