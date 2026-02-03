import type { Request, Response } from 'express';
import * as userService from './user.services.ts';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUserService(req.body);
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user. Username might exist.' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsersService();
  res.json(users);
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    await userService.updateUserService(Number(req.params.id), req.body);
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user' });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUserService(Number(req.params.id));
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};