export async function POST(request) {
  try {
    const { password } = await request.json();

    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;

    console.log('=== PASSWORD VERIFICATION ===');
    console.log('Expected password:', correctPassword);
    console.log('Received password:', password);
    console.log('Match:', password === correctPassword);
    console.log('=============================');

    if (!correctPassword) {
      return Response.json(
        { error: 'Password not configured' },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      return Response.json({ success: true });
    } else {
      return Response.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
