function getRegistrationEmailTemplate(email, token, NewDate) {
    return (
        '<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">' +
            '<h2 style="color: #333;">Thank You for Registering!</h2>' +
            '<p>We’re excited to have you on board. To complete your registration process, please verify your email address.</p>' +
            `<a href="https://fanavaran.ca/register/verification/${token}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; margin: 20px 0; border-radius: 5px; text-decoration: none;">Verify Email</a>` +
            '<p>If you’re having trouble clicking the "Verify Email" button, copy and paste the URL below into your web browser:</p>' +
            `<p><a href="https://fanavaran.ca/register/verification/${token}" style="color: #007bff; text-decoration: none;">https://fanavaran.ca/register/verification/${token}</a></p>` +
            `<p>If you have any questions, feel free to <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">contact us</a>.</p>` +
            `<p>Thank you for choosing us!</p>` +
            `<p><small style="font-size: 12px;">&copy; ${NewDate} fanavaran. All rights reserved.</small></p>` +
        '</div>'
    );
}

module.exports = {
    getRegistrationEmailTemplate,
};

