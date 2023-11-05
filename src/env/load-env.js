import path from 'path';
import { config as dotenvConfig } from 'dotenv';

export default dotenvConfig({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});
