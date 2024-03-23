function thanksRegistrationEmailTemplate() {
    return (
        '<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">' +
            '<h2 style="color: #333;">Thank You for Registering!</h2>' +
            '<p>Your registration is complete. You can now log in to your account using the button below.</p>' +
            '<a href="https://fanavaran.ca/login" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; margin: 20px 0; border-radius: 5px; text-decoration: none;">Log In</a>' +
            '<p>If you have any questions or need assistance, feel free to <a href="mailto:info@fanavaran.ca" style="color: #007bff; text-decoration: none;">contact us</a>.</p>' +
            '<p>Thank you for choosing fanavaran.</p>' +
        '</div>'
    );
}

module.exports = {
    thanksRegistrationEmailTemplate,
};

