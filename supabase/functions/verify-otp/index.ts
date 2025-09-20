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
    const { email, otp }: VerifyOTPRequest = await req.json();

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
      .select('otp_code, otp_expires_at')
      .eq('email', email)
      .single();

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      throw new Error('OTP not found or expired');
    }

    if (!otpData) {
      throw new Error('No OTP found for this email');
    }

    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(otpData.otp_expires_at);
    
    if (now > expiresAt) {
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Verify OTP
    if (otpData.otp_code !== otp) {
      throw new Error('Invalid OTP code');
    }

    // Mark email as verified
    const { error: updateError } = await supabase
      .from('partner_signup_requests')
      .update({ 
        email_verified: true,
        otp_code: null, // Clear the OTP
        otp_expires_at: null
      })
      .eq('email', email);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to verify OTP');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully',
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