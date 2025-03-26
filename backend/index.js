import app from './src/app.js'
import dotenv from 'dotenv'
import {logger, requestLogger} from './src/utils/winston.js'

dotenv.config()
app.use(requestLogger); // Middleware log request
const PORT = 4000
app.listen(PORT, () => logger.info({ message: `Server running on port ${PORT}` }));
