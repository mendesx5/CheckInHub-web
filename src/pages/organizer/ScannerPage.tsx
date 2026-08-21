import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '../../components/layout/PageHeader'
import QRScanner from '../../components/checkin/QRScanner'
import CheckInResult from '../../components/checkin/CheckInResult'
import { createCheckIn } from '../../services/checkInService'
import { getApiErrorMessage } from '../../utils/apiError'
import type { CheckIn } from '../../types/checkin'

type ResultState = { type: 'success'; checkIn: CheckIn } | { type: 'error'; message: string } | null

export default function ScannerPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const [result, setResult] = useState<ResultState>(null)
  const [processing, setProcessing] = useState(false)

  const handleDetected = useCallback(
    async (qrCodeToken: string) => {
      setProcessing(true)
      try {
        const checkIn = await createCheckIn(qrCodeToken)
        setResult({ type: 'success', checkIn })
        toast.success('Check-in realizado.')
      } catch (err) {
        setResult({ type: 'error', message: getApiErrorMessage(err) })
      } finally {
        setProcessing(false)
      }
    },
    [],
  )

  function handleScanNext() {
    setResult(null)
  }

  function handleBack() {
    if (eventId) {
      navigate(`/events/${eventId}`)
    } else {
      navigate('/organizer')
    }
  }

  return (
    <div>
      <PageHeader title="Check-in" subtitle="Aponte a câmera para o QR Code do participante" back />

      {!result ? (
        <>
          <QRScanner onDetected={handleDetected} paused={processing} />
          <p className="mx-auto mt-4 max-w-[600px] text-center text-sm text-ink-500">
            Mantenha o código dentro da área indicada.
          </p>
        </>
      ) : result.type === 'success' ? (
        <CheckInResult
          type="success"
          checkIn={result.checkIn}
          onScanNext={handleScanNext}
          onBack={handleBack}
        />
      ) : (
        <CheckInResult
          type="error"
          message={result.message}
          onScanNext={handleScanNext}
          onBack={handleBack}
        />
      )}
    </div>
  )
}
