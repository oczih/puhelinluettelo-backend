import React from 'react';

const Persons = ({ persons, onDelete }) => {
  console.log('Rendering Persons component with persons:', persons);
  return (
    <div>
      {persons.map(person => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;