const { db } = require("../db");

exports.handler = async (event) => {
  const bookingReference = event.pathParameters.id;

  if (!bookingReference) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing booking reference" }),
    };
  }

  const getBooking = await db.get({
    TableName: "bookings",
    Key: {
      booking: "room",
      bookingReference: bookingReference,
    },
  });

  const stringDate = getBooking.Item.checkInDate;
  const checkInDate = new Date(stringDate);
  const todaysDate = new Date();

  const allowedDeleteDate = new Date(todaysDate);
  allowedDeleteDate.setDate(todaysDate.getDate() + 2);

  if (checkInDate <= allowedDeleteDate) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Not allowed to cancel the booking" }),
    };
  }

  try {
    await db.delete({
      TableName: "bookings",
      Key: {
        booking: "room",
        bookingReference: bookingReference,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
