import { Button } from '@arco-design/web-react';
import { useState } from 'react';

const FingerprintScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleFingerprintScan = () => {
    setIsScanning(true);
    // Simulate fingerprint scanning
    setTimeout(() => {
      console.log('Fingerprint scanned successfully');
      setIsScanning(false);
    }, 3000);  // Simulating scan time
  };

  return (
    <div className="text-center">
      <Button
        type="primary"
        onClick={handleFingerprintScan}
        loading={isScanning}
      >
        {isScanning ? 'Scanning...' : 'Start Fingerprint Scan'}
      </Button>
    </div>
  );
};

export default FingerprintScanner;
