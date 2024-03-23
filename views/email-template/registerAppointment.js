function registerAnAppointmentTemplate(title, date, time, zoomLink) {
  // Convert Toronto time (EDT, UTC-4) to UTC for the date and time provided
  // Note: This example assumes EDT. Adjust accordingly if EST is applicable.
  const torontoOffset = -4; // EDT is UTC-4
  let appointmentDateUTC = new Date(`${date}T${time}:00.000Z`);
  appointmentDateUTC.setHours(appointmentDateUTC.getHours() - torontoOffset);

  // Format start time for Google Calendar in UTC
  const startTime =
    appointmentDateUTC
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")
      .slice(0, -1) + "Z";

  // Calculate end time (+15 minutes for the consultation)
  appointmentDateUTC.setMinutes(appointmentDateUTC.getMinutes() + 15);
  const endTime =
    appointmentDateUTC
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")
      .slice(0, -1) + "Z";

  const details = `Join the meeting: ${zoomLink}`;
  const location = "Zoom Meeting";

  // Construct the Google Calendar link with UTC times
  const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}`;

  return (
    '<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">' +
    '<h2 style="color: #333;">Appointment Confirmation</h2>' +
    `<p>Your appointment for <strong>${title}</strong> is confirmed.</p>` +
    `<p>Date: <strong>${date}</strong><br/>` +
    `Time: <strong>${time} (Toronto time)</strong></p>` +
    `<p>Join the meeting by clicking the link below:</p>` +
    `<a href="${zoomLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; margin: 10px 0; border-radius: 5px; text-decoration: none;">Join Meeting</a>` +
    `<p><a href="${googleCalendarLink}" style="display: inline-block; background-color: #fbbc05; color: #ffffff; padding: 10px 20px; margin: 10px 0; border-radius: 5px; text-decoration: none;">Add to Google Calendar</a></p>` +
    '<p>If you have any questions or need assistance, feel free to <a href="mailto:info@fanavaran.ca" style="color: #007bff; text-decoration: none;">contact us</a>.</p>' +
    "<p>We look forward to seeing you.</p>" +
    "</div>"
  );
}

module.exports = {
  registerAnAppointmentTemplate,
};
