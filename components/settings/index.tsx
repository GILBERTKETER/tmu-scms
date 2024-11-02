"use client"
import { useState } from 'react';
import { Tabs, Typography } from '@arco-design/web-react';
import AccountSettings from './AccountSettings';
import ProfileSettings from './ProfileSettings';
import AdminSettings from './AdminSettings';
import EditProfile from "./EditProfile"
const TabPane = Tabs.TabPane;

const initTabs = [
    {
        key: "key1",
        title: "Account",
        content: <AccountSettings/>
    },
    {
        key: "key2",
        title: "Profile",
        content: <ProfileSettings/>
    },
    {
        key: "key3",
        title: "Edit Profile",
        content: <EditProfile/>
    },
    {
        key: "key4",
        title: "Admin",
        content: <AdminSettings/>
    },
    
]
function App() {
  const [activeTab, setActiveTab] = useState("key1");

  return (
    <Tabs
      type='card-gutter'
      activeTab={activeTab}
      onChange={setActiveTab}
    >
      {initTabs.map((x) => (
        <TabPane destroyOnHide key={x.key} title={x.title}>
          <Typography.Paragraph
            style={{ textAlign: 'left',
                marginTop: 20,}}
          >{x.content}</Typography.Paragraph>
        </TabPane>
      ))}
    </Tabs>
  );
}

export default App;
