import User from "../models/User.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'


export const getUser = async (request, response) => {
    try {
        const user = await User.find({})
            .sort({ createdAt: -1 });
            console.log(user)
        response.status(200).json({ success: true, message: "Users Retrieved.", data: user });
    } catch (error) {
        console.log("Error in fetching Users: ", error.message);
        response.status(500).json({ success: false, message: "Server Error." });
    }
};

export const getOneUser = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await User.findById(id).populate({
            path: 'cart.productId',
            model: 'Product'
        });;
        response.status(200).json({ success: true, message: "User Retrieved.", data: user });
    } catch (error) {
        console.log("Error in fetching User: ", error.message);
        response.status(500).json({ success: false, message: "Server Error." });
    }
};

export const createUser = async (request, response) => {
    const user = request.body;

    if (!user.email || !user.password) {
        return response.status(400).json({ success: false, message: "Please provide all fields." });
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        response.status(201).json({ success: true, data: newUser, message: "User created Successfully!" });
    } catch (error) {
        console.error("Error in Create User:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating User." });
    }
}

export const updateUser = async (request, response) => {
    const { id } = request.params;

    let images = []
    // console.log('before', request.body.avatar)
    if (Array.isArray(request.body.avatar)) {
        if (typeof request.body.avatar[0] === 'string') {

            images = request.body.avatar;
            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                try {
                    const result = await cloudinary.v2.uploader.upload(images[i], {
                        folder: 'users',
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
            request.body.avatar = imagesLinks
        } else if (typeof request.body.avatar[0] === 'object') {

        }
    } else if (typeof request.body.avatar === 'string') {
        console.log('detected')
        images.push(request.body.avatar);
    }

    const user = request.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        response.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating User." })
    }
}

export const deleteUser = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'User not Found.' });
        }

        response.status(200).json({ success: true, message: "User Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting User." })
    }
}

export const addToCart = async (req, res) => {
    const { userId, productId, size, quantity } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingItemIndex = user.cart.findIndex(item =>
            item.productId.toString() === productId.toString() && item.size === size
        );

        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            user.cart.push({ productId, size, quantity });
        }

        await user.save();

        return res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
};

export const checkout = async (req, res) => {
    const { userId, shippingDetails, appliedVoucherId } = req.body; 

    try {
        const user = await User.findById(userId).populate({
            path: 'cart.productId',
            model: 'Product'
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.cart.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        let totalCost = 0;
        user.cart.forEach(item => {
            console.log(item)
            totalCost += item.quantity * item.productId.price;
        });

        const order = {
            items: user.cart,
            status: 'Pending',
            shippingDetails,
            applied_voucher: appliedVoucherId || null, 
            total_cost: totalCost
        };

        user.checkout.push({ order });

        user.cart = [];

        await user.save();

        return res.status(200).json({ message: 'Checkout successful', checkout: user.checkout });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error during checkout', error: error.message });
    }
};