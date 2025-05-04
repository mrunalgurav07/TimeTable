const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')

const app = express()
app.use(cors())

const port = 5000

//schema
const schemaData = mongoose.Schema({
    name : String,
    email : String,
    mobile : Number
},{
    timestamps:true
})

const userModel = mongoose.model("admin",schemaData)

 //create data
app.post('/create',async(req,res) => {
    console.log(req.body)
    const data = new userModel(req.body)
    await data.save()
    res.send({success : true , message : "data save successfully",data : data})
})

//read
// app.get('/',async(req,res) => {
//     const data = await userModel.find({})
//     res.json({success : true , data : data})
// })

//update
// app.put('/update',async(req,res) => {
//     console.log(req.body)
//     const {id,...rest} = req.body

//     console.log(rest);
//     const data = await userModel.updateOne({_id: id},rest)
//     res.send({success : true , message : "data update successfully",data : data})
// })

//delete
// app.delete('/delete/:id',async(req,res) => {
//     const id = req.params.id
//     console.log(id)
//     const data = await userModel.deleteOne({_id: id})
//     res.send({success : true , message : "data delete successfully",data : data})
// })

mongoose.connect('mongodb://127.0.0.1:27017/timetable')
.then(() => {
    console.log("connect to DB")
    app.listen(port,() => console.log("server is running"))
})
.catch((err) => console.log(err))