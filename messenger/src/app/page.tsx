import Image from 'next/image'
import Formulaire from './components/Formulaire'


export default function Home() {
  return (
    <div>
      <div className='flex bg-blue-900 items-center'>
        <button className='ml-4 text-white'>
          Return
        </button>
        <h1 className='flex-grow text-center font-bold text-2xl text-white'>MonoBot</h1>
      </div>
      <div className='container mx-auto'>
      <Formulaire />
      </div>
    </div>
  )
}
