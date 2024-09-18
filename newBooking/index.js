const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { customerName, roomType, numberOfGuests } = body;

    if (!customerName || !roomType || !numberOfGuests) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            'Missing required fields: customerName, roomType, numberOfGuests',
        }),
      };
    }

    const roomData = await db.scan({
      TableName: 'rooms',
      FilterExpression:
        'RoomType = :roomType AND available = :available AND allowedGuests >= :numberOfGuests',
      ExpressionAttributeValues: {
        ':roomType': roomType,
        ':available': true,
        ':numberOfGuests': numberOfGuests,
      },
    });

    const availableRooms = roomData.Items;

    if (availableRooms.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'No available rooms found for the given number of guests',
        }),
      };
    }

    // Välj det första tillgängliga rummet
    const roomToBook = availableRooms[0];

    const bookingReference = uuidv4();

    // Lägg till bokningen i 'bookings' tabellen
    await db.put({
      TableName: 'bookings',
      Item: {
        bookingReference: bookingReference,
        CustomerId: customerName,
        roomId: roomToBook.id,
        roomType: roomType,
        bookingDate: new Date().toISOString(),
        numberOfGuests: numberOfGuests,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Room booked successfully',
        bookingReference: bookingReference,
        customerId: customerName,
        roomDetails: roomToBook,
      }),
    };
  } catch (error) {
    console.error('Error booking room: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
      }),
    };
  }
};
