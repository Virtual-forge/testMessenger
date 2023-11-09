'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation';
function Formulaire ()  {
    const [username, setUsername] = useState('');
    const [url, setUrl] = useState('');
    const router = useRouter();
    const handleSubmit = (e) => {
      e.preventDefault();
        axios.post('../api/setupUser' , {
            username : username,
            url : url
        }).then(function (response){
            if(response.data != 'success'){
                alert(`The bot wasn't initiliazed please try again !`);
            }else{
                router.push('/ChatBot');
            }

          })
      // You can send the data to a server or perform other actions here
    };
  
    return (
      <div className='flex justify-center'>
        <div className='flex flex-col'>
            <div>
            <h1 className=' font-bold rounded text-2xl bg-gray-800 p-2 m-4 text-center px-24 '>Client Information :</h1>
            </div>
            
            <form 
            onSubmit={handleSubmit}
            className='flex flex-col bg-gray-900 rounded-xl p-4 m-4 py-14 items-center space-y-6'
            >
            <div>
                <label>
                Username: 
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className='text-black font-bold text-md rounded-md'
                />
                </label>
            </div>
            <div>
                <label>
                URL:
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className='text-black font-bold text-md rounded-md'
                />
                </label>
            </div>
            <div>
                <button 
                type="submit"
                className='bg-blue-700 p-1 m-2 rounded'
                >Submit</button>
            </div>
            </form>
        </div>
      </div>
    );
}

export default Formulaire