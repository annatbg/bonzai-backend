
const {db} = require("../db")

exports.handler = async (event) => {

    console.log(event);
    
    try {
        const {Items} = await db.scan({
            TableName: "rooms",
        })

    return {
            statusCode: 200,
            body: JSON.stringify({Rooms: Items}
            )

    }       
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "couldnt get rooms"})
        }
    }

    }
      
