import {Router} from "express"
import {isAuthorized, isAdmin, verifyToken} from '../middlewares/auth.js'
import {ownsReservation, ownsListingRes} from '../middlewares/helpers.js'
import {makeReservation, getReservation, getUserReservations, getListingReservations,
    updateReservation, cancelReservation} from '../controllers/reservations.js'
const router: Router= Router()

router.post('', verifyToken, makeReservation)
router.get('/:resid', [verifyToken,ownsReservation], getReservation) //one
router.get('/user/:id', isAuthorized, getUserReservations) //all user
router.get('/listing/:lid', [verifyToken,ownsListingRes], getListingReservations) //all listing
router.put('/:resid', isAdmin, updateReservation)
router.delete('/:resid', isAdmin, cancelReservation)

export default router