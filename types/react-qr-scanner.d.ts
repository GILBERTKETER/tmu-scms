declare module 'react-qr-scanner' {
    import { Component } from 'react'
  
    export interface QrScannerProps {
      delay?: number | false
      style?: React.CSSProperties
      onError?: (error: any) => void
      onScan?: (result: QrScannerResult | null) => void
      constraints?: MediaTrackConstraints
    }
  
    export interface QrScannerResult {
      text: string
      result: any
    }
  
    export default class QrScanner extends Component<QrScannerProps> {}
  }