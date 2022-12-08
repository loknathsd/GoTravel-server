const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfsjf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())

//connection to mongodb


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("GoTravelStore").collection("travels"); 
  const bookingCollection = client.db("GoTravelStore").collection("bookings");
  
  app.post('/addTravel',(req,res)=>{
      const travelData = req.body;
      console.log(travelData)
      collection.insertOne(travelData)
      .then(result=>{
          res.send(result.insertedCount > 0)
      })
  })

  //add booking
  app.post('/addBooking',(req,res)=>{
    const booking = req.body
    bookingCollection.insertOne(booking)
    .then(result=>{
      res.send(result.insertedId >0)
    })
  })

  app.get('/myBookings',(req,res)=>{
    bookingCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })

  })
  //all booking

  app.get('/allBookings',(req,res)=>{
    bookingCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents )
    })
  })
   
  app.get('/travels',(req,res)=>{
      collection.find({})
      .toArray((err,documents)=>{
          res.send(documents)
      })
  })

  app.get('/detailById/:id',(req,res)=>{
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  // delete booking

  app.delete('/delete/:id',(req,res)=>{
      bookingCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=>{
        res.send(result)
      })
  })
  
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)