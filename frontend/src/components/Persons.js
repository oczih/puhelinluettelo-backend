import React from 'react';

const Persons = ({ persons, deletePerson }) => {
  if (!Array.isArray(persons)) return null;
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={deletePerson} value={person.id}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;