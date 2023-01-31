## API

`/docs/[id]`: GET and POST, works for any automerge doc

## Thinking out loud

Will eventually have p2p communication, preferably through webrtc, and websockets for servers (though edge runtimes with web apis support could eventually allow for servers to also be webrtc peers that are always connectable.)

There is the ListDoc, and sharing that list between peers will require communication. Some cloud storage will be required to store peer-connection information. This can be initiated by visiting the uuid-based url. E.g., `uuid-users` could be a list of users or an amdoc. The amdoc could just contain a list of users. But what "is" a user? It can't be a peer id because that is transient.

ID per device, saved to redis. ID is associated with webrtc connection details, e.g., peerjs id, saved to redis as well. device visits list, gets list users and users webrtc connection details, connects to each user.