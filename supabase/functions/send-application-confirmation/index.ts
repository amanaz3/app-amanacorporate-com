import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationConfirmationRequest {
  customerName: string;
  customerEmail: string;
  companyName: string;
  applicationId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { customerName, customerEmail, companyName, applicationId }: ApplicationConfirmationRequest = await req.json();

    console.log(`Sending application confirmation to ${customerEmail} for ${customerName}`);

    const emailResponse = await resend.emails.send({
      from: "Banking Services <noreply@resend.dev>",
      to: [customerEmail],
      subject: "Bank Account Application Received - Thank You!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Application Received!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for choosing our banking services</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #495057; margin-top: 0;">Dear ${customerName},</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We have successfully received your bank account application for <strong>${companyName}</strong>. 
              Our team will review your application and get back to you within 2-3 business days.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #495057;">What happens next?</h3>
              <ol style="padding-left: 20px; line-height: 1.8;">
                <li><strong>Application Review:</strong> Our team will thoroughly review your submission</li>
                <li><strong>Document Verification:</strong> We may contact you for additional documentation</li>
                <li><strong>Bank Processing:</strong> Your application will be forwarded to the selected bank</li>
                <li><strong>Account Setup:</strong> Once approved, we'll guide you through the final setup</li>
              </ol>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #1565c0;">
                <strong>📧 Important:</strong> Please keep this email for your records. 
                ${applicationId ? `Your application reference is: <strong>${applicationId}</strong>` : ''}
              </p>
            </div>
            
            <p style="font-size: 16px; margin-top: 25px;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                Best regards,<br>
                <strong>Bank Account Services Team</strong><br>
                Email: support@bankservices.com<br>
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Application confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending application confirmation email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
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