import Link from 'next/link'

export default function IndexPage() {
  return (
    <main className="flex flex-col items-center space-y-8">
      <h1 className="my-4 text-4xl">Grocl</h1>
      <div className="">Welcome to Grocl</div>
      <div className="">
        <Link href={'/lists'}>Go to lists</Link>
      </div>
    </main>
  )
}
