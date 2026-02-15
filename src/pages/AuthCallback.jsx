import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase picks up the token from the URL hash automatically
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
      }

      // Redirect to admin if came from there, otherwise home
      navigate(session ? '/Admin' : '/');
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">מאמת כניסה...</h2>
        <p className="text-gray-600">אנא המתן...</p>
      </div>
    </div>
  );
}
