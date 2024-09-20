const { db } = require("../db");

exports.handler = async (event) => {
  try {
    const type = event.pathParameters.type;

    const { Items } = await db.query({
      TableName: "rooms",
      KeyConditionExpression: "#typeAlias = :type",
      ExpressionAttributeValues: {
        ":type": type,
      },
      ExpressionAttributeNames: {
        "#typeAlias": "type",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ Rooms: Items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Couldn't get rooms",
        error: error.message,
      }),
    };
  }
};
