import express from 'express'
import bodyParser from 'body-parser'
import indexRoutes from './routes/index.js'
import cors from 'cors';



const app = express()


// middleware 
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());


// dbs
import './dbs/init.mongodb.js'

// routes
app.use('/api/v1', indexRoutes)

export default(app)