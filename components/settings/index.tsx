"use client"
import { useState } from 'react';
import { Tabs, Typography } from '@arco-design/web-react';
import AccountSettings from './AccountSettings';
import ProfileSettings from './ProfileSettings';
import AdminSettings from './AdminSettings';
import EditProfile from "./EditProfile"
import { useAuth } from '@/context/Auth';

const TabPane = Tabs.TabPane;

function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("key1");

  const isAdmin = () => {
    if (!user?.role) return false;
    return user.role.toLowerCase() === 'admin';
  };

  const getTabs = () => {
    const baseTabs = [
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
      }
    ];

    if (isAdmin()) {
      baseTabs.push({
        key: "key4",
        title: "Admin",
        content: <AdminSettings/>
      });
    }

    return baseTabs;
  };

  return (
    <Tabs
      type='card-gutter'
      activeTab={activeTab}
      onChange={setActiveTab}
    >
      {getTabs().map((tab) => (
        <TabPane 
          destroyOnHide 
          key={tab.key} 
          title={tab.title}
        >
          <Typography.Paragraph
            style={{ 
              textAlign: 'left',
              marginTop: 20,
            }}
          >
            {tab.content}
          </Typography.Paragraph>
        </TabPane>
      ))}
    </Tabs>
  );
}

export default App;