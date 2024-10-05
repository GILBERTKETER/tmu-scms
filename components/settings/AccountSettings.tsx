import { Button, Input } from '@arco-design/web-react'
import React from 'react'
import ChangeEmail from "./ChangeEmail"
function AccountSettings() {
  return (
   
    
    <div className="min-h-screen w-full sm:mx-8 xl:mx-auto p-4">
      <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
        <div className="col-span-12 overflow-hidden rounded-xl  sm:px-8 w-full">
          <div className="pt-4">
            <h1 className="py-2 text-2xl font-semibold">Account settings</h1>
            <p className="font- text-slate-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p> 
          </div>
          <hr className="mt-4 mb-8" />
          <p className="py-2 text-xl font-semibold">Email Address</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600">Your email address is <strong>john.doe@company.com</strong></p>
           <ChangeEmail/>
          </div>
         
          <hr className="mt-4 mb-8" />
          <p className="py-2 text-xl font-semibold">Phone Number</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600">Your phone Number is <strong>254759104865</strong></p>
           <ChangeEmail/>
          </div>
          <hr className="mt-4 mb-8" />
          <p className="py-2 text-xl font-semibold">Password</p>
          <div className="flex items-center">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
              <label htmlFor="login-password">
                <span className="text-sm text-gray-500">Current Password</span>
                <div className="relative flex overflow-hidden my-2">
                  
                  <Input.Password defaultValue='password' style={{width:"100%"}}/>

                </div>
              </label>
              <label htmlFor="login-password">
                <span className="text-sm text-gray-500">New Password</span>
                <div className="relative flex overflow-hidden my-2">
                 
                  <Input.Password defaultValue='password' style={{width:"100%"}} />

                </div>
              </label>
            </div>
          
          </div>
          <p className="mt-2">Can't remember your current password. <a className="text-sm font-semibold text-blue-600 underline decoration-2" href="/auth/forgotpassword">Recover Account</a></p>
          <Button className="px-4 py-2 my-2" type='primary'>Change password</Button>

          <hr className="mt-4 mb-8" />
    
          <div className="mb-10">
            <p className="py-2 text-xl font-semibold">Delete Account</p>
            <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Proceed with caution
            </p>
            <p className="mt-2">Make sure you have taken backup of your account in case you ever need to get access to your data. We will completely wipe your data. There is no way to access your account after this action.</p>
            <button className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2">Continue with deletion</button>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default AccountSettings
