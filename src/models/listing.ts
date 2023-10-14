import mongoose, {Schema} from "mongoose"
import {IListing} from '../types/types.js'

const ListingSchema: Schema= new Schema<IListing>({
    owner: { 
        _id:{type: Schema.ObjectId, required: true, immutable:true},
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        phone: {type: Number, required: true}
    },
    title: {
        type: String, 
        required:[true, 'please enter a Title'], 
        minLength:[10, 'The Title should be more than 10 characters']
    },
    place:{
        bedrooms: {type: Number, default:1},
        beds: {type: Number, default:1},
        bathrooms: {type: Number, default:1},
        floor: {type: String},
        area: {type: Number}
    },
    address:{
        country: {type: String},
        city: {type: String},
        full_address: {type: String, required:[true, 'please enter a Address']}
    },
    rules:{
        smoking: {type: Boolean, default: false},
        pets: {type: Boolean, default: false},
        events: {type: Boolean, default: false},
    },
    thumbnail: {
        type: String, 
        required:[true, 'please enter a thumbnail']
    },
    images:[{
        type: String,
        required:[true, 'please provide the listing\'s Images']
    }],
    description:{
        type: String, minLength: 20, 
        required:[true, 'please enter a description']
    },
    type:{
        type: String,
        required: true,
        enum: ["apartment","house","villa", "studio"]
    },
    price:{
        type: Number,
        required:[true, 'please enter a price']
    },
    features:[{
        type: Object
    }],
    reserved: [
		{
			reservation_id: {type: Schema.ObjectId, required: true, immutable:true},
			from: {type:Date, required: true},
			to: {type:Date, required: true},
		}
	],
}, {timestamps: true})


ListingSchema.index({title:'text', description:'text',  type: 'text'})

export default mongoose.model<IListing>("Listing", ListingSchema)