const Transactions = require("../../../../models").Transactions;
const Users = require("../../../../models").Users;
const axios = require("axios");
const Courses = require("../../../../models").Courses;

const ACTIVE_CAMPAIGN_API_URL = "https://geniuscamp.api-us1.com/api/3";
const ACTIVE_CAMPAIGN_API_KEY =
  "78465a755a4825860f06481b1da0d00ef5239a74a557efc9965abf85679f3d525eb0b602";
// Replace with your specific list ID

const addContactToList = async (email, LIST_ID) => {
  try {
    // Step 1: Find or Create the Contact
    let contactResponse = await axios.get(
      `${ACTIVE_CAMPAIGN_API_URL}/contacts?filters[email]=${encodeURIComponent(
        email
      )}`,
      {
        headers: { "Api-Token": ACTIVE_CAMPAIGN_API_KEY },
      }
    );

    let contactId;

    if (contactResponse.data.contacts.length === 0) {
      // Contact does not exist, create a new one
      contactResponse = await axios.post(
        `${ACTIVE_CAMPAIGN_API_URL}/contacts`,
        {
          contact: { email: email },
        },
        {
          headers: {
            "Api-Token": ACTIVE_CAMPAIGN_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      contactId = contactResponse.data.contact.id;
    } else {
      // Contact exists
      contactId = contactResponse.data.contacts[0].id;
    }

    // Step 2: Add the Contact to a Specific List
    await axios.post(
      `${ACTIVE_CAMPAIGN_API_URL}/contactLists`,
      {
        contactList: {
          list: LIST_ID,
          contact: contactId,
          status: 1, // '1' to subscribe, '2' to unsubscribe
        },
      },
      {
        headers: {
          "Api-Token": ACTIVE_CAMPAIGN_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return `Contact with email ${email} added to list ${LIST_ID}`;
  } catch (error) {
    console.error("Error in addContactToList:", error);
    throw error;
  }
};

// find activecamping list id from courses table
const handleCourses = async (user, courseIds) => {
  try {
    for (const courseId of courseIds) {
      if (courseId !== 150000) {
        // Retrieve the list ID for the course
        const course = await Courses.findOne({ where: { id: courseId } });
        if (course && course.activeList) {
          await addContactToList(user.email, course.activeList);
        }
      }
    }
  } catch (error) {
    console.error("Error in handleCourses:", error);
    throw error;
  }
};

//Convert now date to year-month-day format
const calculateOneYearFromNow = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() + 1);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

//Verify payment with stripe webhook
const verifyPayment = async (req, res) => {
  try {
    const eventData = req.body?.data?.object;
    console.log(req);
    //Check and return  if request is now a event
    if (!eventData) {
      return res.status(200).send("Received");
    }

    //charge use for the courses transaction
    if (eventData.object === "charge" && eventData.status === "succeeded") {
      const transaction = await Transactions.findOne({
        where: { Stripe_Charge_ID: eventData.id },
      });

      if (transaction) {
        transaction.Transaction_Status = eventData.status;
        await transaction.save();
      }
    } else if (
      eventData.object === "payment_intent" &&
      eventData.status === "succeeded"
    ) {
      const user = await Users.findOne({
        where: { stripeCustomerId: eventData.customer },
      });

      if (user) {
        const oldTransaction = await Transactions.findOne({
          where: { Stripe_Charge_ID: eventData.id },
        });

        // Handle Purchase email
        await handleCourses(user, oldTransaction.courseId);

        // Check if the VIP membership course is part of the transaction

        user.vip = calculateOneYearFromNow();
        await user.save();

        if (!oldTransaction) {
          user.vip = calculateOneYearFromNow();
          await user.save();

          await Transactions.create({
            userId: user.id,
            courseId: [0],
            cycleId: [0],
            Stripe_Charge_ID: eventData.id,
            Amount: eventData.amount,
            Currency: "CAD",
            Transaction_Date: new Date(),
            Transaction_Status: eventData.status,
            Transaction_Type: "Stripe",
            coupons: null,
          });

          //here add activecamp code
        } else {
          user.vip = calculateOneYearFromNow();
          await user.save();
          oldTransaction.Transaction_Status = eventData.status;
          await oldTransaction.update();
        }
      }
    }
    res.status(200).send("Received");
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { verifyPayment };
