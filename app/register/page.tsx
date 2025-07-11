"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            alert('Password and Confirm Password do not match');
            return;
        }
        // send data to the backend

        try {
            // use react-query
            // for loading, error, debounce 
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password}) 
            })
            const data = await res.json();

            if(!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            console.log(data);
            router.push('/login');
        } catch (error) {
            console.log(error);
        }
    };

return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-800">
            <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Register</h1>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder:font-bold" />
                    </div>
                    <div>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder:font-bold" />
                    </div>
                    <div>
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder:font-bold" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
                        Register
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Already have an account? <a href="/login" className="text-indigo-500 hover:underline">Login</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default RegisterPage;