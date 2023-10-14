import {Router} from "express"
import {verifyToken} from '../middlewares/auth.js'
import {ownsListing} from '../middlewares/helpers.js'
import {addListing, listingDetails, getOwnerListings, 
    searchListings, updateListing, deleteListing} from '../controllers/listings.js'
const router: Router= Router()

router.post('', verifyToken, addListing)
router.get('/:lid', listingDetails) //one
router.get('/user/:id', getOwnerListings) //all owner's listings
router.post('/search', searchListings) //search
router.put('/:lid', [verifyToken,ownsListing], updateListing)
router.delete('/:lid', [verifyToken,ownsListing], deleteListing)

export default router