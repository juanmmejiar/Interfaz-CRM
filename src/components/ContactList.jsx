import { Building2, Plus, SearchX } from 'lucide-react'

function getInitials(name) {
  const nameParts = name.split(' ').slice(0, 2)
  return nameParts.map((part) => part[0]).join('').toUpperCase()
}

function ContactList({ contacts, activeContactId, searchTerm, loadState, onSelect, onAddContact, onRestoreSamples }) {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredContacts = contacts.filter((contact) => {
    const searchableText = `${contact.name} ${contact.company}`.toLowerCase()
    return searchableText.includes(normalizedSearch)
  })

  if (loadState === 'loading') {
    return (
      <div className="contact-list loading-list" aria-label="Cargando contactos" aria-busy="true">
        {[1, 2, 3, 4].map((item) => (
          <div className="skeleton-row" key={item}>
            <span className="skeleton-avatar" />
            <span className="skeleton-copy">
              <i />
              <i />
            </span>
          </div>
        ))}
        <span className="sr-only">Cargando contactos</span>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="list-empty" role="alert">
        <span className="empty-icon error-icon">
          <SearchX size={21} />
        </span>
        <h3>No pudimos cargar tus contactos</h3>
        <p>El almacenamiento local no está disponible o contiene datos dañados.</p>
        <button className="text-button" type="button" onClick={onRestoreSamples}>
          Cargar datos de ejemplo
        </button>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="list-empty">
        <span className="empty-icon">
          <Building2 size={21} />
        </span>
        <h3>Tu directorio está vacío</h3>
        <p>Agrega tu primer contacto para empezar.</p>
        <button className="text-button" type="button" onClick={onAddContact}>
          <Plus size={15} />
          Crear contacto
        </button>
      </div>
    )
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="list-empty">
        <span className="empty-icon">
          <SearchX size={21} />
        </span>
        <h3>Sin resultados</h3>
        <p>No hay contactos que coincidan con “{searchTerm}”.</p>
      </div>
    )
  }

  return (
    <ul className="contact-list" aria-label={`${filteredContacts.length} contactos`}>
      {filteredContacts.map((contact) => {
        const isActive = contact.id === activeContactId
        const noteLabel = contact.notes.length === 1 ? '1 nota' : `${contact.notes.length} notas`

        return (
          <li key={contact.id}>
            <button
              className={`contact-row${isActive ? ' contact-row-active' : ''}`}
              type="button"
              onClick={() => onSelect(contact.id)}
              aria-pressed={isActive}
            >
              <span className="contact-avatar">{getInitials(contact.name)}</span>
              <span className="contact-row-copy">
                <span className="contact-row-name">{contact.name}</span>
                <span className="contact-row-company">
                  <Building2 size={12} />
                  {contact.company || 'Sin empresa'}
                </span>
              </span>
              {contact.notes.length > 0 && (
                <span className="note-indicator" title={noteLabel}>
                  {contact.notes.length}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default ContactList