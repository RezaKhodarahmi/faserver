const Transactions = require("../../../../models").Transactions;
const Users = require("../../../../models").Users;
const Courses = require("../../../../models").Courses;
const { transporter } = require("../../../../config/mailSender");

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

        const user = await Users.findOne({ where: { id: transaction.userId } });

        // Fetch all courses based on the array of course IDs in the transaction
        const courses = await Courses.findAll({
          where: { id: transaction.courseId }, // Assuming your ORM supports querying with an array
        });

        // Construct the course details string/HTML
        let coursesDetails = courses
          .map(
            (course) => `<p>Course Name: ${course.title}</p>` // You can add more details here as needed
          )
          .join(""); // Join all course details into a single string

        // Ensure amount and currentDate are defined appropriately before this point

        await transporter.sendMail({
          from: '"Fanavaran" <no-reply@fanavaran.ca>',
          to: "mrkhodarahmii@gmail.com",
          subject: "New order",
          text: "", // Optionally, you can have a plain text version of the email here.
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>New Order Received</h2>
                <p><strong>Customer Details:</strong></p>
                <p>Name: ${user.firstName} ${user.lastName}</p>
                <p>Email: ${user.email}</p>
                <p>Phone: ${user.phone}</p>
                <hr>
                <p><strong>Order Details:</strong></p>
                ${coursesDetails}
                <p>Amount: ${transaction.Amount}</p>
                <p>Date: ${transaction.updatedAt}</p>
            </div>
          `, // Using the constructed courses details string
        });
      }
      //This is support the VIP member transaction
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

