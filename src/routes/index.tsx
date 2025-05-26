import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import useSWR, { mutate } from 'swr'

const API_URL = '/api/time'

const fetcher = (url: string) => 
  new Promise((resolve) => setTimeout(resolve, 3000))
    .then(() => ({
      datetime: new Date().toISOString(),
      unixtime: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      random: Math.random()
    }))

function WithSuspenseComponent() {
  const { data } = useSWR(API_URL, fetcher, {
    suspense: true,
    onSuccess: (data) => {
      console.log('[WithSuspense] Data fetched:', data)
    },
  })

  console.log('[WithSuspense] Component rendered')

  return (
    <div style={{ border: '2px solid green', padding: '10px', borderRadius: '8px' }}>
      <h3>With Suspense (suspense: true)</h3>
      <p>This component uses React Suspense</p>
      <p><strong>Time:</strong> {data?.datetime}</p>
      <p><strong>Unix time:</strong> {data?.unixtime}</p>
      <p><strong>Timezone:</strong> {data?.timezone}</p>
      <p><strong>Random:</strong> {data?.random}</p>
    </div>
  )
}

function WithoutSuspenseComponent() {
  const { data, error, isLoading } = useSWR(API_URL, fetcher, {
    suspense: false,
    onSuccess: (data) => {
      console.log('[WithoutSuspense] Data fetched:', data)
    },
  })

  console.log('[WithoutSuspense] Component rendered, isLoading:', isLoading)

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading time data...</div>

  return (
    <div style={{ border: '2px solid blue', padding: '10px', borderRadius: '8px' }}>
      <h3>Without Suspense (suspense: false)</h3>
      <p>This component handles loading state manually</p>
      <p><strong>Time:</strong> {data?.datetime}</p>
      <p><strong>Unix time:</strong> {data?.unixtime}</p>
      <p><strong>Timezone:</strong> {data?.timezone}</p>
      <p><strong>Random:</strong> {data?.random}</p>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const handleMutate = () => {
    console.log('=== MUTATE TRIGGERED ===')
    mutate(API_URL)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>React Suspense with SWR Demo</h1>
      
      <button 
        onClick={handleMutate}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Mutate (Refetch Data)
      </button>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Component with Suspense:</h2>
        <Suspense fallback={<div style={{ color: 'orange' }}>Loading via Suspense boundary...</div>}>
          <WithSuspenseComponent />
        </Suspense>
      </div>

      <div>
        <h2>Component without Suspense:</h2>
        <WithoutSuspenseComponent />
      </div>
    </div>
  )
}