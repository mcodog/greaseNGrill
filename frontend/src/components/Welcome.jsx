import React, { useEffect, useState, useRef } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { useAuth } from '../auth/AuthContext';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import axiosInstance from '../utils/AxiosInstance';

// import { useState, useEffect,  } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import zIndex from '@mui/material/styles/zIndex';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));


const Welcome = () => {
  const { isAuthenticated, user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('');
  const [options, setOptions] = useState([])
  const observer = useRef();

  const retrieveOps = async () => {
    try {
      const res = await axiosInstance.get(`/api/category`)
      setOptions(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const retrieve = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/product', {
        params: { page, limit: 10, filter },
      });
      const newProducts = res.data.data.filter(product => {
        return filter ? product.category[0]?.title === filter : true;
      });
      
      setProducts(prevProducts => [...prevProducts, ...newProducts]);
      setHasMore(newProducts.length > 0);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  // Use IntersectionObserver to trigger loading of more products when the user scrolls near the bottom
  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: 1.0,
    };

    const loadMoreCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    };

    const observerInstance = new IntersectionObserver(loadMoreCallback, options);
    if (observer.current) {
      observerInstance.observe(observer.current);
    }

    return () => {
      if (observer.current) {
        observerInstance.unobserve(observer.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    retrieve();
    retrieveOps();
  }, [page, filter]); // Fetch products whenever page or filter changes

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const addToCart = async (productId) => {
    const formData = {
      userId: user._id,
      productId: productId,
      quantity: 1,
    };

    try {
      if (!isAuthenticated) {
        alert("Please Log in first.");
        return;
      }

      const res = await axiosInstance.post(`/api/user/add-to-cart`, formData);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value); // Update filter state
    setPage(1); // Reset page when filter is changed
    setProducts([]); // Clear the products for the new filter
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Filter Dropdown */}
      <FormControl sx={{ marginBottom: 2, minWidth: 120 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filter}
          onChange={handleFilterChange}
          label="Category"
        >
          {
            options.length > 0 ? (
              options.map((item, index) => (
                <MenuItem key={zIndex} value={item.title}>{item.title}</MenuItem>
              ))

            ) : (
              null
            )
          }
        </Select>
      </FormControl>

      <Grid container spacing={1}>
        {products && products.length > 0 ? (
          products.map((item, index) => (
            <Grid item xs={2} key={index}>
              <Card sx={{ height: '500px' }}>
                <CardHeader
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={item.title}
                  subheader={`Price: $ ${item.price}`}
                />
                <CardMedia
                  component="img"
                  height="194"
                  image="https://placehold.co/600x400"
                  alt="Paella dish"
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.category[0].title} &nbsp; {item.description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites" onClick={() => { addToCart(item._id); }}>
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No products available.</Typography>
        )}
      </Grid>

      {/* Observer target element for infinite scroll */}
      {loading && <Typography variant="h6">Loading more products...</Typography>}
      <div ref={observer} style={{ height: '50px' }}></div>
    </Box>
  );
};

export default Welcome;