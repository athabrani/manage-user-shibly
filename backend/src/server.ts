import app from './app.ts';
import { ENV } from './config/env.ts';
import { connectDB } from './config/db.ts';

connectDB();

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});