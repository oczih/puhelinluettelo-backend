import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [personsToShow, setPersonsToShow] = useState([]);
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState('');

  const goodMessage = (message) => {
    setMessage(message);
    setTimeout(() => setMessage(''), 3000);
  };

  const alertMessage = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(''), 3000);
  };

  const URL = '/api/persons';

  const create = (newPerson) =>
    axios.post(URL, newPerson).then((response) => response.data);

  const getAll = () =>
    axios.get(URL).then((response) => response.data);

  const deletePerson = (id) =>
    axios.delete(`${URL}/${id}`).then((response) => response.data);

  const replace = (id, newPerson) =>
    axios.put(`${URL}/${id}`, newPerson).then((response) => response.data);

  useEffect(() => {
    getAll()
      .then((notes) => {
        if (Array.isArray(notes)) {
          setPersons(notes);
          setPersonsToShow(notes);
        }
      })
      .catch(() => {
        setPersons([]);
        setPersonsToShow([]);
      });
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const handleFilterChange = (event) => {
    const condition = event.target.value.toLowerCase();
    setFilter(event.target.value);
    setPersonsToShow(persons.filter((person) =>
      person.name.toLowerCase().includes(condition)
    ) || []);
  };

  const newContact = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    const existingPerson = persons.find((person) => person.name === newName);

    if (!existingPerson) {
      create(newPerson)
        .then((addedPerson) => {
          const updatedPersons = [...persons, addedPerson];
          setPersons(updatedPersons);
          setPersonsToShow(updatedPersons);
          goodMessage(`Added ${newName}`);
        })
        .catch((error) => alertMessage(error.response?.data?.error || 'Error'));

      setNewName('');
      setNewNumber('');
      setFilter('');
    } else if (window.confirm(`Do you want to replace ${newName}'s number?`)) {
      replace(existingPerson.id, newPerson)
        .then((updatedPerson) => {
          const updatedPersons = persons.map((p) =>
            p.id === existingPerson.id ? updatedPerson : p
          );
          setPersons(updatedPersons);
          setPersonsToShow(updatedPersons);
          goodMessage('Number was changed.');
        })
        .catch(() => alertMessage('Contact no longer exists. Refresh the page.'));
    }
  };

  const deletePersonHandler = (event) => {
    const id = event.target.value;
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const remainingPersons = persons.filter((p) => p.id !== parseInt(id));
      setPersons(remainingPersons);
      setPersonsToShow(remainingPersons);

      deletePerson(id).then(() => goodMessage('Deleted successfully.'));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} />
      <Alert message={alert} />
      <Filter value={filter} handleFilterChange={handleFilterChange} />
      <Form
        onSubmitButton={newContact}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePersonHandler} />
    </div>
  );
};

const Form = ({ onSubmitButton, nameValue, onNameChange, numberValue, onNumberChange }) => (
  <form onSubmit={onSubmitButton}>
    <div>Name: <input value={nameValue} onChange={onNameChange} /></div>
    <div>Number: <input value={numberValue} onChange={onNumberChange} /></div>
    <div><button type="submit">Add</button></div>
  </form>
);


const Message = ({ message }) => message ? <div className="goodMessage">{message}</div> : null;

const Alert = ({ message }) => message ? <div className="alertMessage">{message}</div> : null;

export default App;
