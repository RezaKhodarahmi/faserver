function enrollWebinarEmailTemplate(webinarName, webinarDate, webinarTime, zoomLink) {

    return (
        '<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">' +
            '<h2 style="color: #333;">Thank You for Registering!</h2>' +
            `<p>You have successfully registered for <strong>${webinarName}</strong>.</p>` +
            `<p>Date: <strong>${webinarDate}</strong><br/>` +
            `Time: <strong>${webinarTime}</strong></p>` +
            `<p>Join the webinar by clicking the link below:</p>` +
            `<a href="${zoomLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; margin: 10px 0; border-radius: 5px; text-decoration: none;">Join Webinar</a>` +
            '<p>If you have any questions or need assistance, feel free to <a href="mailto:info@fanavaran.ca" style="color: #007bff; text-decoration: none;">contact us</a>.</p>' +
            '<p>Thank you for choosing Fanavaran.</p>' +
        '</div>'
    );
}

module.exports = {
    enrollWebinarEmailTemplate,
};

