import React, { useEffect, useState } from 'react';
import { TextField, Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../utils/AxiosInstance';

const ProductForm = () => {
    const [categoryOptions, setCategoryOptions] = useState([]);

    const retrieve = async () => {
        try {
            const res = await axiosInstance.get(`/api/category`)
            setCategoryOptions(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        retrieve()
    }, [])

    const [formData, setFormData] = useState({
        title: "Garlic Parmesan Fries",
        description: "Golden crispy fries tossed in garlic and Parmesan cheese, served with a side of creamy ranch dip.",
        category: "67486fd5ce3e88b7a1dc064e",
        price: 3.50,
        images: []
    });

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
            const res = await axiosInstance.post(`/api/product/`, formData)
            console.log(res)
            window.location.href="/admin"
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

export default ProductForm;
