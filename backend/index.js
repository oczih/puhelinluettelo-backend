require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(morgan(':method :url - :body'));
app.use(express.static('build'));


morgan.token('body', (req) => JSON.stringify(req.body));


const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted ID' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};


const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'Unknown endpoint' });
};

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});


app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(people => res.json(people))
    .catch(error => next(error));
});


app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});


app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (!updatedPerson) {
        return res.status(404).json({ error: 'Person not found' });
      }
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});


app.delete('/api/persons/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  Person.findByIdAndDelete(req.params.id)
    .then(deletedPerson => {
      if (!deletedPerson) {
        return res.status(404).json({ error: 'Person not found' });
      }
      res.status(204).end();
    })
    .catch(error => next(error));
});


app.get('/info', (req, res) => {
  Person.countDocuments().then(count => {
    const date = new Date();
    res.send(`Phonebook has info for ${count} people at ${date}`);
  });
});


app.use(unknownEndpoint);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
