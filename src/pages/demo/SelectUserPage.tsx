import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import { toast } from 'sonner'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useAuth } from '../../contexts/AuthContext'
import { getApiErrorMessage } from '../../utils/apiError'

export default function SelectUserPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Informe e-mail e senha.')
      return
    }

    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      navigate(user.role === 'ORGANIZER' ? '/organizer' : '/events', { replace: true })
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-5 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <QrCode className="size-7" aria-hidden />
          </div>
          <h1 className="text-xl font-semibold text-ink-900">CheckInHub</h1>
          <p className="text-[15px] text-ink-500">Entre com sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input label="E-mail" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Senha" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" size="lg" fullWidth loading={loading}>Entrar</Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Não tem uma conta?{' '}
          <Link to="/login/new" className="font-medium text-brand-600">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}
