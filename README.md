# Properties Rental API with TS

  ## Table of contents
  * [General info](#general-info)
  * [Technologies](#technologies)
  * [How Does it work](#how-does-it-work)
  * [Requests JSON Format](#requests-json-format)
  
  ### General info
  this project is a practise for using **_Typescript_** in Back-end development.<br>
  Its an api for a residential properties renting app for owners to list their properties and tenants/users to expolre and rent.

  ### Technologies:
  
    -Typescript ^5.1.6
    -ExpressJs ^4.18.2
    -Tsonwebtoken(JWT) ^9.0.1
    -mongoose ^7.5.2

  ### How Does it work:

  1. Users<br>
  -  [`/users/signup `](#-signup-form)    Send a **Post** request with the users info and Role (Owner/Tenant).
  -  `/users/login `    Send a **Post** request with the login info (Owner/Tenant), you will receive the Token and user data if *valid*.
  -  `/users/all `    Send a **Get** request to get all users. **Only Admin Request**
  -  `/users/"user id" `    Send a **Get** request to get the user info or profile.
  -  `/users/"user id" `    Send a **Put** request to change the user info.
  -  `/users/"user id" `    Send a **Delete** request to delete user.
___
  2. Listings<br>
  -  [`/listings `](#-createupdate-listing-form)    Send a **Post** request with the listing info. **Only Owners Request**
  -  `/listings/"listing id" `    Send a **Get** request to get Listing info.
  -  `/listings/user/"user id" `    Send a **Get** request to get all user's(owner) available properties.  
  -  [`/listings/search `](#-search-form)    Send a **Post** request with searching filters (*text*, *country*, *prop_type*, *max and min price*).
  -  [`/listings/"listing id" `](#-createupdate-listing-form)     Send a **Put** request to change the listing info.
  -  `/listings/"listing id" `    Send a **Delete** request to delete listing. **(before deletion checks for upcoming reservations)**
___
  3. Reservations<br>
  -  [`/reservations `](#-make-reservation)    Send a **Post** request with the reservation info. **Only Tenants Request**
  -  `/reservations/"reservation id" `    Send a **Get** request to get reservation info.
  -  `/reservations/user/"user id" `    Send a **Get** request to get all user's(tenant) reservation.  **Only Same Tenant Request**
  -  `/reservations/listing/"listing id" `    Send a **Get** request to get all the listing's reservation. **Only Same Owner Request**
  -  [`/reservations/"reservation id" `](#-update-reservation)    Send a **Put** request to change the reservation info. **Only Admin Request**
  -  `/reservations/"reservation id" `    Send a **Delete** request to delete reservation. **Only Admin Request**
  
  ### Requests JSON Format:
#### &nbsp;&nbsp; Signup Form:
```json
  {
      "data":{
          "email": "", 
          "password": "",
          "first_name": "",
          "last_name": "",
          "phone": "",
          "role": "" opts(owner, tenant)
      }
  }
```
#### &nbsp;&nbsp; Create/Update Listing Form:
```json
  {
      "data":{
        "place": {
            "bedrooms": "",
            "beds": "",
            "bathrooms": ""
        },
        "address": {
            "country": "",
            "city": "",
            "full_address": ""
        },
        "rules": { (true, false)
            "pets": ,
            "smoking": ,
            "events": 
        },
        "title": "",
        "thumbnail": "",
        "images": [], (list of strings)
        "description": "",
        "type": "", opts(apartment, house, room, villa)
        "price": ,
        "features": [(any extra features)
            { "balcony": true}
            {"elevator": true},
            {"floor": "4th"}
        ]
    }
  }
```
#### &nbsp;&nbsp; Search Form:
```json
  {
    "searchText": "",
    "country": "",
    "max_price": ,
    "min_price": ,
    "type": "", otps(apartment, house, room, villa)
  }
```
#### &nbsp;&nbsp; Make Reservation:
```json
  {
    "data":{
        "listing": "",
        "checkIn": "", format(yyyy-mm-dd)
        "checkOut": ""
    }
  }
```
#### &nbsp;&nbsp; Update Reservation:
```json
  {
    "data":{
        "checkIn": "", format(yyyy-mm-dd)
        "checkOut": ""
    }
  }
```
    
