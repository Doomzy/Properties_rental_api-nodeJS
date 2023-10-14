import {Request, Response} from 'express'
import Reservation from '../models/reservations.js'
import {paginator, validateDate} from '../middlewares/helpers.js'
import User from '../models/user.js'
import Listing from '../models/listing.js'
import {IListing, IReservation, IUser} from '../types/types.js'

async function makeReservation(req: Request, res: Response){
    try{    
        const reservationData: IReservation= req.body.data
        const uid: string= req.body.user.id

        const fromDate: number= Date.parse(reservationData.checkIn)
        const toDate: number= Date.parse(reservationData.checkOut)
        const validListing: IListing | boolean= await validateDate(
            fromDate, toDate, reservationData.listing
        )
        if(validListing === false){
            res.json({"err": "Invalid checkIn or checkOut date"})
        }
        else if(req.body.user.role=== 'tenant'){
            const currentUser: IUser= await User.findById(uid)
                .select("first_name last_name phone")
            const newReservation= await Reservation.create({
                tenant:currentUser, price: validListing.price,
                listing_owner: validListing.owner ,...reservationData
            })
            validListing.reserved.push(
                {
                    reservation_id:newReservation._id, 
                    from:fromDate, to:toDate
                }
                )
            await validListing.save()
            res.status(201).json(newReservation)
        }else{
            res.status(403).json({'err': "Not Authorized!"})
        }
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function getReservation(req: Request, res: Response){
    try{
        const currentRes: IReservation= req.body.reservation
        currentRes?
            res.status(200).json(currentRes)
        :
            res.status(403).json({'err': "Not Authorized!"})
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function getUserReservations(req: Request, res: Response){
    try{
        const tenantId: string= req.params.id
        const limit: number= paginator(req)
        const tenantRes: Object= await Reservation.find({"tenant._id": tenantId})
            .select("-updatedAt -__v -tenant").limit(limit)
        tenantRes?
            res.status(200).json(tenantRes)
        :
            res.status(404).json({'msg': 'No Reservations for this user'})
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function getListingReservations(req: Request, res: Response){
    try{
        const listinRes: IReservation[]= req.body.reservations
        listinRes.length > 0?
            res.status(200).json(listinRes)
        :
            res.status(404).json({'msg': 'No Reservations for this Listing'})
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function updateReservation(req: Request, res: Response){
    try{
        const resId: string= req.params.resid
        const updateData: IReservation= req.body.data
        const fromDate: number= Date.parse(updateData.checkIn)
        const toDate: number= Date.parse(updateData.checkOut)
        const updatedReservation: IReservation= await Reservation.findById(resId)
        const validListing: IListing | boolean= await validateDate(
            fromDate, 
            toDate, 
            updatedReservation.listing,
            updatedReservation._id
        )
        if(validListing === false){
            res.json({"err": "Invalid checkIn or checkOut date"})
        }
        else{
            updatedReservation.set({
                checkIn: updateData.checkIn, checkOut: updateData.checkOut
            })
            const reservationIndex: number= validListing.reserved.findIndex(
                res=> res.reservation_id.equals(updatedReservation._id)
            )
            await updatedReservation.save()
            .then(async (result)=> {
                if(result){
                    validListing.reserved[reservationIndex].from= fromDate
                    validListing.reserved[reservationIndex].to= toDate
                    await validListing.save()
                    res.status(201).json(result)
                }else{
                    res.status(500).json({"err": "something went wrong"})
                }
            })
        }
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function cancelReservation(req: Request, res: Response){
    try{
        const resId: string= req.params.resid
        await Reservation.findByIdAndDelete(resId)
        .then(async(deletedRes: IReservation)=>{
            if(deletedRes){
                await Listing.findByIdAndUpdate(deletedRes.listing,
                    {$pull:{ reserved:{reservation_id: resId} }}
                )
                res.status(200).json({"msg": "Reservation Canceled Successfully"})
            }else{
                res.status(500).json({"err": "something went wrong"})
            }
        })
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

export {makeReservation, getReservation, getUserReservations, getListingReservations,
    updateReservation, cancelReservation}