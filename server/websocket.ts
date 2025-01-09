import { Server } from 'socket.io'
import { createServer } from 'http'
import next from 'next'

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(server)

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })

    // Handle real-time updates for maintenance requests
    socket.on('maintenanceUpdate', (data) => {
      // Broadcast the update to all connected clients
      io.emit('maintenanceUpdate', data)
    })
  })

  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
  })
})

export { io }

