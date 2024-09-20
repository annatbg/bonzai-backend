const { db } = require('../db');

exports.handler = async (event) => {
  const bookingReference = event.pathParameters.id; // Get booking reference from URL

  if (!bookingReference) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing booking reference' }),
    };
  }

  const getBooking = await db.get({
    TableName: 'bookings',
    Key: {
      booking: 'room',
      bookingReference: bookingReference,
    },
  });

  const stringDate = getBooking.Item.checkInDate;
  const checkInDate = new Date(stringDate);
  const todaysDate = new Date();

  // Skapa ett datum som är 2 dagar från dagens datum
  const allowedDeleteDate = new Date(todaysDate);
  allowedDeleteDate.setDate(todaysDate.getDate() + 2);

  console.log('Check-in Date:', checkInDate);
  console.log('getBooking:', getBooking);
  console.log('string Date:', stringDate);
  console.log("Today's Date:", todaysDate);
  console.log('Allowed Delete Date:', allowedDeleteDate);

  // Jämför datumen
  if (checkInDate <= allowedDeleteDate) {
    console.log('Not allowed to cancel the booking');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Not allowed to cancel the booking' }),
    };
  }

  try {
    await db.delete({
      TableName: 'bookings',
      Key: {
        booking: 'room',
        bookingReference: bookingReference,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Booking deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
