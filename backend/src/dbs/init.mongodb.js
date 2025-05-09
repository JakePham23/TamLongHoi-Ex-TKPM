import mongoose from 'mongoose'


const connectString =  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/StudentManagementSystem'


// singleton
class Database{
    constructor(){
        this._connect()
    }

    _connect(){
        if(true){
            mongoose.set('debug')
            mongoose.set('debug', {color: true})
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50
        })
        .then(()=>{
            console.log('Connected to MongoDB')
        })
        .catch(err => console.error(err))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}



export default Database.getInstance()