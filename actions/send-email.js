import { Resend } from 'resend';

export async function sendEmail({ to, subject, react }) {
    const resend = new Resend(process.env.RESEND_API_KEY || "");

    try {
        const data = await resend.emails.send({
            from: "Finance App <onboarding@resend.dev>",
            to: ["vp104210@gmail.com"], // Use ONLY your verified email for testing
            subject,
            react,
        });

        console.log("Email sent successfully:", data);
        return { success: true, data };
        
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: error.message };
    }
}