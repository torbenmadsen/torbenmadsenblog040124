import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData();
  const accessCode = formData.get('accessCode');
  
  if (accessCode === import.meta.env.ADMIN_ACCESS_CODE) {
    // Set a cookie to maintain the session
    cookies.set('admin-access', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    
    return redirect('/admin/dashboard');
  }
  
  return redirect('/admin?error=invalid');
};
