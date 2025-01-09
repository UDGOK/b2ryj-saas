import { Activity } from 'lucide-react'

const activities = [
  {
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    title: "New tenant application received",
    description: "John Doe applied for Apartment 3B",
    timestamp: "2 hours ago",
  },
  {
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    title: "Maintenance request completed",
    description: "Fixed leaky faucet in Apartment 2A",
    timestamp: "4 hours ago",
  },
  {
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    title: "Rent payment received",
    description: "Jane Smith paid $1,200 for Apartment 1C",
    timestamp: "Yesterday at 3:45 PM",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            {activity.icon}
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

