const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { customerName, roomType, numberOfGuests, numberOfNights, checkIn } = body;

        // Kontrollera att alla nödvändiga fält finns
        if (customerName === "" || undefined) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Please correct the customerName field. Cannot be an empty string',
                }),
            };
        }
        if (roomType.length <= 0 || undefined ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                message: 'Please correct the roomType field. Cannot be empty.',
                    }),
                };
        }

        if (numberOfGuests <= 0 || undefined) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                message: 'Please correct the numberOfGuests field. Cannot be less than 1.',
                    }),
                };
        }

        if (numberOfNights <= 0 || undefined) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                message: 'Please correct the numberOfNights field. Cannot be less than 1.',
                    }),
                };
        }

        if (checkIn === undefined){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Please correct the checkIn field, cannot be empty. Please use format 2024-10-01',
                }),
            };
        }



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
                return sum
            };
            }, 0)                
                return totalCapacity >= guests;
            
            }
            
        let total = validateCapacity(roomType, numberOfGuests) 

        if (!total) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: "Sorry, youre trying to book over the capacity. Please adjust the number of guests to the number of allowed guests per room."})
            }
            
        } 

        // Om alla rumstyper är tillgängliga kan vi skapa en ny bokning
        const newBookingParams = {
            TableName: "bookings",
            Item: {
                bookingReference: uuidv4(),
                customer: customerName,
                typeOfRooms: roomType,
                guests: numberOfGuests,
                nights: numberOfNights,
                checkInDate: checkIn,
                booking: "room"
            }
        };
        await db.put(newBookingParams);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Booking successful', Booking: newBookingParams.Item })
        };
            


    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};

























































// const availableRooms = availableRoomsParams.Items;
// console.log(`Query Result for ${roomType}:, availableRooms`);

// const totalRoomCapacity = availableRooms.reduce((sum, room) => sum + room.allowedGuests, 0);
// totalAvailableCapacity += totalRoomCapacity;

// console.log(`Available Rooms for ${roomType}:`, availableRooms);
// console.log(`Total Capacity for ${roomType}:`, totalRoomCapacity);


// if (availableRooms.length < requiredRooms) {
//     return {
//         statusCode: 400,
//         body: JSON.stringify({
//             message: `Too many guests for ${roomType}`
//         }),
//     };
// }
// }







































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
