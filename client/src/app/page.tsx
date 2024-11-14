'use client'
import { ExampleButton } from '@/components/ExampleButton'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Link href={'/welcome-page'}>
        <ExampleButton>Перейти на страницу Welcome!</ExampleButton>
      </Link>
    </div>
  )
}
