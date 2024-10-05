import React from 'react';
import { Modal, Button } from '@arco-design/web-react';

function App() {
  const [visible, setVisible] = React.useState(false);
  
  return (
    <div>
      <Button onClick={() => setVisible(true)} type="primary">
        Show Alerts
      </Button>
      <Modal
        title="Modal Title"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        className=" lg:w-[auto] w-full sm:mx-auto"
      >
        <p className="text-gray-700">
          You can customize modal body text by the current situation. This modal will be closed
          immediately once you press the OK button.
        </p>
      </Modal>
    </div>
  );
}

export default App;
