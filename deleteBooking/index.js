const { db } = require("../db");

exports.handler = async (event) => {
    const bookingReference = event.pathParameters.id; // Get booking reference from URL

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
            bookingReference: bookingReference 
        }
    }) 

    

    try {
        await db.delete({
            TableName: "bookings",
            Key: {
                booking: "room",
                bookingReference: bookingReference 
            }
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




