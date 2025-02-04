const { MongoClient } = require('mongodb')
let dbconnection
module.exports ={ 
    connectToDB: (cb) =>{
        MongoClient.connect('mongodb://localhost:27017/taskMangement')
        .then((client)=> {
            dbconnection = client.db()
            return cb()
        })
        .catch((err)=> {
            return cb(err)
        })
    },
    getdb: ()=> dbconnection
}