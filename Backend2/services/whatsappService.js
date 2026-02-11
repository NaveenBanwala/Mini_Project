require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async (to, message) => {
    try {
        // --- DEBUGGING LOGS ---
        // console.log("--- WhatsApp Debug Start ---");
        // console.log("Raw Recipient Number:", to);
        // console.log("Twilio Env Number:", process.env.TWILIO_WHATSAPP_NUMBER);

        // Ensure the sender number doesn't have a double 'whatsapp:' prefix
        let fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
        if (fromNumber.startsWith('whatsapp:')) {
            fromNumber = fromNumber.replace('whatsapp:', '');
        }

        const formattedTo = to.startsWith('+') ? to : `+91${to}`;
        const finalFrom = `whatsapp:${fromNumber}`;
        const finalTo = `whatsapp:${formattedTo}`;

        // console.log("Final From String:", finalFrom);
        // console.log("Final To String:", finalTo);
        // console.log("----------------------------");

        const response = await client.messages.create({
            from: finalFrom, 
            to: finalTo,
            body: message
        });

        // console.log("Message Sent Successfully! SID:", response.sid);
        return { success: true };

    } catch (error) {
        // // Log the full error to see Twilio's specific error codes (e.g., 21606)
        // console.error(`WhatsApp failed for ${to}:`);
        // console.error("- Error Message:", error.message);
        // console.error("- Error Code:", error.code);
        return { success: false, error: error.message };
    }
};

module.exports = { sendWhatsAppMessage };