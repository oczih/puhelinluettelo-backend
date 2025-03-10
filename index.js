const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());

morgan.token('personData', (req) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify({name: req.body.name, number: req.body.number});
  }
  return '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personData'));

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];


app.get('/api/persons', (req, res) => {
  res.json(persons);
});


app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);

  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const personExists = persons.some(person => person.id === id);
  
  if (!personExists) {
    return res.status(404).json({ error: 'Person not found' });
  }

  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});


app.get('/info', (req, res) => {
  const count = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
});
const generateId = () => {
  let id;
  do {
    id = Math.floor(Math.random() * 1000000);
  } while (persons.some(person => person.id === id));
  return id;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name/number missing' });
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ error: 'Name must be unique' });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name.trim(),
    number: body.number.trim()
  };

  persons.push(person);
  response.status(201).json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
