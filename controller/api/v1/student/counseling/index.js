const Counseling = require("../../../../../models").Counseling;
const Users = require("../../../../../models").Users;
const { transporter } = require("../../../../../config/mailSender");
const {
  registerAnAppointmentTemplate,
} = require("../../../../../views/email-template/registerAppointment");
const { format, parseISO } = require("date-fns");
const { Op } = require("sequelize");

const {
  registerAnAppointmentEmployeeTemplate,
} = require("../../../../../views/email-template/registerEmployeeAppointment");

const createNewCounseling = async (req, res) => {
  try {
    const { email, time, date } = req.body;
    const formattedSCTime = time.slice(0, 5);

    // Parsing the email to avoid JSON.parse if not necessary
    const parsedEmail = typeof email === "string" ? JSON.parse(email) : email;

    const user = await Users.findOne({ where: { email: parsedEmail } });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User not found!",
      });
    }
    // Check if user already booked an appointment
    const checkExistCounseling = await Counseling.findAll({
      where: { userId: user.dataValues.id },
    });

    if (checkExistCounseling.length) {
      return res.status(400).json({
        error: true,
        message: "You have already booked an appointment!",
      });
    }

    const newAppointment = await Counseling.create({
      userId: user.dataValues.id,
      date: date,
      time: formattedSCTime,
      employee: 18,
    });
    const formattedDate = format(parseISO(date), "yyyy-MM-dd");
    // If your time is stored in the format you desire, you can use it directly:
    const formattedTime = formattedSCTime;

    console.log(formattedTime, formattedDate);
    await transporter.sendMail({
      from: '"Fanavaran" <no-reply@fanavaran.ca>',
      to: parsedEmail,
      subject: "Your appointment has been registered.",
      text: "", // Optionally, you can have a plain text version of the email here.
      html: registerAnAppointmentTemplate(
        "15 minutes free consultation",
        formattedDate,
        formattedTime,
        "https://us02web.zoom.us/my/fanavaran4"
      ), // Assuming you pass the zoom link as the last parameter.
    });
    await transporter.sendMail({
      from: '"Fanavaran" <no-reply@fanavaran.ca>',
      to: parsedEmail,
      subject: "New appointment has been registered.",
      text: "", // Optionally, you can have a plain text version of the email here.
      html: registerAnAppointmentEmployeeTemplate(
        "15 minutes free consultation",
        formattedDate,
        formattedTime,
        "https://us02web.zoom.us/my/fanavaran4",
        user.dataValues.firstName + " " + user.dataValues.lastName,
        user.dataValues.email,
        user.dataValues.phone
      ), // Assuming you pass the zoom link as the last parameter.
    });
    return res.status(201).json({
      error: false,
      message: "Your appointment has been registered.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      error: error,
    });
  }
};

const getFreeTimes = async (req, res) => {
  const selectedDate = req.params.date;

  try {
    const startOfDay = `${selectedDate}T00:00:00.000Z`;
    const endOfDay = `${selectedDate}T23:59:59.999Z`;

    const appointments = await Counseling.findAll({
      where: {
        date: {
          [Op.gte]: startOfDay, // Greater than or equal to the start of the day
          [Op.lte]: endOfDay, // Less than or equal to the end of the day
        },
      },
      attributes: ["time"],
    });
    console.log(`Booked Slots:`, appointments); // Debug log

    const bookedSlots = appointments.map((appointment) => appointment.time);

    const allTimeSlots = [
      "12:00:00",
      "12:15:00",
      "12:30:00",
      "12:45:00",
      "13:00:00",
      "13:15:00",
      "13:30:00",
      "13:45:00",
      "14:00:00",
      "14:15:00",
      "14:30:00",
      "14:45:00",
      "15:00:00",
      "15:15:00",
      "15:30:00",
      "15:45:00",
      "16:00:00",
      "16:15:00",
      "16:30:00",
      "16:45:00",
    ];
    const availableSlots = allTimeSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );
    // console.log(`Available Slots:`, availableSlots); // Debug log

    res.json(availableSlots);
  } catch (error) {
    console.error("Fetching available times failed:", error);
    res.status(500).send("Error fetching available times");
  }
};
module.exports = { createNewCounseling, getFreeTimes };
