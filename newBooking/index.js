const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { customerName, roomType, numberOfGuests, numberOfNights, checkIn } = body;

        // Kontrollera att alla nödvändiga fält finns
        if (!customerName || !roomType || !numberOfGuests || !numberOfNights) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields: customerName, roomType, numberOfGuests, numberOfNights',
                }),
            };
        }

        // Kontrollera tillgängliga rum för varje rumtyp
        const roomChecks = await Promise.all(roomType.map(async (type) => {
            const availableRoomsParams = await db.query({
                TableName: "rooms",
                KeyConditionExpression: "type = :roomType AND begins_with(id, :roomPrefix)",
                FilterExpression: "allowedGuests >= :numberOfGuests",
                ExpressionAttributeValues: {
                    ':roomType': type, // Partition key
                    ':roomPrefix': `${type}:`, // Prefix för sort key
                    ':numberOfGuests': numberOfGuests
                }
            });

            // Returnera om det finns tillgängliga rum för den aktuella typen
            return availableRoomsParams.Items.length > 0;
        }));

        // Om alla rumstyper är tillgängliga kan vi skapa en ny bokning
        const newBookingParams = {
            TableName: "bookings",
            Item: {
                bookingReference: uuidv4(),
                customer: customerName,
                rooms: roomType,
                guests: numberOfGuests,
                nights: numberOfNights,
                checkInDate: checkIn
            }
        };
        await db.put(newBookingParams);

        return {
            statusCode: 200,
            body: JSON.stringify(roomChecks)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};






























































































//     const roomData = await db.scan({
//       TableName: 'rooms',
//       FilterExpression:
//         'RoomType = :roomType AND available = :available AND allowedGuests >= :numberOfGuests',
//       ExpressionAttributeValues: {
//         ':roomType': roomType,
//         ':available': true,
//         ':numberOfGuests': numberOfGuests,
//       },
//     });

//     const availableRooms = roomData.Items;

//     if (availableRooms.length === 0) {
//       return {
//         statusCode: 404,
//         body: JSON.stringify({
//           message: 'No available rooms found for the given number of guests',
//         }),
//       };
//     }

//     // Välj det första tillgängliga rummet
//     const roomToBook = availableRooms[0];

//     const bookingReference = uuidv4();

//     // Lägg till bokningen i 'bookings' tabellen
//     await db.put({
//       TableName: 'bookings',
//       Item: {
//         bookingReference: bookingReference,
//         CustomerId: customerName,
//         roomId: roomToBook.id,
//         roomType: roomType,
//         bookingDate: new Date().toISOString(),
//         numberOfGuests: numberOfGuests,
//       },
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Room booked successfully',
//         bookingReference: bookingReference,
//         customerId: customerName,
//         roomDetails: roomToBook,
//       }),
//     };
//   } catch (error) {
//     console.error('Error booking room: ', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Internal server error',
//         error: error.message,
//       }),
//     };
//   }
// };
