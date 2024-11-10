'use client';
import { Input, Textarea } from '@nextui-org/input';
import { useFormik } from 'formik';
import React from 'react';
import useApi from '../../hooks/useApi';
import { Button } from '@nextui-org/button';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	username: Yup.string()
		.required('Username is required')
		.min(3, 'Username must be at least 3 characters')
		.max(50, 'Username must not exceed 50 characters'),

	password: Yup.string()
		.required('Password is required')
		.min(8, 'Password must be at least 8 characters')
		.max(100, 'Password must not exceed 100 characters')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/\d/, 'Password must contain at least one number')
		.matches(/[@$!%*?&]/, 'Password must contain at least one special character'),

	confirmPassword: Yup.string()
		.required('Confirm password is required')
		.oneOf([Yup.ref('password'), null], 'Passwords must match'),

	name: Yup.string().required('Name is required').max(100, 'Name must not exceed 100 characters'),

	address: Yup.string().required('Address is required').max(200, 'Address must not exceed 200 characters'),
});

function SignUp() {
	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
			name: '',
			address: '',
		},
		validationSchema,
		onSubmit: async (values) => {
			const { username, password, name, address } = values;
			await postRecord('/auth/signup', { username, password, name, address });
		},
	});

	console.log(formik);
	const { postRecord, isLoading, success, error } = useApi();

	const [isVisible, setIsVisible] = React.useState(false);

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<label htmlFor='email'></label>
				<Input
					placeholder='Username'
					id='username'
					name='username'
					onChange={formik.handleChange}
					value={formik.values.username}
					className='my-6'
					isInvalid={formik.errors['username'] && formik.touched['username']}
					errorMessage={formik.errors['username']}
				/>

				<Input
					id='password'
					name='password'
					endContent={
						<button
							className='focus:outline-none'
							type='button'
							onClick={toggleVisibility}
							aria-label='toggle password visibility'
						>
							{isVisible ? (
								'+'
							) : (
								'-'
							)}
						</button>
					}
					type={isVisible ? 'text' : 'password'}
					onChange={formik.handleChange}
					value={formik.values.password}
					placeholder='Password'
					className='my-6'
					isInvalid={formik.errors['password'] && formik.touched['password']}
					errorMessage={formik.errors['password']}
				/>

				<Input
					endContent={
						<button
							className='focus:outline-none'
							type='button'
							onClick={toggleVisibility}
							aria-label='toggle password visibility'
						>
							{isVisible ? (
								'+'
							) : (
								'-'
							)}
						</button>
					}
					type={isVisible ? 'text' : 'password'}
					id='confirm-password'
					name='confirmPassword'
					onChange={formik.handleChange}
					value={formik.values.confirmPassword}
					placeholder='Confirm Password'
					className='my-6'
					isInvalid={formik.errors['confirmPassword'] && formik.touched['confirmPassword']}
					errorMessage={formik.errors['confirmPassword']}
				/>

				<Input
					id='name'
					name='name'
					onChange={formik.handleChange}
					value={formik.values.name}
					placeholder='Name'
					className='my-6'
					isInvalid={formik.errors['name'] && formik.touched['name']}
					errorMessage={formik.errors['name']}
				/>

				<Textarea
					id='address'
					name='address'
					onChange={formik.handleChange}
					value={formik.values.address}
					placeholder='Address'
					className='my-6'
					isInvalid={formik.errors['address'] && formik.touched['address']}
					errorMessage={formik.errors['address']}
				/>

				<Button className='text-white bg-primary' type='submit'>
					Submit
				</Button>
			</form>
		</div>
	);
}

export default SignUp;
