const { db } = require("../db");

exports.handler = async (event) => {
    
    try {
        const booking = event.pathParameters.booking;

        const { Items } = await db.query({
            TableName: "bookings",
            KeyConditionExpression: "booking = :booking",
            ExpressionAttributeValues: {
                ":booking": booking
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ Bookings: Items })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Couldn't get bookings", error: error.message })
        };
    }
};
      
