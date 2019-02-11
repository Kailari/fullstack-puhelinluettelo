const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()
app.use(express.static('build'))
app.use(bodyParser.json())

// Log everything except POST-requests with 'tiny' formatting. Use custom format
// and token for POST-requests.
app.use(morgan(
  'tiny',
  { skip: (req, res) => req.method === 'POST' }
))
morgan.token('post-content', (req, res) => JSON.stringify(req.body))
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :post-content',
  { skip: (req, res) => req.method !== 'POST' }
))


const PORT = process.env.PORT || 3001
const ID_MAX = Number.MAX_SAFE_INTEGER

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "045-1236543"
  },
  {
    id: 2,
    name: "Arto Järvinen",
    number: "041-21423123"
  },
  {
    id: 3,
    name: "Lea Kutvonen",
    number: "040-4323234"
  },
  {
    id: 4,
    name: "Martti Tienari",
    number: "09-784232"
  }
]

const generateId = () => {
  const idCandidate = Math.floor(Math.random() * ID_MAX)
  if (!persons.find(person => person.id === idCandidate)) {
    return idCandidate
  } else {
    return generateId()
  }
}

const nameMatches = (a, b) => {
  return a.toLocaleLowerCase() === b.toLocaleLowerCase()
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (body.number === undefined) {
    return res.status(400).json({
      error: 'number missing'
    })
  } else if (persons.find(person => nameMatches(person.name, body.name))) {
    return res.status(400).json({
      error: 'duplicate name'
    })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
    <p>${new Date()}</p>
  `)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
