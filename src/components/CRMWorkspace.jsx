import { useState } from 'react'
import { BriefcaseBusiness, Command, Plus, Search } from 'lucide-react'
import ContactDetail from './ContactDetail.jsx'
import ContactForm from './ContactForm.jsx'
import ContactList from './ContactList.jsx'
import useContacts from '../hooks/useContacts.js'

function CRMWorkspace() {
  const {
    contacts,
    activeContact,
    activeContactId,
    loadState,
    setActiveContactId,
    createContact,
    addNote,
    restoreSampleData,
  } = useContacts()

  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  function handleCreateContact(contact) {
    createContact(contact)
    setSearchTerm('')
    setIsFormOpen(false)
  }

  return (
    <div className="app-shell min-h-screen">
      <aside className="side-rail" aria-label="Navegación principal">
        <a className="brand-mark" href="#inicio" aria-label="CachalotLab CRM, inicio">
          <span className="brand-icon">
            <BriefcaseBusiness size={19} strokeWidth={2.2} />
          </span>
          <span className="brand-name">
            CachalotLab
          </span>
        </a>

        <div className="rail-divider" />

        <nav aria-label="Secciones del CRM">
          <a className="rail-link rail-link-active" href="#contactos" aria-current="page">
            <Command size={19} />
            <span>Contactos</span>
          </a>
        </nav>

        <div className="rail-bottom" aria-label="Perfil de Juan Mejia">
          <div className="user-avatar">JM</div>
        </div>
      </aside>

      <main className="main-area" id="inicio">
        <header className="topbar">
          <div className="workspace-label">
            <span className="workspace-dot" />
            Equipo CachalotLab
            <span className="breadcrumb-slash">/</span>
            CRM
          </div>
          <div className="topbar-right">
            <div className="topbar-avatar" aria-hidden="true">JM</div>
          </div>
        </header>

        <div className="page-content">
          <header className="page-heading">
            <div>
              <div className="eyebrow">RELACIONES · CLIENTES</div>
              <h1>Contactos</h1>
              <p className="page-subtitle">Personas y empresas, en un solo lugar.</p>
            </div>
            <button className="primary-button" type="button" onClick={() => setIsFormOpen(true)}>
              <Plus size={17} strokeWidth={2.5} />
              Nuevo contacto
            </button>
          </header>

          <section className="workspace" id="contactos" aria-label="Gestión de contactos">
            <section className="list-panel" aria-labelledby="directory-heading">
              <div className="list-toolbar">
                <div className="list-title-row">
                  <h2 id="directory-heading">Directorio</h2>
                  <span className="contact-count">{loadState === 'ready' ? contacts.length : '—'}</span>
                </div>

                <div className="search-field">
                  <Search size={16} aria-hidden="true" />
                  <label className="sr-only" htmlFor="contact-search">
                    Buscar por nombre o empresa
                  </label>
                  <input
                    id="contact-search"
                    type="search"
                    placeholder="Buscar contactos..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>

                <div className="list-filter-row">
                  <span>CONTACTO</span>
                </div>
              </div>

              <ContactList
                contacts={contacts}
                activeContactId={activeContactId}
                searchTerm={searchTerm}
                loadState={loadState}
                onSelect={setActiveContactId}
                onAddContact={() => setIsFormOpen(true)}
                onRestoreSamples={restoreSampleData}
              />

              <p className="list-footer">
                <span className="online-dot" />
                Tus datos se guardan en este dispositivo
              </p>
            </section>

            <section className="detail-panel" aria-label="Detalle del contacto">
              {loadState === 'ready' && activeContact ? (
                <ContactDetail
                  key={activeContact.id}
                  contact={activeContact}
                  onAddNote={addNote}
                />
              ) : (
                <div className="detail-placeholder">
                  <span className="placeholder-icon">
                    <BriefcaseBusiness size={23} />
                  </span>
                  <h2>Selecciona un contacto</h2>
                  <p>El detalle aparecerá aquí.</p>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>

      {isFormOpen && (
        <ContactForm
          onClose={() => setIsFormOpen(false)}
          onCreate={handleCreateContact}
        />
      )}
    </div>
  )
}

export default CRMWorkspace