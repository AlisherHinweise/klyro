import { ExampleButton } from '@/components/ExampleButton'
import Link from 'next/link'
import React from 'react'

const Welcome = () => {
  return (
    <Link href={'/'}>
      <ExampleButton>Вернуться на главную</ExampleButton>
    </Link>
  )
}

export default Welcome
