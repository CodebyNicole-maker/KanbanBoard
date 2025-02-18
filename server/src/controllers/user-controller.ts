import { Request, Response } from 'express';
import { User } from '../models/user.js';

// Helper function to find user by ID
const findUserById = async (id: string, res: Response) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return null;
  }
  return user;
};

// GET /Users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : error });
  }
};

// GET /Users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await findUserById(req.params.id, res);
    if (user) res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error instanceof Error ? error.message : error });
  }
};

// POST /Users
export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const newUser = await User.create({ username, password });
    res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username } });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error instanceof Error ? error.message : error });
  }
};

// PUT /Users/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await findUserById(req.params.id, res);
    if (!user) return;

    const { username, password } = req.body;
    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();
    res.json({ message: 'User updated successfully', user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error instanceof Error ? error.message : error });
  }
};

// DELETE /Users/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await findUserById(req.params.id, res);
    if (!user) return;

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error instanceof Error ? error.message : error });
  }
};
