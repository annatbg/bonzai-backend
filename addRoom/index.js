const { log } = require("console")
const {db} = require("../db")
const {v4: uuid} = require("uuid")

exports.handler = async (event) => {
    const body = JSON.parse(event.body)
    console.log(event);
    

    if (body.roomType === undefined || body.price === undefined || body.available === undefined|| body.allowedGuests === undefined) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Please provide the following keys: roomType, price, avaiable and allowedGuests."})
        };
    }
    try {
        await db.put({
            TableName: "rooms",
            Item: {
                id: uuid(),
                RoomType: body.roomType,
                price: body.price,
                available: body.available,
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
