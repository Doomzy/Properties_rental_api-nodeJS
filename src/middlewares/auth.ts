import { Request,Response,NextFunction } from 'express'
import JWT from 'jsonwebtoken'

function generateToken(id: string, role: string) :string{
    return JWT.sign({id, role}, process.env.JWT_KEY, {expiresIn: 5*24*60*60})
}

function verifyToken(req: Request, res: Response, next: NextFunction){
    const sentToken: string | string[] =  req.headers.token
    if(sentToken){
        JWT.verify(sentToken.toString(), process.env.JWT_KEY, (err: Error, user: Object)=>{
            if(err){
                res.status(403).json({"err": "Invalid Token"})
            }else{
                req.body.user= user
                next()
            }     
        })
    }else{
        res.status(401).json({"err": "Not authenticated!"})
    }
}

function isAuthorized(req: Request, res: Response, next: NextFunction){
    verifyToken(req, res, ()=>{
        const currentUser= req.body.user
        if(currentUser.role=== 'admin' ||  currentUser.id=== req.params.id){
            next()
        }else{
            res.status(403).json({'err': "Not Authorized!"})
        }
    })
}

function isAdmin(req: Request, res: Response, next: NextFunction){
    verifyToken(req, res, ()=>{
        const currentUser= req.body.user
        if(currentUser.role=== 'admin'){
            next()
        }else{
            res.status(403).json({'err': "Not Authorized!"})
        }
    })
}

export {generateToken, verifyToken, isAuthorized, isAdmin}