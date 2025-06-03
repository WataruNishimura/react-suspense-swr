import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-4 p-4">
        <Link to="/" activeProps={{ style: { fontWeight: 'bold' } }}>
          Home
        </Link>
        <Link to="/multiple-suspense" activeProps={{ style: { fontWeight: 'bold' } }}>
          Multiple Suspense
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})