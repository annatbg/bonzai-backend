# Bonzai Backend

### A project by

- [annatbg](https://github.com/annatbg)
- [rebeckaelin](https://github.com/rebeckaelin)
- [Ahmed-a287](https://github.com/Ahmed-a287)

### Database relationships

### Bookings

| Booking Reference (sort key)   | Customer | Check-in Date | Guests | Nights | Type of Rooms      |
|--------------------------------|----------|---------------|--------|--------|-------------------|
| 028b7cf9-fca5-4...             | Ahmed    | 2024-10-01    | 1      | 3      | Single            |
| 228b7fca-a816-4...             | Rebban   | 2024-10-01    | 2      | 3      | Single, Single    |
| 4cefb028-7868-4...             | Anna     | 2024-10-01    | 1      | 3      | Double            |

### Room Types Table

| Type   | ID (string)             | Allowed Guests | Price |
|--------|-------------------------|----------------|-------|
| room   | single:25db2e7f-9813...  | 1              | 500   |
| room   | double:24db2e9f-9013...  | 2              | 1000  |
| room   | suite:11db2e9f-9089...   | 3              | 1500  |


### Endpoints

- GET - https://zyfeqi0n9g.execute-api.eu-north-1.amazonaws.com/rooms/{type} (hämta alla rum, type = room)
- POST - https://zyfeqi0n9g.execute-api.eu-north-1.amazonaws.com/rooms  (lägg till nytt rum i rooms-table)
- DELETE - https://zyfeqi0n9g.execute-api.eu-north-1.amazonaws.com/bookings/{id} (avbokning, ange bokningsreferensen på id)
- GET - https://zyfeqi0n9g.execute-api.eu-north-1.amazonaws.com/bookings/{booking} (hämta alla bokningar, booking = room )
- POST - https://zyfeqi0n9g.execute-api.eu-north-1.amazonaws.com/bookings (lägg en ny bokning)
