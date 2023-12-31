const Transactions = require("../../../../../models").Transactions;
const Referral = require("../../../../../models").Referral;
const Users = require("../../../../../models").Users;
const TransactionCycles = require("../../../../../models").TransactionCycles;
const TransactionCourses = require("../../../../../models").TransactionCourses;
const Enrollments = require("../../../../../models").Enrollments;
const Validation = require("../../../../../utils/dashboard/validationSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var request = require("request");
const axios = require("axios");

const calculateOrderAmount = (items, coupon) => {
  const amount = items.reduce((sum, item) => sum + item.regularPrice, 0);

  // Calculate the total discount amount from the coupon
  if (coupon) {
    const totalCouponDiscount = coupon.reduce((total, coupon) => {
      if (coupon.discount && coupon.discount.includes("$")) {
        const amount = parseFloat(coupon.discount.replace("$", ""));
        return total + amount;
      }
      return total;
    }, 0);
    return amount - totalCouponDiscount;
  } else {
    return amount;
  }

  // Subtract the total coupon discount from the order amount
};
const checkout = async (req, res) => {
  try {
    const params = req.body;
    const { err } = Validation.handelCheckoutReq(params);
    if (err) {
      return res.status(401).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const existedTransaction = await Transactions.findOne({
      where: { Stripe_Charge_ID: params.Stripe_Charge_ID },
    });
    if (existedTransaction) {
      return res.status(400).json({
        error: true,
        message: "The transaction existed!",
      });
    }
    const user = await Users.findOne({
      where: { email: params.userId },
    });

    const newTransaction = await Transactions.create({
      ...params,
      userId: user.id,
    });
    if (newTransaction) {
      await Enrollments.create({
        courseId: params.courseId,
        cycleId: params.cycleId,
        userId: user.id,
        enrollmentDate: newTransaction.createdAt,
        completionDate: newTransaction.createdAt,
        cancelled: 0,
        cancellationResult: null,
      });
    }

    return res.status(201).json({
      error: false,
      message: "The transaction created successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

//This function will call after user open the cart page (if any items in cart)
const createPaymentIntent = async (req, res) => {
  try {
    const { items, email, coupon, referralUser } = req.body;

    // Calculate the order amount with the coupon discounts
    const orderAmount = calculateOrderAmount(items, coupon);

    //Get the cart items and save their Id into an array
    var cycles = [];
    var courses = [];
    for (const cycle of Object(items)) {
      cycles.push(cycle.id);
      courses.push(cycle.courseId);
    }

    // Retrieve or create a Stripe customer for the user
    let user = await Users.findOne({ where: { email: email } });
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({ email: email });
      stripeCustomerId = stripeCustomer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // Check if contact exists in ActiveCampaign
    const activeCampaignApiKey =
      "78465a755a4825860f06481b1da0d00ef5239a74a557efc9965abf85679f3d525eb0b602"; // Replace with your ActiveCampaign API Key
    const activeCampaignApiUrl =
      "https://geniuscamp.api-us1.com/api/3/contacts";

    const contactResponse = await axios.get(
      `${activeCampaignApiUrl}?filters[email]=${encodeURIComponent(email)}`,
      {
        headers: {
          "Api-Token": activeCampaignApiKey,
        },
      }
    );

    // If contact does not exist, create it
    if (contactResponse.data.contacts.length === 0) {
      await axios.post(
        activeCampaignApiUrl,
        {
          contact: {
            email: email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            mobile: user.phone,
            fieldValues: [
              // Replace with actual field IDs and ensure the values are correctly formatted
              { field: "3", value: user.city },
              { field: "34", value: user.country },
              { field: "6", value: user.postalCode },

              // Add other custom fields as necessary
            ],
          },
        },
        {
          headers: {
            "Api-Token": activeCampaignApiKey,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create a PaymentIntent with the order amount, currency, and customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount * 100, // Convert to cents
      currency: "cad",
      customer: stripeCustomerId, // Associate the customer with the payment intent
    });

    //store in DB
    const existedTransaction = await Transactions.findOne({
      where: { Stripe_Charge_ID: paymentIntent.id },
    });

    if (existedTransaction) {
      return res.status(400).json({
        error: true,
        message: "The transaction existed!",
      });
    }

    const coupons = [];
    if (coupon) {
      for (const item of Object(coupon)) {
        if (item.code) {
          coupons.push(item.code);
        }
      }
    }
    //Create new transaction
    const newTransaction = await Transactions.create({
      Stripe_Charge_ID: paymentIntent.id,
      userId: user.id,
      Amount: orderAmount,
      courseId: courses,
      cycleId: cycles,
      Currency: "CAD",
      coupons: coupons,
      Transaction_Status: paymentIntent.status,
      Transaction_Date: new Date(),
    });
    if (referralUser?.id) {
      const referral = await Referral.findOne({
        where: {
          referredId: user.id,
          referrerId: referralUser.id,
          status: "Pending",
        },
      });
      if (!referral) {
        return res.status(401).json({
          error: true,
          message: "There is an error.",
        });
      }
      referral.transactionId = newTransaction.Transaction_ID;
      await referral.save();
    }

    for (const cycle of Object(items)) {
      await TransactionCycles.create({
        Transaction_ID: newTransaction.Transaction_ID,
        cycleId: cycle.id,
      });
      await TransactionCourses.create({
        Transaction_ID: newTransaction.Transaction_ID,
        courseId: cycle.courseId,
      });
    }
    //Enroll user in the course
    if (newTransaction) {
      for (const cycle of Object(items)) {
        const EnRolled = await Enrollments.findOne({
          where: { cycleId: cycle.id, userId: user.id },
        });

        if (EnRolled) {
          EnRolled.enrollmentDate = new Date();
          await EnRolled.save();
        } else {
          await Enrollments.create({
            courseId: cycle.courseId,
            cycleId: cycle.id,
            userId: user.id,
            Transaction_ID: newTransaction.Transaction_ID,
            enrollmentDate: new Date(),
            completionDate: new Date(),
            cancelled: 0,
            cancellationResult: null,
          });
        }
      }
    }

    //Send response
    return res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

//This function will called after successfully payment
const confirmPayment = async (req, res) => {
  try {
    //get the paymentIntentId from the client
    const { paymentIntentId } = req.body;

    const transaction = await Transactions.findOne({
      where: { Stripe_Charge_ID: paymentIntentId },
    });
    if (transaction.Transaction_Status != "succeeded") {
      // Retrieve the payment intent details from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      // Extract relevant information from the payment intent
      const { amount, status } = paymentIntent;

      //Find the transaction

      if (!transaction) {
        //Check if transaction exist

        return res.status(400).json({
          error: true,
          message: "Transaction not founded!",
        });
      }

      //Update the transaction
      transaction.Amount = amount / 10;
      transaction.Transaction_Status = status;
      transaction.updatedAt = new Date();
      transaction.Transaction_Date = new Date();

      await transaction.save();

      if (status === "succeeded") {
        const user = await Users.findOne({ where: { id: transaction.userId } });
        let stripeCustomerId = user.stripeCustomerId;

        // If stripeCustomerId does not exist, create a new Stripe customer
        if (!stripeCustomerId) {
          const newCustomer = await stripe.customers.create({
            email: user.email, // Assuming email is available in user model
          });
          stripeCustomerId = newCustomer.id;

          // Update user with new Stripe customer ID
          transaction.user.stripeCustomerId = stripeCustomerId;
          await transaction.user.save();
        }

        // Check if the VIP membership course is part of the transaction
        if (transaction.courseId.includes(150000)) {
          // Create Stripe subscription for 365 days with auto-renewal
          await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [{ price: process.env.STRIPE_MEMBERSHIP_PRICE_ID }],
            trial_end: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // Set trial end to 365 days from now
          });
        }
        //Update the user enrollments
        const Enrolls = await Enrollments.findAll({
          where: { Transaction_ID: transaction.Stripe_Charge_ID },
        });
        for (const item of Enrolls) {
          // Assuming the 'status' property is a numeric value (1 for confirmed, etc.)
          item.status = 1;
          await item.save();
        }
        const referral = await Referral.findOne({
          where: {
            transactionId: transaction.Transaction_ID,
            status: "Pending",
          },
        });
        if (referral) {
          referral.status = "succeeded";
          referral.save();

          const referrerUser = await Users.findOne({
            where: { id: referral.referrerId },
          });
          if (referrerUser) {
            const userCredit = parseFloat(referrerUser.credit);
            const referralCredit = parseFloat(process.env.REFERRAL_CREDIT);
            referrerUser.credit = userCredit + referralCredit;
            await referrerUser.save();
          }
        }
      }

      return res.sendStatus(200);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};
const handelPartiallyPayment = async (req, res) => {
  try {
    var options = {
      url: "https://demo.partial.ly/api/payment_plan",
      headers: {
        Authorization: "Bearer fVzEb8/y83DglQ/XVNI8zQ",
      },
      method: "POST",
      json: true,
      body: {
        amount: 1000,
        customer: {
          email: "mrkhodarahmsii@gmail.com",
          first_name: "Testing",
          last_name: "Person",
        },
        offer_id: "03363b54-54d1-4b1d-adfa-6f61ad4bf023",
      },
    };

    request(options, function (error, response, body) {
      // asynchronous callback function
      return res.status(200).json({
        error: false,
        data: response,
      });
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  checkout,
  createPaymentIntent,
  confirmPayment,
  handelPartiallyPayment,
};
