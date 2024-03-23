function forgetPassReqEmailTemplate(token, email) {
    return (
        '<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">' +
            '<h2 style="color: #333;">Reset Your Password</h2>' +
            '<p>We received a request to reset the password for your account.</p>' +
            '<p>If you did not make this request, please ignore this email. Otherwise, click the link below to reset your password.</p>' +
            `<a href="https://fanavaran.ca/reset-password/${token}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; margin: 20px 0; border-radius: 5px; text-decoration: none;">Reset Password</a>` +
            '<p>If you’re having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>' +
            `<p><a href="https://fanavaran.ca/reset-password/${token}" style="color: #007bff; text-decoration: none;">https://fanavaran.ca/reset-password/${token}</a></p>` +
            `<p>If you have any questions, feel free to <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">contact us</a>.</p>` +
            '<p>Thank you!</p>' +
        '</div>'
    );
}

module.exports = {
    forgetPassReqEmailTemplate,
};

