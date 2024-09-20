const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { customerName, roomType, numberOfGuests, numberOfNights, checkIn } =
      body;

    // Validate the required fields
    if (!customerName || customerName === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            'Please correct the customerName field. Cannot be an empty string',
        }),
      };
    }

    if (!roomType || roomType.length <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Please correct the roomType field. Cannot be empty.',
        }),
      };
    }

    if (!numberOfGuests || numberOfGuests <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            'Please correct the numberOfGuests field. Cannot be less than 1.',
        }),
      };
    }

    if (!numberOfNights || numberOfNights <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            'Please correct the numberOfNights field. Cannot be less than 1.',
        }),
      };
    }

    if (!checkIn) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            'Please correct the checkIn field, cannot be empty. Please use format 2024-10-01',
        }),
      };
    }

    // Function to validate capacity
    const validateCapacity = (rooms, guests) => {
      const totalCapacity = rooms.reduce((sum, room) => {
        switch (room) {
          case 'suite':
            return sum + 3;
          case 'double':
            return sum + 2;
          case 'single':
            return sum + 1;
          default:
            return sum;
        }
      }, 0);
      return totalCapacity >= guests;
    };

    let isValidCapacity = validateCapacity(roomType, numberOfGuests);

    if (!isValidCapacity) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Sorry, you're trying to book over the capacity. Please adjust the number of guests.",
        }),
      };
    }

    const totalRooms = 2; // Example: replace with the actual total room count
    let numberOfRooms = roomType.length;

    // Scan the bookings table to count total booked rooms
    const allBookings = await db.scan({
      TableName: 'bookings',
    });

    let totalBookedRooms = allBookings.Items.reduce((sum, booking) => {
      return sum + booking.numberOfRooms;
    }, 0);

    console.log('Total booked rooms:', totalBookedRooms);

    if (totalBookedRooms >= totalRooms) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Sorry, we're full!" }),
      };
    }

    const availableRooms = totalRooms - totalBookedRooms;
    if (numberOfRooms > availableRooms) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Sorry, we don't have enough available rooms for your request.",
        }),
      };
    }

    // Create a new booking
    const newBookingParams = {
      TableName: 'bookings',
      Item: {
        bookingReference: uuidv4(),
        customer: customerName,
        typeOfRooms: roomType,
        guests: numberOfGuests,
        nights: numberOfNights,
        checkInDate: checkIn,
        booking: 'room',
        numberOfRooms: numberOfRooms,
      },
    };

    await db.put(newBookingParams);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Booking successful',
        Booking: newBookingParams.Item,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
