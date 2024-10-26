import React from 'react'

const Errorpage = () => {
    const handleNavigate = () => {
        window.location.href = '/';
    }
    return (
        <>
            <div className="bg-slate-900 text-white flex gap-4 flex-col justify-center items-center h-screen">
                <h3 className='text-4xl text-red-500 font-bold'>Error 404</h3>
                <p className='text-3xl'>This is not the web page you are looking for.</p>
                <button onClick={handleNavigate} className='border px-2 p-1 rounded bg-black'>go back to main page</button>
            </div>
        </>
    )
}

export default Errorpage