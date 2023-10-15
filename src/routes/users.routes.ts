import {createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser} from '../controllers/users.js'
import {isAuthorized, isAdmin, verifyToken} from '../middlewares/auth.js'

import {Router} from "express"
const router: Router= Router()

router.post('/signup', createUser)
router.post('/login', loginUser)
router.get('/all', isAdmin, getAllUsers)

router.get('/:id', verifyToken,getUser)
router.put('/:id', isAuthorized , updateUser)
router.delete('/:id', isAuthorized, deleteUser)

export default router