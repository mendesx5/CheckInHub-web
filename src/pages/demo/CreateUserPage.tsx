import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '../../components/layout/PageHeader'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import { createUser } from '../../services/userService'
import { getApiErrorMessage } from '../../utils/apiError'
import type { UserRole } from '../../types/user'

interface FormState {
  name: string
  email: string
  password: string
  role: UserRole
}

const initialState: FormState = { name: '', email: '', password: '', role: 'PARTICIPANT' }

export default function CreateUserPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(false)
  const [createdId, setCreatedId] = useState<number | null>(null)

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = 'Nome é obrigatório.'
    else if (form.name.length > 150) next.name = 'Máximo de 150 caracteres.'
    if (!form.email.trim()) next.email = 'E-mail é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'E-mail inválido.'
    if (!form.password) next.password = 'Senha é obrigatória.'
    else if (form.password.length < 6) next.password = 'Mínimo de 6 caracteres.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await createUser(form)
      setCreatedId(user.id)
      toast.success('Conta criada com sucesso.')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (createdId !== null) {
    return (
      <div>
        <PageHeader title="Conta criada" back />
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-success-50 bg-white p-6 text-center">
          <p className="text-[15px] text-ink-700">Conta criada com sucesso.</p>
          <p className="mt-2 text-3xl font-semibold text-ink-900">ID: {createdId}</p>
          <p className="mt-2 text-sm text-ink-500">
            Agora você já pode entrar usando o e-mail e a senha cadastrados.
          </p>
          <Button className="mt-5" fullWidth onClick={() => navigate('/login')}>
            Ir para o login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Criar conta" back />
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm flex-col gap-4" noValidate>
        <Input
          label="Nome"
          name="name"
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          value={form.password}
          error={errors.password}
          hint="Mínimo de 6 caracteres"
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <Select
          label="Perfil"
          name="role"
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
          options={[
            { value: 'PARTICIPANT', label: 'Participante' },
            { value: 'ORGANIZER', label: 'Organizador' },
          ]}
        />
        <Button type="submit" size="lg" fullWidth loading={loading}>
          Criar usuário
        </Button>
        <Link to="/login" className="text-center text-sm text-ink-500">
          Voltar
        </Link>
      </form>
    </div>
  )
}
