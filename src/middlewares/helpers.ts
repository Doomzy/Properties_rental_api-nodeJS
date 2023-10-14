import { IListing } from "../types/types.js"
import Listing from '../models/listing.js'
import { Types } from "mongoose"

async function validateDate(fromDate:number, toDate:number, lId: Types.ObjectId, reservationId? :Types.ObjectId){
    const currentDate: number= Date.now()
    if(
        (fromDate <= currentDate) || (toDate <= fromDate) || 
        isNaN(fromDate) || isNaN(toDate) || 
        Math.round((toDate-currentDate) / (1000*60*60*24)) > 365 //one year range
    ){
        return false
    }else{
        const reservedListing: IListing=await Listing.findById(lId)
        for(let resDate of reservedListing.reserved){
            if(resDate.reservation_id.equals(reservationId)){
                continue
            }
            else if(
                (fromDate >= resDate.from && toDate <= resDate.to)||
                (resDate.from >= fromDate && resDate.to <= toDate)||
                (resDate.from >= fromDate && resDate.from <= toDate)||
                (fromDate >= resDate.from && fromDate <= resDate.to)
            ){
                return false
            }
        }
        return reservedListing
    }
}

import Reservation from '../models/reservations.js'
import { Request,Response,NextFunction } from 'express'

//check if reservaion is owned by user
async function ownsReservation(req: Request, res: Response, next: NextFunction){
    const currentUser= req.body.user
    const resid: string= req.params.resid
    if(currentUser.role=== 'admin'){
        req.body.reservation= await Reservation.findById(resid).select("-updatedAt -__v")
        next()
    }else{
        req.body.reservation= await Reservation.findOne(
            {_id:resid, "tenant._id":currentUser.id}
        ).select("-updatedAt -__v")
        next()
    }
}

//check if listing of reservaion is owned by user
async function ownsListingRes(req: Request, res: Response, next: NextFunction){
    const currentUser= req.body.user
    const listingId: string= req.params.lid
    const limit: number= paginator(req)
    if(currentUser.role === "admin"){
        req.body.reservations= await Reservation.find({listing: listingId})
            .select("-updatedAt -__v").limit(limit)
        next()
    }else{
        req.body.reservations= await Reservation.find(
            {listing: listingId, "listing_owner._id": currentUser.id}
        ).select("-updatedAt -__v").limit(limit)
        next()
    }
}

//check if listing is owned by user
async function ownsListing(req: Request, res: Response, next: NextFunction){
    const currentUser= req.body.user
    const listingId: string= req.params.lid
    if(currentUser.role === "admin"){
        req.body.listing= await Listing.findById(listingId)
            .select("-updatedAt -__v")
    }else{
        req.body.listing= await Listing.findOne(
            {_id: listingId, "owner._id": currentUser.id}
        ).select("-updatedAt -__v")
    }

    req.body.listing?
        next()
    :
        res.status(403).json({'err': "Not Authorized!"})
}

function paginator(req: Request){
    const pageNo: number= +req.query.page || 1
    return pageNo * 15
}

export {validateDate, ownsReservation, ownsListingRes ,ownsListing, paginator}