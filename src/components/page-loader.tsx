import { Spinner } from '@/components/ui/spinner'

/** Full-screen loading state (initial route load, guards). */
export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  )
}
