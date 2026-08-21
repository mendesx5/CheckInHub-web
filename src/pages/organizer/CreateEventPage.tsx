import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '../../components/layout/PageHeader'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import Button from '../../components/common/Button'
import { createEvent } from '../../services/eventService'
import { getApiErrorMessage } from '../../utils/apiError'
import { useAuth } from '../../contexts/AuthContext'

interface FormState {
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: string
}

const initialState: FormState = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  capacity: '',
}

export default function CreateEventPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}

    if (!form.title.trim()) next.title = 'Título é obrigatório.'
    else if (form.title.length > 150) next.title = 'Máximo de 150 caracteres.'

    if (!form.date) next.date = 'Data é obrigatória.'
    if (!form.time) next.time = 'Hora é obrigatória.'

    if (form.date && form.time) {
      const dateTime = new Date(`${form.date}T${form.time}:00`)
      if (dateTime.getTime() <= Date.now()) {
        next.date = 'A data deve ser futura.'
      }
    }

    if (!form.location.trim()) next.location = 'Local é obrigatório.'
    else if (form.location.length > 255) next.location = 'Máximo de 255 caracteres.'

    const capacityNumber = Number(form.capacity)
    if (!form.capacity || Number.isNaN(capacityNumber) || capacityNumber < 1) {
      next.capacity = 'Capacidade mínima é 1.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUser) return
    if (!validate()) return

    setLoading(true)
    try {
      const event = await createEvent({
        title: form.title.trim(),
        description: form.description.trim(),
        dateTime: `${form.date}T${form.time}:00`,
        location: form.location.trim(),
        capacity: Number(form.capacity),
      })
      toast.success('Evento criado.')
      navigate(`/events/${event.id}`)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Criar evento" back />
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-4" noValidate>
        <Input
          label="Título"
          name="title"
          value={form.title}
          error={errors.title}
          maxLength={150}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <Textarea
          label="Descrição"
          name="description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Data"
            name="date"
            type="date"
            value={form.date}
            error={errors.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          <Input
            label="Hora"
            name="time"
            type="time"
            value={form.time}
            error={errors.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          />
        </div>
        <Input
          label="Local"
          name="location"
          value={form.location}
          error={errors.location}
          maxLength={255}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        />
        <Input
          label="Capacidade"
          name="capacity"
          type="number"
          inputMode="numeric"
          min={1}
          value={form.capacity}
          error={errors.capacity}
          onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
        />
        <Button type="submit" size="lg" fullWidth loading={loading}>
          Criar evento
        </Button>
      </form>
    </div>
  )
}
