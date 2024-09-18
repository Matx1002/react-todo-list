import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import TodoList from './TodoList';
import Auth from './Auth';

// ProtectedRoute component to protect routes that need authentication
const ProtectedRoute = ({ token, children }) => {
    return token ? children : <Navigate to="/login" />;
};

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    return (
        <Router>
            <Container maxWidth="sm">
                <Box mt={5}>
                    <Typography variant="h4" align="center" gutterBottom>
                        To-Do App
                    </Typography>
                    <Routes>
                        {/* Login/Register route */}
                        <Route path="/login" element={<Auth setToken={setToken} />} />

                        {/* Protected to-do list route */}
                        <Route
                            path="/todos"
                            element={
                                <ProtectedRoute token={token}>
                                    <TodoList token={token} setToken={setToken} />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect any unknown route to login */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Box>
            </Container>
        </Router>
    );
};

export default App;
