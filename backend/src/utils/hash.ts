import bcrypt from 'bcrypt';

export const hashPassword = async (pwd: string) => await bcrypt.hash(pwd, 10);
export const comparePassword = async (pwd: string, hash: string) => await bcrypt.compare(pwd, hash);