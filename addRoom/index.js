
const {db} = require("../db")
const {v4: uuid} = require("uuid")

exports.handler = async (event) => {
    const body = JSON.parse(event.body)
    // console.log(event);
    

    if (body.roomType === undefined || body.price === undefined || body.allowedGuests === undefined) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Please provide the following keys: roomType, price, avaiable and allowedGuests."})
        };
    }
    try {
        await db.put({
            TableName: "rooms",
            Item: {
                id: `${body.roomType}:${uuid()}`,
                type: "room",
                price: body.price,
                allowedGuests: body.allowedGuests
            }
        })
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Missing data error"})
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Room added"})
}
        
    }
