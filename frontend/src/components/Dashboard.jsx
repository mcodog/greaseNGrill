import '../styles/AdminCommon.css'

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import { FaPlus, FaTrash } from "react-icons/fa";

import axiosInstance from '../utils/AxiosInstance';

const Dashboard = () => {
    const [flattenedData, setFlattenedData] = useState([])
    const [rows, setRows] = useState([])
    const retrieve = async () => {
        try {
            const res = await axiosInstance(`/api/product`)
            setRows(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        retrieve()
    }, [])

    useEffect(() => {
        if (rows.length > 0) {
            const flattened = rows.map(item => ({
                _id: item._id,
                title: item.title,
                description: item.description,
                price: item.price,
                category: (typeof item.category === 'string')
                    ? item.category
                    : (Array.isArray(item.category) && item.category.length > 0)
                        ? item.category[0].title
                        : 'N/A',
                specialization: (typeof item.specialization === 'string')
                    ? item.specialization
                    : (Array.isArray(item.specialization) && item.specialization.length > 0)
                        ? item.specialization[0].title
                        : 'N/A',
                courseContents: item.courseContents,
                createdAt: new Date(item.createdAt).toLocaleString(),
                updatedAt: new Date(item.updatedAt).toLocaleString(),
            }));
            setFlattenedData(flattened);
            console.log(flattened)
        }

    }, [rows]);


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
            valueGetter: (row) => {
                if (row) {
                    return row._id || null;
                }
                return null;
            }
        },
        {
            field: 'title',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'description',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'price',
            headerName: 'Age',
            type: 'number',
            width: 200,
            editable: true,
        },
        {
            field: 'category',
            headerName: 'Category',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params) => {
                if (params && params.row) {
                    return params.row.title || "Null";
                }
                console.log(params)
                return "Null";
            }
        },
    ];

    const handleCheck = (id, isChecked) => {
        setCheckedId((prevCheckedId) => {
            if (isChecked) {
                return [...prevCheckedId, id];
            } else {
                return prevCheckedId.filter((item) => item !== id);
            }
        });
    };

    const deleteRow = async (id) => {
        try {
            const res = await axiosInstance.delete(`/api/product/${id}`)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    const loadContents = async (id) => {
        try {
          const res = await axios.get(`http://localhost:8000/api/product/${id}`)
          setContentData(res)
          setContentModal(true)
        } catch (e) {
          console.log(e)
        }
      }

    return (
        <div className="admin-page__container">
            <div className="dashboard-controls">
                <Link to="/admin/product/add"><button>Create New</button></Link>
            </div>
            <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: 'auto' }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="center">
                                {/* <Checkbox
                        checked={checked[0] && checked[1]}
                        indeterminate={checked[0] !== checked[1]}
                        onChange={handleChange1}
                      /> */}
                            </TableCell>

                            <TableCell>ID</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right" width={220}>Price</TableCell>
                            <TableCell align="right">Category</TableCell>
                            {/* <TableCell align="right">Instructor</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {flattenedData.length > 0 ? (
                            flattenedData.map((row) => (
                                <Row key={row._id} row={row} handleCheck={handleCheck} deleteRow={deleteRow} loadContents={loadContents} />
                            ))
                        ) : (
                            <div className="table-placeholder">No Data Available</div>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

function Row(props) {
    const { row, handleCheck, loadEditModal, deleteRow, loadContents } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <Checkbox
                        inputProps={{ 'aria-label': 'controlled' }}
                        onChange={(e) => handleCheck(row._id, e.target.checked)}
                    />
                </TableCell>
                <TableCell component="th" scope="row">{row._id}</TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">$ {row.price}</TableCell>
                <TableCell align="right">{row.category}</TableCell>
                {/* <TableCell align="right">{row.instructor}</TableCell> */}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, width: '100%' }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {/* <Typography variant="h6" gutterBottom component="div">
                                Course Contents
                            </Typography> */}
                            <Table size="small" aria-label="purchases">
                                {/* <TableHead>
                                    <TableRow>
                                        <TableCell>Content Type</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell align="right">Description</TableCell>
                                        <TableCell align="right">Duration</TableCell>
                                    </TableRow>
                                </TableHead> */}
                                <TableBody>
    
                                </TableBody>
                            </Table>
                        </Box>
                        {
                            row.courseContents && row.courseContents.length == 0 ? (
                                <div className="table-placeholder">
                                    No Data Available
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        <div className="collapsible-table__controls">
                        </div>
                        <div className="collapsible-table__controls">
                            <Button className='collapsible-control__item delete' variant="contained" onClick={() => { deleteRow(row._id) }}>Delete</Button>
                            <Link to={`/admin/product/${row._id}`}><Button className='collapsible-control__item update' variant="contained">Update</Button></Link>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default Dashboard