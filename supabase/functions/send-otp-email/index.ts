import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  email: string;
  first_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name }: OTPRequest = await req.json();

    if (!email || !first_name) {
      throw new Error('Email and first name are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database (you might want to create a separate OTP table)
    const { error: updateError } = await supabase
      .from('partner_signup_requests')
      .upsert({
        email,
        first_name,
        otp_code: otpCode,
        otp_expires_at: expiresAt.toISOString(),
        email_verified: false
      }, {
        onConflict: 'email'
      });

    if (updateError) {
      console.error('Database error:', updateError);
      throw new Error('Failed to store OTP');
    }

    // In a real implementation, you would send an email here
    // For now, we'll log it and return success
    console.log(`OTP for ${email}: ${otpCode} (expires at ${expiresAt})`);

    // You would typically use a service like Resend, SendGrid, or AWS SES here
    // Example with Resend:
    /*
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Partner Application <noreply@yourdomain.com>',
          to: [email],
          subject: 'Your Partner Application Verification Code',
          html: `
            <h2>Partner Application Verification</h2>
            <p>Hello ${first_name},</p>
            <p>Your verification code is: <strong>${otpCode}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // In development, you might want to include the OTP for testing
        ...(Deno.env.get('ENVIRONMENT') === 'development' && { otp: otpCode })
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
    console.error("Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);