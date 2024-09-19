const { db } = require("../db");

exports.handler = async (event) => {
    console.log("Event: ", event);
    
    try {
        const type = event.pathParameters.type;
        console.log("Type: ", type);

        const { Items } = await db.query({
            TableName: "rooms",
            KeyConditionExpression: "#typeAlias = :type",
            ExpressionAttributeValues: {
                ":type": type
            },
            ExpressionAttributeNames: {
                '#typeAlias': 'type'  // Alias för partition key
            },
        });

        console.log("Query Result: ", Items);

        return {
            statusCode: 200,
            body: JSON.stringify({ Rooms: Items })
        };
    } catch (error) {
        console.error("Error querying DynamoDB:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Couldn't get rooms", error: error.message })
        };
    }
};
      
