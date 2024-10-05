import { useState } from "react";
import { Drawer, Button } from "@arco-design/web-react";

function App() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <p
        className="cursor-pointer font-bold"
        onClick={() => {
          setVisible(true);
        }}
      >
        Edit
      </p>
      <Drawer
        width={332}
        title={<span>Edit Your Details </span>}
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
