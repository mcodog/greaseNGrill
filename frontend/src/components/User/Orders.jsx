import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import { useAuth } from '../../auth/AuthContext';
import { Box, Card, CardContent, Typography, LinearProgress, Grid, Divider } from '@mui/material';
import moment from 'moment'; // For formatting date

const Orders = () => {
    const { isAuthenticated, user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [orderInfo, setOrderInfo] = useState({});

    const retrieve = async () => {
        try {
            const res = await axiosInstance.get(`/api/user/${user._id}`);
            setOrders(res.data.data.checkout);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            retrieve();
        }
    }, [isAuthenticated]);

    const getOrderProgress = (status) => {
        switch (status) {
            case 'Pending':
                return 30; // 30% progress for Pending
            case 'Shipped':
                return 60; // 60% progress for Shipped
            case 'Delivered':
                return 100; // 100% for Delivered
            case 'Cancelled':
                return 0; // 0% for Cancelled
            case 'Dine In':
                return 50; // Assuming 50% for Dine In (example)
            default:
                return 0;
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>My Orders</Typography>
            {orders.length === 0 ? (
                <Typography>No orders found</Typography>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" color="primary">Order ID: {order._id}</Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                                        Date Placed: {moment(order.order.datePlaced).format('MMMM Do YYYY, h:mm:ss a')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                        Shipping Details: {order.order.shippingDetails}
                                    </Typography>
                                    <Divider sx={{ marginBottom: 2 }} />
                                    
                                    <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>Items:</Typography>
                                    {order.order.items.map((item) => (
                                        <Box key={item._id} sx={{ marginBottom: 1 }}>
                                            <Typography variant="body2">
                                                Product ID: {item.productId} | Quantity: {item.quantity}
                                            </Typography>
                                        </Box>
                                    ))}

                                    <Divider sx={{ marginBottom: 2 }} />
                                    <Typography variant="h6" color="primary">Total Cost: ${order.order.total_cost}</Typography>
                                    
                                    <LinearProgress
                                        variant="determinate"
                                        value={getOrderProgress(order.order.status)}
                                        sx={{ marginTop: 2 }}
                                    />
                                    <Box sx={{ marginTop: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Status: {order.order.status}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default Orders;
