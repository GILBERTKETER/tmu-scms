// QRScanner.tsx
import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Button } from '@arco-design/web-react';

const QRScanner = () => {
  const [data, setData] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result) {
      setData(result);
      console.log('QR Code Data:', result);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {data && (
        <div>
          <p>QR Code Data: {data}</p>
          <Button type="primary" onClick={() => setData(null)}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
