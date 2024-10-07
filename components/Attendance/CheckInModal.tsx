import { Modal, Button, Space } from '@arco-design/web-react';
import { useState } from 'react';
import RfidCheckIn from './RfidCheckIn';
import QrCodeScanner from './QrCodeScanner';
import FingerprintScanner from './FingerprintScanner';

const CheckInModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [checkInMethod, setCheckInMethod] = useState('');

  const openModal = (method) => {
    setCheckInMethod(method);
    setVisible(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 sm:grid-cols-2 mt-6 gap-4">
        <Button type="primary" onClick={() => openModal('RFID')}>RFID Check-In</Button>
        <Button type="primary" onClick={() => openModal('QR')}>QR Code Check-In</Button>
        <Button type="primary" onClick={() => openModal('Fingerprint')}>Fingerprint Check-In</Button>
      </div>

      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title={`Check-In using ${checkInMethod}`}
        footer={null}
      >
        {checkInMethod === 'RFID' && <RfidCheckIn />}
        {checkInMethod === 'QR' && <QrCodeScanner />}
        {checkInMethod === 'Fingerprint' && <FingerprintScanner />}
      </Modal>
    </>
  );
};

export default CheckInModal;
