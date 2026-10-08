import { useEffect, useState } from 'react'
import { sampleContacts } from '../data/contacts.js'

// Se conserva esta clave para mantener los contactos ya guardados.
const STORAGE_KEY = 'norte-crm-contacts'

function useContacts() {
  const [contacts, setContacts] = useState([])
  const [activeContactId, setActiveContactId] = useState(null)
  const [loadState, setLoadState] = useState('loading')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedContacts = window.localStorage.getItem(STORAGE_KEY)
        const savedList = savedContacts ? JSON.parse(savedContacts) : sampleContacts

        if (!Array.isArray(savedList)) {
          throw new Error('Los contactos guardados no tienen un formato válido.')
        }

        let phoneWasUpdated = false
        const initialContacts = savedList.map((contact) => {
          const sampleContact = sampleContacts.find((sample) => sample.id === contact.id)
          if (!sampleContact) return contact

          const oldPhone = sampleContact.phone.replace('+57', '+34')
          if (contact.phone !== oldPhone) return contact

          phoneWasUpdated = true
          return { ...contact, phone: sampleContact.phone }
        })

        if (phoneWasUpdated) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContacts))
        }

        setContacts(initialContacts)
        setActiveContactId(initialContacts[0]?.id ?? null)
        setLoadState('ready')
      } catch {
        setLoadState('error')
      }
    }, 350)

    return () => window.clearTimeout(timer)
  }, [])

  const activeContact = contacts.find((contact) => contact.id === activeContactId) ?? null

  function saveContacts(nextContacts) {
    setContacts(nextContacts)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContacts))
      setLoadState('ready')
    } catch {
      setLoadState('error')
    }
  }

  function createContact(contact) {
    saveContacts([contact, ...contacts])
    setActiveContactId(contact.id)
  }

  function addNote(contactId, noteText) {
    const newNote = {
      id: crypto.randomUUID(),
      text: noteText,
      createdAt: new Date().toISOString(),
    }

    const nextContacts = contacts.map((contact) => {
      if (contact.id !== contactId) return contact

      return {
        ...contact,
        notes: [newNote, ...contact.notes],
      }
    })

    saveContacts(nextContacts)
  }

  function restoreSampleData() {
    saveContacts(sampleContacts)
    setActiveContactId(sampleContacts[0]?.id ?? null)
  }

  return {
    contacts,
    activeContact,
    activeContactId,
    loadState,
    setActiveContactId,
    createContact,
    addNote,
    restoreSampleData,
  }
}

export default useContacts