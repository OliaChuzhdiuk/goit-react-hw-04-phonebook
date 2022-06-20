import  { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import ContactForm from './ContactForm/ContactForm';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';
import Section from './Section/Section';

function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(
    () => JSON.parse(window.localStorage.getItem(key)) ?? defaultValue,
  );

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function App() {
  const [contacts, setContacts] = useLocalStorage('contactList', []);
  const [filter, setFilter] = useState('');

  const handleFilterChange = e => {
    setFilter(e.currentTarget.value);
  };

  const filteredContacts = value => {
    const filterNormalize = value.toLowerCase();

    return contacts
      .filter(contact => {
        return contact.name.toLowerCase().includes(filterNormalize);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const contactDelete = id => {
    setContacts(state => state.filter(contact => contact.id !== id));
  };

  const formSubmit = ({ name, number }) => {
    const isContact = contacts.find(contact => contact.name === name);
    if (isContact) {
      alert(`${name} is already in contact`);
    } else {
      setContacts(state => {
        const newContact = {
          id: nanoid(),
          name,
          number,
        };
        return [newContact, ...state];
      });
    }
  };

  return (
    <Section className="section">
      <h1>Phone Book</h1>
      <ContactForm onSubmit={formSubmit} />
      <h2>Contacts</h2>
      <Filter
        title="Find contact by name"
        onChange={handleFilterChange}
        value={filter}
      />
      <ContactList
        filteredContacts={filteredContacts(filter)}
        onDelete={contactDelete}
      />
    </Section>
  );
}

export default App;