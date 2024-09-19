const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { customerName, roomTYP, numberOfGuests, numberOfNights, checkIn } = body;

        // // Kontrollera att alla nödvändiga fält finns
        // if (customerName === undefined || roomTYP === undefined || numberOfGuests === undefined || numberOfNights === undefined || checkin === undefined) {
        //     return {
        //         statusCode: 400,
        //         body: JSON.stringify({
        //             message: 'Missing required fields: customerName, roomTYP, numberOfGuests, numberOfNights, checkin',
        //         }),
        //     };
        // }

        // Räkna förekomsten av varje rumstyp
        const roomCount = roomTYP.reduce((acc, currentRoomTYP) => {  
            acc[currentRoomTYP] = (acc[currentRoomTYP] || 0) + 1;
            return acc;
        }, {});

        


        // Kontrollera tillgängliga rum för varje rumstyp
        for (let roomType in roomCount) {  
            const requiredRooms = roomCount[roomType];
        
            // Hämta tillgängliga rum av den typen som matchar antalet gäster
            const availableRoomsParams = await db.query({
                TableName: "rooms",
                KeyConditionExpression: "#typeAlias = :roomType AND begins_with(id, :roomPrefix)",  // Använd alias för partition key
                FilterExpression: "allowedGuests >= :numberOfGuests",
                ExpressionAttributeNames: {
                    '#typeAlias': 'type'  // Alias för partition key
                },
                ExpressionAttributeValues: {
                    ':roomType': "room",  // Partition key som alltid är "room"
                    ':roomPrefix': `${roomType}:`,  // Prefix för sort key som baseras på rumstyp (t.ex. "single:", "double:")
                    ':numberOfGuests': numberOfGuests
                }
            });


        }
            const validateCapacity = (rooms, guests) => {
                const totalCapacity = rooms.reduce((sum, room) => {
                    console.log(sum);

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
       

            
        let total = validateCapacity(roomTYP, numberOfGuests) 

        

        if (!total) {
            console.log("toobad");
            return {
                statusCode: 400,
                body: JSON.stringify({message: "NOT ALLOWED!!!!!!!!"})
            }
            
        } 
        console.log("hej");
        // Om alla rumstyper är tillgängliga kan vi skapa en ny bokning
        const newBookingParams = {
            TableName: "bookings",
            Item: {
                bookingReference: uuidv4(),
                customer: customerName,
                typeOfRooms: roomTYP,
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
