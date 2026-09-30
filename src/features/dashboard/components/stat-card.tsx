import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: string
  description: string
}

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
