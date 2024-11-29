import mongoose, { Schema } from 'mongoose';

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ],
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0.00
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    // stock: [
    //     {
    //         color: {
    //             type: String,
    //             required: true,
    //         },
    //         size: {
    //             type: String,
    //             required: true
    //         },
    //         quantity: {
    //             type:Number,
    //             required: false,
    //             default: 1
    //         }
    //     }
    // ],
    // reviews: [
    //     {
    //         userId: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'Category',
    //             required: true
    //         },
    //         rating: {
    //             type: Number,
    //             required: true,
    //         },
    //         review: {
    //             type: String,
    //             required: false
    //         }
    //     }
    // ]
},
    {
        timestamps: true,
    });

const Product = mongoose.model('Product', productSchema);
export default Product;