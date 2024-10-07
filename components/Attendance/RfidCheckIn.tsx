import { Input, Button } from '@arco-design/web-react';
import { useState } from 'react';

const RfidCheckIn: React.FC = () => {
  const [rfid, setRfid] = useState('');

  const handleRfidSubmit = () => {
    console.log('RFID Submitted:', rfid);
    // Handle the RFID submission logic
  };

  return (
    <div>
      <Input
        value={rfid}
        onChange={(e) => setRfid(e)}
        placeholder="Enter RFID code"
      />
      <Button type="primary" onClick={handleRfidSubmit} className="mt-4">Submit</Button>
    </div>
  );
};

export default RfidCheckIn;
