import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, RotateCcw } from 'lucide-react'
import Button from '../common/Button'

type CameraState = 'requesting' | 'ready' | 'denied' | 'not-found' | 'error'

interface QRScannerProps {
  /** Chamado uma única vez por leitura; o próprio componente evita leituras duplicadas enquanto pausado. */
  onDetected: (text: string) => void
  /** Enquanto true, o scanner fica pausado (ex: aguardando resposta da API). */
  paused: boolean
}

const READER_ID = 'qr-reader'

export default function QRScanner({ onDetected, paused }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [state, setState] = useState<CameraState>('requesting')
  const [attempt, setAttempt] = useState(0)
  const lockRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    setState('requesting')
    const scanner = new Html5Qrcode(READER_ID, { verbose: false })
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (lockRef.current) return
          lockRef.current = true
          onDetected(decodedText)
        },
        () => {
          // erro de leitura por frame — ignorado, é esperado até achar um QR
        },
      )
      .then(() => {
        if (!cancelled) setState('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = String(err)
        if (message.toLowerCase().includes('permission')) {
          setState('denied')
        } else if (message.toLowerCase().includes('notfound') || message.toLowerCase().includes('no camera')) {
          setState('not-found')
        } else {
          setState('error')
        }
      })

    return () => {
      cancelled = true
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {
          // câmera já pode ter sido liberada
        })
    }
  }, [attempt, onDetected])

  // Libera o lock quando o consumidor sinaliza que pode escanear de novo.
  useEffect(() => {
    if (!paused) lockRef.current = false
  }, [paused])

  if (state === 'denied') {
    return (
      <CameraMessage
        title="Permissão de câmera negada."
        description="O CheckInHub precisa acessar a câmera para ler os QR Codes. Habilite a permissão nas configurações do navegador."
        onRetry={() => setAttempt((n) => n + 1)}
      />
    )
  }

  if (state === 'not-found') {
    return (
      <CameraMessage
        title="Nenhuma câmera disponível."
        description="Não encontramos uma câmera neste dispositivo."
        onRetry={() => setAttempt((n) => n + 1)}
      />
    )
  }

  if (state === 'error') {
    return (
      <CameraMessage
        title="Não foi possível iniciar a câmera."
        description="Tente novamente ou utilize outro dispositivo."
        onRetry={() => setAttempt((n) => n + 1)}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-[600px]">
      {state === 'requesting' ? (
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl bg-ink-900 text-white">
          <Camera className="size-6 animate-pulse" aria-hidden />
          <span className="text-sm">Solicitando câmera...</span>
        </div>
      ) : null}
      <div
        id={READER_ID}
        className={`overflow-hidden rounded-2xl ${state === 'ready' ? 'block' : 'hidden'}`}
      />
      {paused && state === 'ready' ? (
        <div className="-mt-14 flex justify-center">
          <div className="rounded-full bg-ink-900/80 px-4 py-2 text-sm text-white">
            Validando participante...
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CameraMessage({
  title,
  description,
  onRetry,
}: {
  title: string
  description: string
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-100 bg-white px-6 py-12 text-center">
      <Camera className="size-6 text-ink-300" aria-hidden />
      <p className="text-[15px] font-medium text-ink-900">{title}</p>
      <p className="text-sm text-ink-500">{description}</p>
      <Button variant="secondary" size="md" icon={<RotateCcw className="size-4" />} onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}
