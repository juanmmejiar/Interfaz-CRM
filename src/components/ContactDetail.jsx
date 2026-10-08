import { useState } from 'react'
import { Building2, CalendarDays, Mail, MessageSquareText, Phone, Send } from 'lucide-react'

function getInitials(name) {
  const nameParts = name.split(' ').slice(0, 2)
  return nameParts.map((part) => part[0]).join('').toUpperCase()
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function ContactDetail({ contact, onAddNote }) {
  const [noteText, setNoteText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const note = noteText.trim()
    if (note === '') return

    onAddNote(contact.id, note)
    setNoteText('')
  }

  return (
    <article className="contact-detail" aria-labelledby="contact-name-heading">
      <div className="detail-topline">
        <span>FICHA DE CONTACTO</span>
        <span className="detail-id">ID · {contact.id.slice(-4).toUpperCase()}</span>
      </div>

      <div className="profile-block">
        <div className="profile-avatar">{getInitials(contact.name)}</div>
        <div className="profile-copy">
          <h2 id="contact-name-heading">{contact.name}</h2>
          <p>
            <Building2 size={14} />
            {contact.company || 'Sin empresa'}
          </p>
        </div>
        <span className="status-chip">
          <i />
          Activo
        </span>
      </div>

      <section className="info-section" aria-labelledby="contact-info-heading">
        <div className="section-heading">
          <h3 id="contact-info-heading">Información</h3>
          <span>DATOS PRINCIPALES</span>
        </div>

        <ul className="info-grid">
          <li>
            <a className="info-item" href={`mailto:${contact.email}`}>
              <span className="info-icon"><Mail size={16} /></span>
              <span>
                <small>Correo electrónico</small>
                <strong>{contact.email}</strong>
              </span>
            </a>
          </li>
          <li>
            <div className="info-item">
              <span className="info-icon"><Phone size={16} /></span>
              <span>
                <small>Teléfono</small>
                <strong>{contact.phone || 'No indicado'}</strong>
              </span>
            </div>
          </li>
          <li>
            <div className="info-item">
              <span className="info-icon"><Building2 size={16} /></span>
              <span>
                <small>Empresa</small>
                <strong>{contact.company || 'No indicada'}</strong>
              </span>
            </div>
          </li>
        </ul>
      </section>

      <section className="notes-section" aria-labelledby="notes-heading">
        <div className="section-heading notes-heading">
          <h3 id="notes-heading">Notas</h3>
          <span className="notes-count">{contact.notes.length}</span>
        </div>

        <form className="note-composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="new-note">Escribe una nota para {contact.name}</label>
          <textarea
            id="new-note"
            rows="2"
            placeholder="Escribe una nota sobre este contacto..."
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
          />
          <div className="composer-footer">
            <span>
              <MessageSquareText size={13} />
              Solo visible para tu equipo
            </span>
            <button className="send-note-button" type="submit" disabled={!noteText.trim()}>
              <Send size={14} />
              Añadir nota
            </button>
          </div>
        </form>

        {contact.notes.length > 0 ? (
          <ol className="notes-list">
            {contact.notes.map((note) => (
              <li className="note-entry" key={note.id}>
                <span className="note-timeline-dot" />
                <div className="note-content">
                  <div className="note-meta">
                    <span className="note-author">Juan Mejia</span>
                    <span>
                      <CalendarDays size={12} />
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                  <p>{note.text}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="notes-empty">Todavía no hay notas para este contacto.</p>
        )}
      </section>
    </article>
  )
}

export default ContactDetail