import {Model, Types, Document} from "mongoose"

interface IUser{
    _id: string
    email: string
    password: string
    first_name: string
    last_name: string
    phone: string
    timestamps: Boolean
    role: string 
}

interface UserModel extends Model<IUser>{
    login(email:string, password: string): any
}

interface IOwner{
    _id: Types.ObjectId
    first_name: string
    last_name: string
    phone: number
}

interface IAddress{
    country: string
    city: string
    full_address: number
}

interface IPlace{
    bedrooms: number,
    beds: number,
    bathrooms: number,
    floor: string,
    area: number
}

interface IRules{
    smoking: boolean,
    pets: boolean, 
    events: boolean, 
}
interface IReserved{
    reservation_id: Types.ObjectId,
    from: number,
    to: number
}

interface IListing extends Document{
    owner: IOwner
    title: string
    address: IAddress
    place: IPlace
    rules:IRules
    thumbnail: string
    images: string[]
    description: string
    price: number
    type: string
    features: object[]
    reserved: IReserved[]
}

interface IReservation extends Document{
    tenant: IOwner
    listing_owner: IOwner
    listing: Types.ObjectId
    checkIn: string
    checkOut: string
    total_price: number
    price: number
}

interface ISearchQueries{
    searchText: string
    country: string
    type: string
    max_price: number
    min_price: number
}

export {IUser, UserModel, IListing, IReservation, ISearchQueries}