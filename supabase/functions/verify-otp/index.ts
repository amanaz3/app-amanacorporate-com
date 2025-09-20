import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting OTP verification process...');
    
    const { email, otp }: VerifyOTPRequest = await req.json();
    console.log(`Verifying OTP for email: ${email}`);

    if (!email || !otp) {
      throw new Error('Email and OTP are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the stored OTP
    const { data: otpData, error: fetchError } = await supabase
      .from('partner_signup_requests')
      .select('otp_code, otp_expires_at, email_verified')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      throw new Error('Failed to retrieve OTP data');
    }

    if (!otpData) {
      console.log('No OTP record found for email:', email);
      throw new Error('No OTP found for this email. Please request a new verification code.');
    }

    if (!otpData.otp_code) {
      console.log('No OTP code stored for email:', email);
      throw new Error('No verification code found. Please request a new one.');
    }

    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(otpData.otp_expires_at);
    
    if (now > expiresAt) {
      console.log(`OTP expired for ${email}. Expires: ${expiresAt}, Now: ${now}`);
      throw new Error('Verification code has expired. Please request a new one.');
    }

    // Verify OTP
    if (otpData.otp_code !== otp) {
      console.log(`OTP mismatch for ${email}. Expected: ${otpData.otp_code}, Received: ${otp}`);
      throw new Error('Invalid verification code. Please check the code and try again.');
    }

    // Mark email as verified and clear OTP
    console.log('OTP verified successfully, updating record...');
    const { error: updateError } = await supabase
      .from('partner_signup_requests')
      .update({ 
        email_verified: true,
        otp_code: null, // Clear the OTP for security
        otp_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to verify OTP');
    }

    console.log('Email verification completed successfully for:', email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email verified successfully',
        verified: true
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false,
        verified: false
      }),
      {
        status: 400,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);