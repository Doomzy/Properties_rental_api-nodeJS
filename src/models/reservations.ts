import mongoose, {Schema} from "mongoose"
import { IReservation } from "../types/types.js"
import { NextFunction } from "express"

const ReservationSchema: Schema= new Schema<IReservation>({
    tenant: {
        _id:{type: Schema.ObjectId},
        first_name: {type: String},
        last_name: {type: String},
        phone: {type: Number},
    },
    listing_owner: {
        _id:{type: Schema.ObjectId},
        first_name: {type: String},
        last_name: {type: String},
        phone: {type: Number},
    },
    listing: {
        type: Schema.ObjectId, 
        required:true,
        ref:"Listing"
    },
    checkIn: {
        type: String, 
        required:[true, 'please enter a checkIn Date']
    },
    checkOut: {
        type: String, 
        required:[true, 'please enter a checkOut Date']
    },
    total_price: {
        type: Number, 
        required:[true, 'please enter the total price']
    },
    price: {
        type: Number, 
        required:[true, 'please enter the price']
    }
}, {timestamps: true})

ReservationSchema.pre('validate', function (next:NextFunction) {
    this.total_price = Math.round(
        (Date.parse(this.checkOut)-Date.parse(this.checkIn)) / (1000*60*60*24)
    ) * this.price
    next() 
})

//index for listing checkin checkout
export default mongoose.model<IReservation>("Reservation", ReservationSchema)
