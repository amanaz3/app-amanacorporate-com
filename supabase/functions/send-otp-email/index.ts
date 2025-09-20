import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { Resend } from "npm:resend@2.0.0";

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
    console.log('Starting OTP send process...');
    
    const { email, first_name }: OTPRequest = await req.json();
    console.log(`Processing OTP request for email: ${email}, name: ${first_name}`);

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
    
    console.log(`Generated OTP: ${otpCode} for ${email}`);

    // First check if a record exists for this email
    const { data: existingRecord, error: fetchError } = await supabase
      .from('partner_signup_requests')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing record:', fetchError);
    }

    if (existingRecord) {
      // Update existing record with OTP
      console.log('Updating existing record with OTP...');
      const { error: updateError } = await supabase
        .from('partner_signup_requests')
        .update({
          otp_code: otpCode,
          otp_expires_at: expiresAt.toISOString(),
          email_verified: false,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Failed to update OTP: ${updateError.message}`);
      }
    } else {
      // Create new record with minimal required fields
      console.log('Creating new record with OTP...');
      const { error: insertError } = await supabase
        .from('partner_signup_requests')
        .insert({
          email,
          first_name,
          last_name: '', // Provide default empty value
          phone_number: '', // Provide default empty value
          otp_code: otpCode,
          otp_expires_at: expiresAt.toISOString(),
          email_verified: false,
          status: 'pending'
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Failed to store OTP: ${insertError.message}`);
      }
    }

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found');
      throw new Error('Email service not configured');
    }

    const resend = new Resend(resendApiKey);
    console.log('Sending email via Resend...');

    // Send OTP email via Resend
    const emailResponse = await resend.emails.send({
      from: 'Amana Corporate <noreply@amanacorporate.com>', // Use your verified domain
      to: [email],
      subject: 'Your Partner Application Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Partner Application Verification</h1>
            <p style="color: #666; font-size: 16px;">Hello ${first_name},</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">Your Verification Code</h2>
            <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; margin: 20px 0; font-family: monospace;">
              ${otpCode}
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 15px;">
              This code will expire in 10 minutes
            </p>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Notice:</strong> If you didn't request this verification code, please ignore this email. 
              Do not share this code with anyone.
            </p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            <p>© 2025 Amana Corporate Services L.L.C. All rights reserved.</p>
            <p>Licensed Corporate Services Provider in UAE</p>
          </div>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend email error:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    console.log('Email sent successfully:', emailResponse.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        email_id: emailResponse.data?.id
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