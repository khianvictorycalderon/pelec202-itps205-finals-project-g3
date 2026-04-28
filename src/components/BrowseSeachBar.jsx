import React from 'react'

export default function BrowseSearchBar() {
  return (
    <div className='border border-black rounded-md p-2
    w-[820px] h-[50px] flex items-center gap-2
    '>
      <input type="text" placeholder='Search...' className='w-full h-full outline-none' />
      <button className='bg-cyan-700 text-white px-4 py-2 rounded-md'>Search</button>
      
    </div>
  )
}
