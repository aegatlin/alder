export async function get(id: string): Promise<Uint8Array | null> {
  const s = await fetch(`/api/lists/${id}`)
    .then((res) => res.json())
    .then((body) => body.data)

  return s ? deserialize(s) : null
}

export async function set(id: string, binary: Uint8Array): Promise<number> {
  const s = serialize(binary)

  const res = await fetch(`/api/lists/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: s }),
  })

  return res.status
}

const serialize = (a: Uint8Array): string => {
  return a.toString()
}

const deserialize = (s: string): Uint8Array => {
  // example: "123,14,78,241"
  const numArray = s.split(',').map((i) => parseInt(i))
  return Uint8Array.from(numArray)
}
