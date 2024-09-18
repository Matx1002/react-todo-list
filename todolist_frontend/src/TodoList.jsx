import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TodoList = ({ token, setToken }) => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchTodos();
    }
  }, [token]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  };

  const addTodo = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post(
            'http://127.0.0.1:5000/todos',
            { task: newTask },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTodos([...todos, response.data]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding todo', error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  const startEdit = (id, task) => {
    setEditingId(id);
    setEditTask(task);
    setOpen(true);
  };

  const handleEdit = async () => {
    if (editTask.trim()) {
      try {
        await axios.put(
            `http://127.0.0.1:5000/todos/${editingId}`,
            { task: editTask },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTodos(todos.map(todo => (todo.id === editingId ? { ...todo, task: editTask } : todo)));
        setOpen(false);
        setEditingId(null);
        setEditTask('');
      } catch (error) {
        console.error('Error updating todo', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
      <Box mt={3}>
        <Typography variant="h5" gutterBottom>
          Welcome to your To-Do List
        </Typography>
        <Button
            variant="contained"
            color="secondary"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
            fullWidth
            sx={{ mb: 2 }}
        >
          Logout
        </Button>
        <TextField
            label="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            fullWidth
            margin="normal"
        />
        <Button variant="contained" color="primary" onClick={addTodo} fullWidth>
          Add Task
        </Button>
        <List>
          {todos.map(todo => (
              <ListItem key={todo.id}>
                <ListItemText primary={todo.task} />
                <IconButton onClick={() => startEdit(todo.id, todo.task)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteTodo(todo.id)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
          ))}
        </List>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
                label="Task"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                fullWidth
                margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default TodoList;
