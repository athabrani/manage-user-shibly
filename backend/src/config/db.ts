import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({

    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']

});

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected');
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Database connection failed : ${error.message}`);
        } else {
            console.log(`Database connection failed : ${String(error)}`);
            process.exit(1);
        }
    }
}

export const disconnectDB = async () => {
    await prisma.$disconnect();
}
