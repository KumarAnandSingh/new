import { FC, useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';

interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  bio: string;
  interests: string[];
  avatar: string;
}

interface Activity {
  id: string;
  type: 'comment' | 'save' | 'post';
  content: string;
  date: string;
  link: string;
}

interface SavedItem {
  id: string;
  title: string;
  type: 'tool' | 'tutorial' | 'hack';
  description: string;
  imageSrc?: string;
  link: string;
}

const UserDashboardPage: FC = () => {
  // Sample user data
  const user: UserProfile = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    memberSince: 'March 2025',
    bio: 'Computer Science student passionate about AI and productivity tools. Always looking for ways to optimize my learning process.',
    interests: ['AI Tools', 'Productivity', 'Programming', 'Machine Learning'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
  };

  // Sample activity data
  const activities: Activity[] = [
    {
      id: 'act1',
      type: 'comment',
      content: 'Commented on "Best AI tools for writing essays"',
      date: '2025-04-05',
      link: '/community/discussions/best-ai-tools-essays'
    },
    {
      id: 'act2',
      type: 'save',
      content: 'Saved "ChatGPT" to favorites',
      date: '2025-04-04',
      link: '/ai-tools/chatgpt'
    },
    {
      id: 'act3',
      type: 'post',
      content: 'Posted in "How to stay focused during online classes"',
      date: '2025-04-03',
      link: '/community/discussions/focus-online-class'
    },
    {
      id: 'act4',
      type: 'save',
      content: 'Saved "Pomodoro Technique" to favorites',
      date: '2025-04-02',
      link: '/productivity/pomodoro-technique'
    },
    {
      id: 'act5',
      type: 'comment',
      content: 'Commented on "Digital Note Organization"',
      date: '2025-04-01',
      link: '/productivity/digital-note-organization'
    }
  ];

  // Sample saved items
  const savedItems: SavedItem[] = [
    {
      id: 'saved1',
      title: 'ChatGPT',
      type: 'tool',
      description: 'An AI assistant that can help with writing, research, and creative tasks.',
      imageSrc: 'https://images.unsplash.com/photo-1677442135968-6d89fcb3d7f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      link: '/ai-tools/chatgpt'
    },
    {
      id: 'saved2',
      title: 'Pomodoro Technique',
      type: 'hack',
      description: 'Boost your productivity with the time-tested Pomodoro Technique for focused work sessions.',
      imageSrc: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      link: '/productivity/pomodoro-technique'
    },
    {
      id: 'saved3',
      title: 'Getting Started with ChatGPT',
      type: 'tutorial',
      description: 'Learn how to use ChatGPT effectively for your studies and research.',
      imageSrc: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      link: '/tutorials/getting-started-with-chatgpt'
    },
    {
      id: 'saved4',
      title: 'Notion AI',
      type: 'tool',
      description: 'AI-powered writing assistant integrated with Notion for better note-taking and organization.',
      imageSrc: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      link: '/ai-tools/notion-ai'
    },
    {
      id: 'saved5',
      title: 'Digital Note Organization',
      type: 'hack',
      description: 'Learn how to organize your digital notes effectively for better recall and productivity.',
      imageSrc: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      link: '/productivity/digital-note-organization'
    },
    {
      id: 'saved6',
      title: 'Advanced Notion Templates',
      type: 'tutorial',
      description: 'Discover how to create and use advanced Notion templates for better organization.',
      imageSrc: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      link: '/tutorials/advanced-notion-templates'
    }
  ];

  // State for active tab
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'activity' | 'settings'>('profile');

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Welcome back, {user.name}!</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeTab === 'saved'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Saved Items
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeTab === 'activity'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Activity
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Settings
                  </button>
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h2>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="md:w-1/3">
                        <div className="w-32 h-32 mx-auto md:mx-0 relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full border-2 border-primary-500"
                          />
                          <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-1 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.memberSince}</p>
                          </div>
                          
                          <div>
                            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                              Edit Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bio</h3>
                      <p className="text-gray-600 dark:text-gray-300">{user.bio}</p>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {activities.slice(0, 3).map((activity) => (
                          <div key={activity.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                            <a href={activity.link} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                              {activity.content}
                            </a>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.date}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => setActiveTab('activity')}
                          className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300"
                        >
                          View All Activity
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Saved Items Tab */}
                {activeTab === 'saved' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Items</h2>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI Tools</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems.filter(item => item.type === 'tool').map((item) => (
                          <Card
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            link={item.link}
                            imageSrc={item.imageSrc}
                            tags={[item.type]}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tutorials</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems.filter(item => item.type === 'tutorial').map((item) => (
                          <Card
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            link={item.link}
                            imageSrc={item.imageSrc}
                            tags={[item.type]}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Productivity Hacks</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems.filter(item => item.type === 'hack').map((item) => (
                          <Card
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            link={item.link}
                            imageSrc={item.imageSrc}
                            tags={[item.type]}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Activity</h2>
                    
                    <div className="space-y-6">
                      {activities.map((activity) => (
                        <div key={activity.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                          <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                              activity.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                              activity.type === 'save' ? 'bg-green-100 text-green-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {activity.type === 'comment' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              )}
                              {activity.type === 'save' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                              )}
                              {activity.type === 'post' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <a href={activity.link} className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                                {activity.content}
                              </a>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input
                              type="text"
                              id="name"
                              defaultValue={user.name}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                              type="email"
                              id="email"
                              defaultValue={user.email}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                            <textarea
                              id="bio"
                              defaultValue={user.bio}
                              rows={4}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                            ></textarea>
                          </div>
                          
                          <div>
                            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                            <input
                              type="password"
                              id="current-password"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                            <input
                              type="password"
                              id="new-password"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              id="confirm-password"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div>
                            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                              Change Password
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="email-notifications"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Email Notifications
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="new-tools"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="new-tools" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              New AI Tools Announcements
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="new-tutorials"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="new-tutorials" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              New Tutorials
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="community-activity"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="community-activity" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Community Activity
                            </label>
                          </div>
                          
                          <div>
                            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                              Save Preferences
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;
