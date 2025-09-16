import React, { useState, useContext } from 'react';
import { register } from '../api/authService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Signup(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const { data } = await register({ name, email, password });
      setUser(data);
      toast.success('Account created successfully!');
      nav('/');
    }catch(err){ 
      toast.error(err?.response?.data?.message || 'Failed to create account');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full p-2 border rounded"/>
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded"/>
        <input required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded"/>
        <button className="w-full bg-green-600 text-white p-2 rounded">Create</button>
      </form>
    </div>
  )
}
