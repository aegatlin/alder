export async function get(id: string): Promise<Uint8Array | null> {
  const res = await fetch(`/api/docs/${id}`)
  const buf = await res.arrayBuffer()
  const u = new Uint8Array(buf)
  return u
}

export async function set(id: string, binary: Uint8Array): Promise<number> {
  const res = await fetch(`/api/docs/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: binary,
  })

  return res.status
}
