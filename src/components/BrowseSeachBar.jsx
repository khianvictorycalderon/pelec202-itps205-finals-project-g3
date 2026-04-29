import React from 'react';

export default function BrowseSearchBar({ value, onChange }) {
  return (
    <div className='border border-black rounded-md p-2 flex items-center'>
      <input
        type="text"
        placeholder='Filter datasets...'
        className='w-full h-full outline-none'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}