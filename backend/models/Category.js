import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        },
    description: {
        type: String,
        required: true,
        },
    images: [
        {
            public_id: {
                type: String,
                required:true
            },
            url: {
                type:String,
                required: true
            }
        }
    ]  
    },
    {
        timestamps: true,
    });

    const Category = mongoose.model('Category', categorySchema);
    export default Category;