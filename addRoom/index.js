const {db} = require("../db")
const {v4: uuid} = require("uuid")

exports.handler = async (event) => {
    const body = JSON.parse(event.body)
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
    return error.message
    
}

    return {
        statusCode: 200,
        body: JSON.stringify({message: "Room added"})
    }
}