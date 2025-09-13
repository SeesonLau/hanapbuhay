// app/testing/page.tsx
'use client';

import { useState } from 'react';
import {
  ApplyButton,
  DeleteButton,
  SearchButton,
  PostButton,
  SubmitNowButton,
  CancelButton,
  SendCodeButton,
  UploadPhotoButton
} from '@/components';

export default function TestingPage() {
  const [clickCounts, setClickCounts] = useState({
    apply: 0,
    delete: 0,
    search: 0,
    post: 0,
    submit: 0,
    cancel: 0,
    sendCode: 0,
    upload: 0,
  });

  const [disabledStates, setDisabledStates] = useState({
    apply: false,
    delete: false,
    search: false,
    post: false,
    submit: false,
    cancel: false,
    sendCode: false,
    upload: false,
  });

  const handleClick = (buttonName: keyof typeof clickCounts) => {
    setClickCounts(prev => ({
      ...prev,
      [buttonName]: prev[buttonName] + 1
    }));
  };

  const toggleDisabled = (buttonName: keyof typeof disabledStates) => {
    setDisabledStates(prev => ({
      ...prev,
      [buttonName]: !prev[buttonName]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Component Testing Page</h1>
        
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p className="text-gray-600">
            Click on buttons to test their active states. Use the toggle switches to enable/disable each button.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Apply Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Apply Button</h2>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Disabled</span>
                <input 
                  type="checkbox" 
                  checked={disabledStates.apply}
                  onChange={() => toggleDisabled('apply')}
                  className="toggle"
                />
              </label>
            </div>
            <ApplyButton 
              onClick={() => handleClick('apply')} 
              disabled={disabledStates.apply}
            />
            <p className="mt-2 text-sm text-gray-600">Clicked: {clickCounts.apply} times</p>
          </div>

          {/* Delete Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delete Button</h2>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Disabled</span>
                <input 
                  type="checkbox" 
                  checked={disabledStates.delete}
                  onChange={() => toggleDisabled('delete')}
                  className="toggle"
                />
              </label>
            </div>
            <DeleteButton 
              onClick={() => handleClick('delete')} 
              disabled={disabledStates.delete}
            />
            <p className="mt-2 text-sm text-gray-600">Clicked: {clickCounts.delete} times</p>
          </div>

          {/* Search Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Search Button</h2>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Disabled</span>
                <input 
                  type="checkbox" 
                  checked={disabledStates.search}
                  onChange={() => toggleDisabled('search')}
                  className="toggle"
                />
              </label>
            </div>
            <SearchButton 
              onClick={() => handleClick('search')} 
              disabled={disabledStates.search}
            />
            <p className="mt-2 text-sm text-gray-600">Clicked: {clickCounts.search} times</p>
          </div>

          {/* Post Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Post Button</h2>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Disabled</span>
                <input 
                  type="checkbox" 
                  checked={disabledStates.post}
                  onChange={() => toggleDisabled('post')}
                  className="toggle"
                />
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Small Size</h3>
                <PostButton 
                  onClick={() => handleClick('post')} 
                  size="small"
                  disabled={disabledStates.post}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Large Size</h3>
                <PostButton 
                  onClick={() => handleClick('post')} 
                  size="large"
                  disabled={disabledStates.post}
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Clicked: {clickCounts.post} times</p>
          </div>

          {/* Submit Now Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Submit Now Button</h2>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Disabled</span>
                <input 
                  type="checkbox" 
                  checked={disabledStates.submit}
                  onChange={() => toggleDisabled('submit')}
                  className="toggle"
                />
              </label>
            </div>
            <SubmitNowButton 
              onClick={() => handleClick('submit')} 
              disabled={disabledStates.submit}
            />
            <p className="mt-2 text-sm text-gray-600">Clicked: {clickCounts.submit} times</p>
          </div>

          {/* Cancel Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Cancel Button</h2>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Disabled</span>
                <input 
                  type="checkbox" 
                  checked={disabledStates.cancel}
                  onChange={() => toggleDisabled('cancel')}
                  className="toggle"
                />
              </label>
            </div>
            <CancelButton 
              onClick={() => handleClick('cancel')} 
              disabled={disabledStates.cancel}
            />
            <p className="mt-2 text-sm text-gray-600">Clicked: {clickCounts.cancel} times</p>
          </div>

          {/* Send Code Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Send Code Button</h2>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Disabled</span>
                <input 
                  type="checkbox" 
                  checked={disabledStates.sendCode}
                  onChange={() => toggleDisabled('sendCode')}
                  className="toggle"
                />
              </label>
            </div>
            <SendCodeButton 
              onClick={() => handleClick('sendCode')} 
              disabled={disabledStates.sendCode}
            />
            <p className="mt-2 text-sm text-gray-600">Clicked: {clickCounts.sendCode} times</p>
          </div>

          {/* Upload Photo Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upload Photo Button</h2>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Disabled</span>
                <input 
                  type="checkbox" 
                  checked={disabledStates.upload}
                  onChange={() => toggleDisabled('upload')}
                  className="toggle"
                />
              </label>
            </div>
            <UploadPhotoButton 
              onClick={() => handleClick('upload')} 
              disabled={disabledStates.upload}
            />
            <p className="mt-2 text-sm text-gray-600">Clicked: {clickCounts.upload} times</p>
          </div>
        </div>
      </div>
    </div>
  );
}