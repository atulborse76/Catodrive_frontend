import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 1. Validate parameters
    const token = searchParams.get('token');
    const userData = searchParams.get('user');
    const customerId = searchParams.get('customer_id');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // 2. Verify state token
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      throw new Error('Invalid state token');
    }

    // 3. Handle errors from backend
    if (error) {
      return new Response(`
        <script>
          window.opener.postMessage({
            type: 'oauth-error',
            message: '${error}'
          }, '${process.env.NEXT_PUBLIC_BASE_URL}');
          window.close();
        </script>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // 4. Validate required data
    if (!token || !userData || !customerId) {
      throw new Error('Missing authentication data');
    }

    // 5. Send success message to opener
    return new Response(`
      <!DOCTYPE html>
      <script>
        window.opener.postMessage({
          type: 'oauth-success',
          token: '${token}',
          user: ${userData},
          customerId: '${customerId}'
        }, '${process.env.NEXT_PUBLIC_BASE_URL}');
        window.close();
      </script>
    `, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    return new Response(`
      <script>
        window.opener.postMessage({
          type: 'oauth-error',
          message: '${error.message}'
        }, '${process.env.NEXT_PUBLIC_BASE_URL}');
        window.close();
      </script>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}