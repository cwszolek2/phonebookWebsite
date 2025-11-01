//On 3.10
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', function(req, res) {
    if(req.method === 'POST') {
        return JSON.stringify(req.body);
    }
})
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/phonebook', (request, response) => {
  response.json(phonebook)
})

app.get('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    const phonebookEntry = phonebook.find(entry => entry.id === id)

    if(phonebookEntry) {
        response.json(phonebookEntry)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const message = 
    `<p>Phonebook has info for ${phonebookSize()} people</p>` +
    `<p> ${new Date()} </p>`

    response.send(message);
})

app.post('/api/phonebook', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    } else if(phonebook.some(entry => entry.name === body.name)) {
        return response.status(400).json({ 
            error: 'name already exists' 
        })
    }
    
    const createdId = Math.floor(Math.random() * 100000000000)
    const entry = {
        name: body.name,
        number: body.number,
        id: createdId
    }
    //console.log(body)

    phonebook = phonebook.concat(entry)

    response.json(entry)
})

app.delete('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(entry => entry.id !== id) 

    response.status(204).end()
})

const phonebookSize = () => {
    return phonebook.length;
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})