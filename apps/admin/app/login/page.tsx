'use client';

import { useState } from 'react';
// Remove the old @supabase/supabase-js import and use the new SSR client
import { createClient } from '../../utils/supabase/client';

export default function ProfessionalLogin() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Initialize the SSR client
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setStatus(error ? 'idle' : 'sent');
  };

  return }
    // ... Keep your existing JSX return UI exactly the same