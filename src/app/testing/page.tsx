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
  UploadPhotoButton,
  ApplyNowButton,
  VisitProfileButton,
  LoginButton,
  SignUpButton,
  SeePreviousNotificationsButton
} from '@/components';
import DashboardNavBar from '@/components/navbar/DashboardNavBar';

type NavigationLink = 'find-jobs' | 'manage-posts' | 'applied-jobs' | 'chat';

export default function TestingPage() {
  const [activeLink, setActiveLink] = useState<NavigationLink>('find-jobs');
  const [clickCounts, setClickCounts] = useState({
    applyNow: 0,
    visitProfile: 0,
    login: 0,
    signUp: 0,
    seeNotifications: 0,
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
    applyNow: false,
    visitProfile: false,
    login: false,
    signUp: false,
    seeNotifications: false,
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

  const handleNavigation = (linkId: string) => {
    setActiveLink(linkId as NavigationLink);
  };

  // Content components for each navigation link
  const FindJobsContent = () => (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Jobs - Component Testing</h1>
        
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <p className="text-gray-600">
          Click on buttons to test their active states. Use the toggle switches to enable/disable each button.
          Hover over buttons to see hover effects.
        </p>
      </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Apply Now Button */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Apply Now Button</h2>
            <label className="flex items-center space-x-2">
              <span className="text-sm">Disabled</span>
              <input 
                type="checkbox" 
                checked={disabledStates.applyNow}
                onChange={() => toggleDisabled('applyNow')}
                className="toggle"
              />
            </label>
          </div>
          <div className="flex justify-center mb-4">
            <ApplyNowButton 
              onClick={() => handleClick('applyNow')} 
              disabled={disabledStates.applyNow}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">Clicked: {clickCounts.applyNow} times</p>
        </div>

        {/* Visit Profile Button */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Visit Profile Button</h2>
            <label className="flex items-center space-x-2">
              <span className="text-sm">Disabled</span>
              <input 
                type="checkbox" 
                checked={disabledStates.visitProfile}
                onChange={() => toggleDisabled('visitProfile')}
                className="toggle"
              />
            </label>
          </div>
          <div className="flex justify-center mb-4">
            <VisitProfileButton 
              onClick={() => handleClick('visitProfile')} 
              disabled={disabledStates.visitProfile}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">Clicked: {clickCounts.visitProfile} times</p>
        </div>

        {/* Login Button */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Login Button</h2>
            <label className="flex items-center space-x-2">
              <span className="text-sm">Disabled</span>
              <input 
                type="checkbox" 
                checked={disabledStates.login}
                onChange={() => toggleDisabled('login')}
                className="toggle"
              />
            </label>
          </div>
          <div className="flex justify-center mb-4">
            <LoginButton 
              onClick={() => handleClick('login')} 
              disabled={disabledStates.login}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">Clicked: {clickCounts.login} times</p>
        </div>

        {/* Sign Up Button */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sign Up Button</h2>
            <label className="flex items-center space-x-2">
              <span className="text-sm">Disabled</span>
              <input 
                type="checkbox" 
                checked={disabledStates.signUp}
                onChange={() => toggleDisabled('signUp')}
                className="toggle"
              />
            </label>
          </div>
          <div className="flex justify-center mb-4">
            <SignUpButton 
              onClick={() => handleClick('signUp')} 
              disabled={disabledStates.signUp}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">Clicked: {clickCounts.signUp} times</p>
        </div>

        {/* See Previous Notifications Button */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">See Previous Notifications Button</h2>
            <label className="flex items-center space-x-2">
              <span className="text-sm">Disabled</span>
              <input 
                type="checkbox" 
                checked={disabledStates.seeNotifications}
                onChange={() => toggleDisabled('seeNotifications')}
                className="toggle"
              />
            </label>
          </div>
          <div className="flex justify-center mb-4">
            <SeePreviousNotificationsButton 
              onClick={() => handleClick('seeNotifications')} 
              disabled={disabledStates.seeNotifications}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">Clicked: {clickCounts.seeNotifications} times</p>
        </div>

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
  );

  const ManagePostsContent = () => (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Manage Job Posts</h1>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Job Post Management</h2>
        <p className="text-gray-600">
          Manage your job postings, view applications, and track performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Posts Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Active Posts</h3>
              <p className="text-3xl font-bold text-green-600">12</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">📝</span>
            </div>
          </div>
        </div>

        {/* Pending Review Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pending Review</h3>
              <p className="text-3xl font-bold text-yellow-600">3</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
        </div>

        {/* Total Applications Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Applications</h3>
              <p className="text-3xl font-bold text-blue-600">47</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold">Recent Job Posts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold">Senior Software Developer</h4>
                <p className="text-gray-600">Posted 2 days ago • 15 applications</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  View
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Edit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold">Marketing Manager</h4>
                <p className="text-gray-600">Posted 1 week ago • 8 applications</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  View
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AppliedJobsContent = () => (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Applied Jobs</h1>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Your Job Applications</h2>
        <p className="text-gray-600">
          Track the status of your job applications and manage your job search.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Applied Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Applied</h3>
              <p className="text-3xl font-bold text-blue-600">8</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📤</span>
            </div>
          </div>
        </div>

        {/* Under Review Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Under Review</h3>
              <p className="text-3xl font-bold text-yellow-600">5</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">👀</span>
            </div>
          </div>
        </div>

        {/* Interview Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Interview</h3>
              <p className="text-3xl font-bold text-green-600">2</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">💼</span>
            </div>
          </div>
        </div>

        {/* Rejected Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Rejected</h3>
              <p className="text-3xl font-bold text-red-600">1</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold">Recent Applications</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold">Frontend Developer at TechCorp</h4>
                <p className="text-gray-600">Applied 3 days ago • Status: Under Review</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Under Review
              </span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold">UI/UX Designer at DesignStudio</h4>
                <p className="text-gray-600">Applied 1 week ago • Status: Interview Scheduled</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Interview
              </span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold">Backend Developer at StartupXYZ</h4>
                <p className="text-gray-600">Applied 2 weeks ago • Status: Rejected</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                Rejected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ChatContent = () => (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Chat</h1>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Messages</h2>
        <p className="text-gray-600">
          Communicate with employers, colleagues, and other users.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Conversations</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg cursor-pointer">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                TC
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-semibold">TechCorp HR</h4>
                <p className="text-sm text-gray-600">Thanks for your application...</p>
              </div>
              <span className="text-xs text-gray-500">2m</span>
            </div>
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                DS
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-semibold">DesignStudio</h4>
                <p className="text-sm text-gray-600">Interview scheduled for...</p>
              </div>
              <span className="text-xs text-gray-500">1h</span>
            </div>
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                SX
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-semibold">StartupXYZ</h4>
                <p className="text-sm text-gray-600">We'll be in touch soon</p>
              </div>
              <span className="text-xs text-gray-500">3h</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                TC
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">TechCorp HR</h4>
                <p className="text-sm text-gray-600">Online</p>
              </div>
            </div>
          </div>
          <div className="p-4 h-96 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                  Hi! I'm interested in the Frontend Developer position.
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
                  Hello! Thank you for your interest. We've received your application and will review it shortly.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                  Great! When can I expect to hear back?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
                  We typically review applications within 3-5 business days. We'll contact you via email or phone.
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render content based on active link
  const renderContent = () => {
    switch (activeLink) {
      case 'find-jobs':
        return <FindJobsContent />;
      case 'manage-posts':
        return <ManagePostsContent />;
      case 'applied-jobs':
        return <AppliedJobsContent />;
      case 'chat':
        return <ChatContent />;
      default:
        return <FindJobsContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavBar 
        activeLink={activeLink}
        onNavigate={handleNavigation}
      />
      <div className="pt-24 p-4">
        {renderContent()}
      </div>
    </div>
  );
}