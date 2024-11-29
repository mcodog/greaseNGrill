import React, { useEffect, useState } from 'react';
import { TextField, Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../utils/AxiosInstance';
import { useParams } from 'react-router-dom';

const ProductEdit = () => {
    const { id } = useParams()
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [productInfo, setProductInfo] = useState({})

    const retrieve = async () => {
        try {
            const res = await axiosInstance.get(`/api/category`)
            setCategoryOptions(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const retrieveProductInfo = async () => {
        try {
            const res = await axiosInstance.get(`/api/product/${id}`)
            setProductInfo(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        retrieve()
        retrieveProductInfo()
    }, [])

    const [formData, setFormData] = useState({
        title: "Garlic Parmesan Fries",
        description: "Golden crispy fries tossed in garlic and Parmesan cheese, served with a side of creamy ranch dip.",
        category: "67486fd5ce3e88b7a1dc064e",
        price: 3.50,
        images: []
    });

    useEffect(() => {
        console.log(productInfo)
        if (productInfo) {
            setFormData((prev) => ({
                ...prev,
                title: productInfo.title || "",
                description: productInfo.description || "",
                category: Array.isArray(productInfo.category) && productInfo.category.length > 0 ? productInfo.category[0]._id : "",
                price: productInfo.price || 0,
                images: productInfo.images || []
            }));
        }
    }, [productInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {   
            const res = await axiosInstance.put(`/api/product/${id}`, formData)
            window.location.href = '/admin'
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 'auto' }}
            onSubmit={handleSubmit}
            
        >
            <Typography variant="h4" gutterBottom>
                Create a new Product
            </Typography>

            <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
            />
            <FormControl fullWidth>
                <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    {categoryOptions.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                            {option.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );
};

export default ProductEdit;
