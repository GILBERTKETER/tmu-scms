import { useState } from 'react';
import { Drawer, Button } from '@arco-design/web-react';

function App() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          setVisible(true);
        }}
        type='primary'
      >
        Add Activity
      </Button>
      <Drawer
        width={332}
        title={<span>Basic Information </span>}
        visible={visible}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div>Here is an example text.</div>

        <div>Here is an example text.</div>
      </Drawer>
    </div>
  );
}

export default App;
