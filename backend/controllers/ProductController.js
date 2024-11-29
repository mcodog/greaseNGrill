import Product from "../models/Product.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'
import Category from '../models/Category.js'

export const getAllProduct = async (request, response) => {
    try {
        const product = await Product.find({})
            .sort({ createdAt: -1 })
            .exec();

        response.status(200).json({
            success: true,
            message: "Product Retrieved.",
            data: product
        });
    } catch (error) {
        console.log("Error in fetching Products: ", error.message);
        response.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
};

export const getProduct = async (request, response) => {
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments();
        const products = await Product.find({})
            .populate('category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        response.status(200).json({
            success: true,
            message: products.length ? "Products Retrieved." : "No products found.",
            data: products,
            pagination: {
                total: totalProducts,
                page,
                pages: Math.ceil(totalProducts / limit),
                limit
            }
        });
    } catch (error) {
        console.log("Error in fetching Products: ", error.message);
        response.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
};

export const getOneProduct = async (request, response) => {
    try {
        const { id } = request.params;
        const product = await Product.findById(id)
            .populate('category')
            .exec();
        response.status(200).json({ success: true, message: "Product Retrieved.", data: product });
    } catch (error) {
        console.log("Error in fetching Product: ", error.message);
        response.status(500).json({ success: false, message: "Server Error." });
    }
};

export const createProduct = async (request, response) => {
    const product = request.body;

    let images = []
    if (typeof request.body.images === 'string') {
        images.push(request.body.images)
    } else {
        images = request.body.images
    }

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        try {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products',
                width: 500,
                height: 500,
                crop: "scale",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        } catch (error) {
            console.log("Cant Upload", error)
        }

    }

    request.body.images = imagesLinks

    if (!product.title || !product.description || !product.category || !product.price ) {
        return response.status(400).json({ success: false, message: "Please provide all fields." });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        const populatedProduct = await Product.findById(newProduct._id);
        response.status(201).json({ success: true, data: populatedProduct, message: "Product created Successfully!" });
    } catch (error) {
        console.error("Error in Create Product:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating Product." });
    }
}

export const updateProduct = async (request, response) => {
    const { id } = request.params;

    let images = []
    if (Array.isArray(request.body.images)) {
        if (typeof request.body.images[0] === 'string') {
            images = request.body.images;
            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                try {
                    const result = await cloudinary.v2.uploader.upload(images[i], {
                        folder: 'products',
                        width: 500,
                        height: 500,
                        crop: "scale",
                    });

                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url
                    })

                } catch (error) {
                    console.log("Cant Upload", error)
                }

            }
            request.body.images = imagesLinks
        } else if (typeof request.body.images[0] === 'object') {
            
        }
    } else if (typeof request.body.images === 'string') {
        images.push(request.body.images);
    }

    const product = request.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        response.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating Product." })
    }
}

export const deleteProduct = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await Product.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'Product not Found.' });
        }

        response.status(200).json({ success: true, message: "Product Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting Product." })
    }
}

const sampleProducts = [
    'Apple', 'Banana', 'Carrot', 'Tomato', 'Potato', 'Broccoli', 'Lettuce', 'Spinach', 'Cucumber', 'Onion',
    'Chicken', 'Beef', 'Pork', 'Salmon', 'Tuna', 'Rice', 'Bread', 'Eggs', 'Cheese', 'Milk'
];

// Seeder function
export const seedProducts = async () => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find({}).select('_id'); // Fetch only the _id field

        if (categories.length === 0) {
            throw new Error('No categories found in the database!');
        }

        // Create products with categories
        const products = sampleProducts.map((productName, index) => ({
            title: `${productName} - Fresh and Organic`,
            description: `This is a high-quality, fresh ${productName}. Perfect for your daily meals.`,
            category: [categories[index % categories.length]._id], // Assign categories cyclically
            price: Math.floor(Math.random() * 20) + 1, // Random price between 1 and 20
            images: [
                {
                    public_id: `food_image_${index + 1}`,
                    url: `https://example.com/images/${productName.toLowerCase()}.jpg`,
                },
            ],
        }));

        // Insert the products into the database
        await Product.insertMany(products);
        console.log('Seeder: Successfully added products.');
    } catch (error) {
        console.error('Seeder: Error seeding products:', error);
    }
};