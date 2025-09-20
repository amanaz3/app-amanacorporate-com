import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OTPEmailRequest {
  email: string;
  otp_code: string;
  first_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp_code, first_name }: OTPEmailRequest = await req.json();

    if (!email || !otp_code || !first_name) {
      throw new Error('Missing required fields: email, otp_code, or first_name');
    }

    console.log(`Sending OTP email to ${email} with code ${otp_code}`);

    const emailResponse = await resend.emails.send({
      from: "Partner Portal <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email - Partner Application",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 20px;">Email Verification</h1>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              Hi ${first_name},
            </p>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              Thank you for applying to become a partner! Please use the verification code below to complete your application:
            </p>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 30px 0; border: 2px dashed #007bff;">
              <h2 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 8px; font-weight: bold;">
                ${otp_code}
              </h2>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              This code will expire in 10 minutes for security reasons.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this verification code, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      message: "OTP email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);