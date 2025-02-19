import { api } from '@/lib/api'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export const laravelEcho = (namespace: string) =>
    new Echo({
        broadcaster: 'pusher',
        key: "8581aba0bfe53dec0e52",
        namespace: namespace,
        client: new Pusher("8581aba0bfe53dec0e52", {
            cluster: "ap4",
            forceTLS: true,
            authorizer: channel => {
                return {
                    authorize: (socketId, callback) => {
                        api.post('/api/broadcasting/auth', {
                            socket_id: socketId,
                            channel_name: channel.name
                        })
                            .then(response => {
                                callback(null, response.data)
                            })
                            .catch(error => {
                                callback(error, null)
                            })
                    }
                }
            }
        })
    })
