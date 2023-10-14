import express, {Express} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import usersRouter from './routes/users.routes.js'
import listingsRouter from './routes/listings.routes.js'
import reservationsRouter from './routes/reservations.routes.js'

const app: Express= express()
dotenv.config()
app.use(express.json())
app.use(cors())

async function StartApp(){
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=> console.log('DB connected!'))
    .catch(e=> console.log(e))

    app.listen(process.env.PORT, async()=>{
        console.log(`server runing on Port: ${process.env.PORT}`)
    })
}

app.use("/users", usersRouter)
app.use("/listings", listingsRouter)
app.use("/reservations", reservationsRouter)

StartApp()

