import React from 'react'
import AdminTable from "./AdminTables"
function AdminSettings() {
  return (
<div className="mx-4  max-w-screen-xl sm:mx-8 xl:mx-auto">
  <div className="grid grid-cols-8 pt-3 pb-10 sm:grid-cols-10">
    <div className="col-span-12 rounded-xl sm:px-8">
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">Course Management</h1>
       <p className="font- text-slate-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p> 
      </div>
      <hr className="mt-4 mb-8" />

      <div className="mb-10 grid gap-y-8 lg:grid-cols-2 lg:gap-y-0">
        <div className="space-y-8">
          <div className="">
            <div className="flex">
              <p className="font-medium mb-1">First Year</p>
              <button className="ml-auto inline-flex text-sm font-semibold text-blue-600 underline decoration-2">Change</button>
            </div>
            <div className="flex items-center rounded-md border border-gray-100 bg-white py-3 shadow">
              <p className="ml-4 w-56">
                <strong className="block text-lg font-medium">MONTHLY</strong>
                <span className="text-xs text-gray-400"> Next Renewal: 4 Jan 2022 </span>
              </p>
            </div>
          </div>
          <div className="">
            <div className="flex">
              <p className="font-medium mb-1">Second Year</p>
              <button className="ml-auto inline-flex text-sm font-semibold text-blue-600 underline decoration-2">Change</button>
            </div>
            <div className="flex items-center rounded-md border border-gray-100 bg-white py-3 shadow">
              <img className="h-10 object-contain pl-4" src="/images/kt10d0A1TgzZpAoNM_YPX.png" alt="" />
              <p className="ml-4 w-56">
                <strong className="block text-lg font-medium">**** **** **** 453 </strong>
                <strong className="block text-lg font-medium">ALBERT K. DANIEL </strong>
                <span className="text-xs text-gray-400"> Expires on: Dec 2024 </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-y-6 gap-x-3 sm:grid-cols-2 lg:px-8">
          <label className="block" htmlFor="name">
            <p className="text-sm">Name</p>
            <input className="w-full rounded-md border bg-white py-2 px-2 outline-none ring-blue-600 focus:ring-1" type="text" value="Shakir Ali" />
          </label>
          <label className="block" htmlFor="name">
            <p className="text-sm">Email Address</p>
            <input className="w-full rounded-md border bg-white py-2 px-2 outline-none ring-blue-600 focus:ring-1" type="text" value="shakir.ali@corpora.de" />
          </label>
          <label className="block sm:col-span-2" htmlFor="name">
            <p className="text-sm">Billing Address</p>
            <input className="w-full rounded-md border bg-white py-2 px-2 outline-none ring-blue-600 focus:ring-1" type="text" value="82844 Boyle Extension Suite 541 - Covington, HI / 28013" />
          </label>
          <label className="block" htmlFor="name">
            <p className="text-sm">VAT #</p>
            <input className="w-full rounded-md border bg-white py-2 px-2 outline-none ring-blue-600 focus:ring-1" type="text" value="6346322" />
          </label>
          <label className="block" htmlFor="name">
            <p className="text-sm">Country</p>
            <input className="w-full rounded-md border bg-white py-2 px-2 outline-none ring-blue-600 focus:ring-1" type="text" value="Germany" />
          </label>
        </div>
      </div>

    <AdminTable/>
    </div>
  </div>
</div>

  )
}

export default AdminSettings
