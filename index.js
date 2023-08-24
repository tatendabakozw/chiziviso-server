const express = require('express')
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 5500
 
app.listen(PORT, (err)=>{
    if(err){
        console.log(`ERROR - ${err}`)
    }
    console.log(`Server up on port ${PORT}`)
})