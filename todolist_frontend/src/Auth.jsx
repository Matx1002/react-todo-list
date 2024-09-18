import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'success' or 'error'
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5001/login', {
                username,
                password,
            });
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            setToken(token);
            navigate('/todos'); // Redirect to the todos page
        } catch (error) {
            setSnackbarMessage('Invalid credentials, please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const register = async () => {
        try {
            await axios.post('http://127.0.0.1:5001/register', {
                username,
                password,
            });
            login(); // Automatically log in after successful registration
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.msg === 'Username already exists') {
                setSnackbarMessage('User already exists, please try a different username.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } else {
                setSnackbarMessage('Registration failed, please try again.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        }
    };


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box mt={3}>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                    <Button variant="contained" color="primary" onClick={login} fullWidth>
                        Login
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" color="secondary" onClick={register} fullWidth>
                        Register
                    </Button>
                </Grid>
            </Grid>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Auth;
