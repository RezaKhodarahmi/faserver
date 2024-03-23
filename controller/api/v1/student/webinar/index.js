const Webinars = require("../../../../../models").Webinars;
const Users = require("../../../../../models").Users;
const UserWebinars = require("../../../../../models").UserWebinars;
const { transporter } = require("../../../../../config/mailSender");
const {
  enrollWebinarEmailTemplate,
} = require("../../../../../views/email-template/enrollWebinar");

const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinars.findAll({ where: { status: 1 } });
    return res.status(200).json({
      error: false,
      data: webinars,
    });
  } catch (error) {
    return res.status(500).send("Server Error!");
  }
};

const getSingleWebinar = async (req, res) => {
  try {
    const { slug, email } = req.body;
    const webinar = await Webinars.findAll({
      where: { slug, status: 1 },
    });

    var user = null;

    if (email !== null) {
      user = await Users.findOne({ where: { email } });
    }

    if (!webinar) {
      return res.status(200).json({
        error: true,
        message: "Webinar not found!",
      });
    }

    if (user && webinar) {
      const existedEnroll = await UserWebinars.findOne({
        where: {
          userId: user.dataValues.id,
          webinarId: webinar[0].dataValues.id,
        },
      });

      if (existedEnroll) {
        return res.status(200).json({
          error: false,
          data: webinar,
          enrolled: true,
        });
      }
    }
    return res.status(200).json({
      error: false,
      data: webinar,
      enrolled: false,
    });
  } catch (error) {
    return res.status(500).send("Server Error!");
  }
};

const enrollUser = async (req, res) => {
  try {
    const { email, id } = req.body;

    const webinar = await Webinars.findOne({ where: { id } });
    const user = await Users.findOne({ where: { email } });
    if (!webinar || !user) {
      return res.status(400).json({
        error: true,
        message: "Webinar or user not found.",
      });
    }

    const existedEnroll = await UserWebinars.findOne({
      where: { userId: user.id, webinarId: webinar.id },
    });

    if (existedEnroll) {
      return res.status(400).json({
        error: true,
        message: "You have already registered for this webinar.",
      });
    }

    const newRegistered = await UserWebinars.create({
      userId: user.id,
      webinarId: webinar.id,
    });

    // Check if the record is new and then send an email
    if (newRegistered) {
      await transporter.sendMail({
        from: '"Fanavaran" <no-reply@fanavaran.ca>',
        to: email,
        subject: "Your registration for the webinar was successful.",
        text: "", // Optionally, you can have a plain text version of the email here.
        html: enrollWebinarEmailTemplate(webinar.title, webinar.date, webinar.time, "https://us02web.zoom.us/my/fanavaran4"), // Assuming you pass the zoom link as the last parameter.
      });

      // Return success response after sending the email
      return res.status(201).json({
        error: false,
        message: "Your registration was successful!",
      });
    }

    // This block will not execute because it's unreachable due to the return statement above
    return res.status(400).json({
      error: true,
      message: "There was a problem registering.",
    });

  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({
      error: true,
      message: "There was a problem registering for the webinar.",
    });
  }
};


module.exports = { getWebinars, getSingleWebinar, enrollUser };

