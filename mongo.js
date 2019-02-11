const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.error('usage: node mongo.js <password> [<name> <number>]')
}

const PASSWORD = process.argv[2]
const databaseUrl = `mongodb+srv://fullstack:${PASSWORD}@fullstack-cluster-gzcaq.mongodb.net/test?retryWrites=true`

mongoose.connect(databaseUrl, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
  Person.find({}).then(result => {
    console.log('puhelinluettelo:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`lisättiin ${person.name} numero ${person.number} luetteloon`)
    mongoose.connection.close()
  })
}