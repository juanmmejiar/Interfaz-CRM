import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function ContactForm({ onClose, onCreate }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function updateField(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  function validateForm() {
    const nextErrors = {}
    const email = values.email.trim()

    if (!values.name.trim()) {
      nextErrors.name = 'Escribe el nombre del contacto.'
    }

    if (!email) {
      nextErrors.email = 'El correo electrónico es obligatorio.'
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Introduce un correo válido, por ejemplo nombre@empresa.com.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    onCreate({
      id: crypto.randomUUID(),
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      company: values.company.trim(),
      notes: [],
    })
  }

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropMouseDown}>
      <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div>
            <span className="modal-eyebrow">DIRECTORIO</span>
            <h2 id="form-title">Nuevo contacto</h2>
            <p>Añade una persona a tu equipo.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar formulario">
            <X size={19} />
          </button>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="contact-name">
              Nombre <span aria-hidden="true">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              value={values.name}
              onChange={updateField}
              placeholder="Ej. Laura Méndez"
              required
              autoFocus
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p className="field-error" id="name-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="contact-email">
              Correo electrónico <span aria-hidden="true">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={values.email}
              onChange={updateField}
              placeholder="laura@empresa.com"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p className="field-error" id="email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="contact-company">
              Empresa <span className="optional-label">Opcional</span>
            </label>
            <input
              id="contact-company"
              name="company"
              value={values.company}
              onChange={updateField}
              placeholder="Nombre de la empresa"
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-phone">
              Teléfono <span className="optional-label">Opcional</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={updateField}
              placeholder="+57 600 000 000"
            />
          </div>

          <div className="form-actions">
            <button className="cancel-button" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="primary-button" type="submit">
              Crear contacto
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ContactForm