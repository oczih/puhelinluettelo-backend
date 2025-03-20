const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => res.json(persons));

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  person ? res.json(person) : res.status(404).json({ error: 'Person not found' });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) return res.status(400).json({ error: 'Name/number missing' });
  if (persons.some(p => p.name === name)) return res.status(400).json({ error: 'Name must be unique' });

  const person = { id: Math.floor(Math.random() * 1000000), name: name.trim(), number: number.trim() };
  persons.push(person);
  res.status(201).json(person);
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
