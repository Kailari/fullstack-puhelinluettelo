const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const databaseUrl = process.env.MONGODB_URI

console.log('connecting to ', databaseUrl)

mongoose.connect(databaseUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true,
    required: true
  },
  number: {
    type: String,
    minlength: 8
  },
})
personSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
