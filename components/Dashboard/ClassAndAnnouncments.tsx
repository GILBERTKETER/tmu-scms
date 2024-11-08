"use client"
import React from 'react';
import { Card, Tabs, Link } from '@arco-design/web-react';
const TabPane = Tabs.TabPane;

const App = () => {
  return (
<div className="flex flex-col gap-10 lg:flex-row sm:flex-row w-full h-full">
<Card
      title='Card with Tab'
      extra={<Link>More</Link>}
      style={{
        width: '100%',
        height:'100% !important',
      }}
    >
      heey
    </Card>
    <Card
      title='Card with Tab'
      extra={<Link>More</Link>}
      style={{
        width: '100%',
        height:'100% !important',
      }}
    >
     heeyyy
    </Card>
    </div>
  );
};

export default App;
