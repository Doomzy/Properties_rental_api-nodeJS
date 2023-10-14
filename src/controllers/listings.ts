import {Request, Response} from 'express'
import Listing from '../models/listing.js'
import User from '../models/user.js'
import {IListing, ISearchQueries, IUser} from '../types/types.js'
import { paginator } from '../middlewares/helpers.js'

async function addListing(req: Request, res: Response){
    const listingData: IListing= req.body.data
    const uid: string= req.body.user.id
    try{
        const currentUser: IUser= await User.findById(uid)
            .select("first_name last_name phone") 
        if(req.body.user.role=== 'owner'){
            const newListing: IListing= await Listing.create({
                owner:currentUser, ...listingData
            })
            res.status(201).json(newListing)
        }else{
            res.status(403).json({'err': "Not Authorized!"})
        }
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function listingDetails(req: Request, res: Response){
    const listingId: string= req.params.lid
    try{
        const listingDetails: IListing= await Listing.findById(listingId)
            .select("-updatedAt -__v -reserved")
        listingDetails?
            res.status(200).json(listingDetails)
        :
            res.status(404).json({'msg': 'No listing With this id'})
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function getOwnerListings(req: Request, res: Response){
    const ownerId: string= req.params.id
    const limit: number= paginator(req)
    try{
        const OwnerListings: Object= await Listing.find({"owner._id": ownerId})
            .select("-updatedAt -__v -reserved -owner").limit(limit)
        OwnerListings?
            res.status(200).json(OwnerListings)
        :
            res.status(404).json({'msg': 'No listings for this user'})
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function searchListings(req: Request, res: Response){
    try{
        const limit: number= paginator(req)
        const sentQueries: ISearchQueries= req.body
        const searchQueries: object= {}
        if(sentQueries.searchText){
            searchQueries['$text']= {$search: sentQueries.searchText}
        }
        if(sentQueries.country){
            searchQueries['address.country']= sentQueries.country
        }
        if(sentQueries.max_price || sentQueries.min_price){
            searchQueries['price']= 
                { $lte: sentQueries.max_price || 1000000000, $gte: sentQueries.min_price || 0 }
        }
        if(sentQueries.type){
            searchQueries['type']= sentQueries.type
        }
        await Listing.find({
            ...searchQueries
        }).select("-updatedAt -__v -reserved").limit(limit)
        .then((resullt)=> {
            resullt.length > 0?
                res.status(200).json(resullt)
            :
                res.status(404).json({'msg': "No matches for this search"})
        })
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function updateListing(req: Request, res: Response){
    try{
        const updatedListing: IListing= req.body.listing
        const updateData: IListing= req.body.data
        delete updateData.reserved, delete updateData.owner
        await updatedListing.updateOne(updateData)
        res.status(201).json({'msg': "Listing updated successfully!"})
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

async function deleteListing(req: Request, res: Response){
    try{
        const deleteListing: IListing= req.body.listing
        const currentDate: number= Date.now()
        for(let resDate of deleteListing.reserved){
            if(resDate.to >= currentDate){
                return res.status(403).json({"err": "Cannot delete there are reservations that have not passed"})
            }
        }
        await deleteListing.deleteOne()
        res.status(200).json({'msg': 'Listing Deleted successfully!'})
    }catch(e){
        res.status(500).json({err: e.message})
    }
}

export {addListing, listingDetails, getOwnerListings, searchListings, updateListing, deleteListing}