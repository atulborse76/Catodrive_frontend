// app/auth/google/callback/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_OAUTH_BASE_URL}/accounts/google/login/callback`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/google/callback`,
          state
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokenData = await tokenResponse.json();

    // Return HTML that communicates with the opener window
    return new NextResponse(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'AUTH_SUCCESS',
              token: '${tokenData.access_token}',
              user_id: '${tokenData.user_id}',
              user: ${JSON.stringify(tokenData.user)},
              state: '${state}'
            }, window.opener.location.origin);
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (err) {
    console.error('Google callback error:', err);
    return new NextResponse(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'AUTH_ERROR',
              message: '${err.message || 'Google authentication failed'}'
            }, window.opener.location.origin);
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}