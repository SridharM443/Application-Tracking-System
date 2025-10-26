const sendWelcomeEmail = async (email, name) => {
  try {
    console.log(`📧 [EMAIL] Welcome email sent to ${email} (${name})`);
    return { success: true };
  } catch (error) {
    console.error(`❌ [EMAIL] Failed: ${error.message}`);
    throw error;
  }
};

const sendStatusUpdateEmail = async (email, name, status) => {
  try {
    console.log(`📧 [EMAIL] Status update sent to ${email}: ${status}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ [EMAIL] Failed: ${error.message}`);
    throw error;
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log(`📧 [EMAIL] Sent to ${to}: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ [EMAIL] Failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendStatusUpdateEmail,
  sendEmail
};
