import { List, Avatar } from '@arco-design/web-react';

function App() {
  const dataSource = new Array(4).fill({
    title: 'Beijing Bytedance Technology Co., Ltd.',
    description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.',
  });

  const render = (actions, item, index) => (
    <List.Item key={index} actions={actions}>
      <List.Item.Meta
        avatar={<Avatar shape='square'>A</Avatar>}
        title={item.title}
        description={item.description}
      />
    </List.Item>
  );

 
  return (
    <>
     
      <List
        className='list-demo-actions'
        style={{ width: 700 }}
        dataSource={dataSource}
        render={render.bind(null, [
          <span className='list-demo-actions-button'>Edit</span>,
          <span className='list-demo-actions-button'>Delete</span>,
        ])}
      />
    </>
  );
}

export default App;
