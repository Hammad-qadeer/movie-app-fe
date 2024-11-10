'use client';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import useApi from '../hooks/useApi';
import { useFormik } from 'formik';

import { useRouter } from "next/navigation";
export default function Home() {
	const { postRecord, isLoading } = useApi();

  const router = useRouter();
	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
		},
		onSubmit: async (values) => {
      console.log('Values', values)
			const { username, password,  } = values;
			const result = await postRecord('http://localhost:3000/auth/login', { username, password });
      console.log('Result', result)
      localStorage.setItem("token", result.access_token); // Save token to localStorage
      localStorage.setItem("userId", result.userId);
     
      if(result.access_token) {
        router.push("/movies"); // Redirect to movies page after login
      } else {
        alert("Login failed");
      }
      

		},
	});

	return (
		<div>
			<h2 className='text-3xl font-bold text-center text-primary'>Login</h2>
      <form onSubmit={formik.handleSubmit}>
			<div className='space-y-4'>
				<Input
					placeholder='Username'
					id='username'
					name='username'
					onChange={formik.handleChange}
					value={formik.values.username}
					className='my-6'
				/>
				<Input
					id='password'
					name='password'
					type='password'
					onChange={formik.handleChange}
					value={formik.values.password}
					placeholder='Password'
					className='my-6'
				/>
			</div>

			<Button type='submit' disabled={isLoading} className='text-white bg-primary my-4'>
				Login
			</Button>
      </form>

			<p className='text-center text-gray-400'>
				Don't have an account?{' '}
				<a href='/signup' className='text-blue-500 hover:text-blue-400'>
					Sign up
				</a>
			</p>
		</div>
	);
}
