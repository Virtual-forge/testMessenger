import Image from 'next/image'
import ChatInput from './components/ChatInput'

export default function Home() {
  return (
    <div>
      <div>
        <h1>MonoBot</h1>
      </div>
      <div className='container mx-auto '>
        <ChatInput />
      </div>
    </div>
  )
}
