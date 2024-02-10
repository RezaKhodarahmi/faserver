const Webinars = require("../../../../../models").Webinars;
const Users = require("../../../../../models").Users;
const UserWebinars = require("../../../../../models").UserWebinars;

const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinars.findAll({ where: { status: 1 } });
    return res.status(200).json({
      error: false,
      data: webinars,
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
        message: "Error!",
      });
    }

    const existedEnroll = await UserWebinars.findOne({
      where: { userId: user.dataValues.id, webinarId: webinar.dataValues.id },
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
    if (newRegistered._options.isNewRecord) {
      return res.status(201).json({
        error: false,
        message: "Your registration was successful!",
      });
    }
    return res.status(400).json({
      error: true,
      message: "There was a problem registering.",
    });
  } catch (error) {
    return res.status(500).send("There was a problem registering!");
  }
};

module.exports = { getWebinars, getSingleWebinar, enrollUser };
