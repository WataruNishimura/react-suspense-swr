import { createFileRoute } from '@tanstack/react-router'
import useSWR from 'swr'
import { Suspense } from 'react'

export const Route = createFileRoute('/multiple-suspense')({
  component: MultipleSuspensePage,
})

const fetcher = (url: string, delay: number = 2000) =>
  new Promise<any>((resolve) => {
    setTimeout(() => {
      const data: Record<string, any> = {
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        posts: [
          { id: 1, title: 'First Post', content: 'This is my first post' },
          { id: 2, title: 'Second Post', content: 'Another interesting post' },
          { id: 3, title: 'Third Post', content: 'Yet another post' },
        ],
        stats: {
          totalUsers: 1234,
          totalPosts: 5678,
          activeToday: 234,
          lastUpdated: new Date().toISOString(),
        },
      }
      resolve(data[url] || { error: 'Not found' })
    }, delay)
  })

function UserData() {
  const { data } = useSWR('user', () => fetcher('user', 1000), {
    suspense: true,
  })

  return (
    <div className="bg-blue-50 p-4 rounded">
      <h3 className="font-bold mb-2">User Information</h3>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
    </div>
  )
}

function PostsList() {
  const { data } = useSWR('posts', () => fetcher('posts', 2000), {
    suspense: true,
  })

  return (
    <div className="bg-green-50 p-4 rounded">
      <h3 className="font-bold mb-2">Recent Posts</h3>
      <ul className="list-disc list-inside">
        {data.map((post: any) => (
          <li key={post.id}>
            <strong>{post.title}</strong>: {post.content}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Statistics() {
  const { data } = useSWR('stats', () => fetcher('stats', 3000), {
    suspense: true,
  })

  return (
    <div className="bg-purple-50 p-4 rounded">
      <h3 className="font-bold mb-2">Platform Statistics</h3>
      <div className="grid grid-cols-2 gap-2">
        <p>Total Users: {data.totalUsers}</p>
        <p>Total Posts: {data.totalPosts}</p>
        <p>Active Today: {data.activeToday}</p>
        <p>Updated: {new Date(data.lastUpdated).toLocaleTimeString()}</p>
      </div>
    </div>
  )
}

function SimultaneousData() {
  // Call multiple useSWR hooks at the same time
  const { data: userData } = useSWR('user-sim', () => fetcher('user', 1500), {
    suspense: true,
  })
  const { data: postsData } = useSWR('posts-sim', () => fetcher('posts', 1500), {
    suspense: true,
  })
  const { data: statsData } = useSWR('stats-sim', () => fetcher('stats', 1500), {
    suspense: true,
  })

  return (
    <div className="bg-orange-50 p-4 rounded">
      <h3 className="font-bold mb-2">Simultaneous Data Loading</h3>
      <div className="space-y-2">
        <div>
          <strong>User:</strong> {userData.name} ({userData.email})
        </div>
        <div>
          <strong>Posts:</strong> {postsData.length} posts available
        </div>
        <div>
          <strong>Stats:</strong> {statsData.totalUsers} users, {statsData.activeToday} active today
        </div>
      </div>
    </div>
  )
}

function MultipleSuspensePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Multiple useSWR with Suspense Example
      </h1>
      
      <p className="mb-4 text-gray-600">
        This page demonstrates three different useSWR calls with suspense enabled,
        each with different loading times (1s, 2s, and 3s).
      </p>

      <div className="space-y-4">
        <Suspense fallback={<LoadingCard>Loading user data...</LoadingCard>}>
          <UserData />
        </Suspense>

        <Suspense fallback={<LoadingCard>Loading posts...</LoadingCard>}>
          <PostsList />
        </Suspense>

        <Suspense fallback={<LoadingCard>Loading statistics...</LoadingCard>}>
          <Statistics />
        </Suspense>

        <Suspense fallback={<LoadingCard>Loading simultaneous data...</LoadingCard>}>
          <SimultaneousData />
        </Suspense>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <h3 className="font-bold mb-2">Observations:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Each component suspends independently with its own loading state</li>
          <li>Components load progressively as their data becomes available</li>
          <li>User data loads first (1s), then posts (2s), then stats (3s)</li>
          <li>Each Suspense boundary handles its own error/loading state</li>
          <li>SimultaneousData component calls 3 useSWR hooks at once, all complete in 1.5s</li>
        </ul>
      </div>
    </div>
  )
}

function LoadingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 p-4 rounded animate-pulse">
      <div className="text-gray-500">{children}</div>
    </div>
  )
}