'use client';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import useApi from '../../hooks/useApi';
import { Spinner } from '@nextui-org/spinner';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Select, SelectItem } from '@nextui-org/select';
import { useFormik } from 'formik/dist';
import { Input, Textarea } from '@nextui-org/input';
import { useRouter } from 'next/navigation';
import {Chip } from '@nextui-org/chip'
const RATINGARRAY = [1, 2, 3, 4, 5];


export default function MoviesPage() {
	const router = useRouter();
	const { fetchRecord, postRecord, data: movies, isLoading, success, error } = useApi();
	const { fetchRecord: fetchUserData, data: userData, isLoading: userDataLoading } = useApi();
	const { fetchRecord: fetchCategories, data: categoriesData, isLoading: loadingCategories } = useApi();
	const { patchRecord, isLoading: patchLoading, success: patchSuccess, error: patchError } = useApi();

	const handleUserRating = async (userRating, movieId) => {
		await postRecord(`http://localhost:3000/rating`, {
			userId: localStorage.getItem('userId'),
			movieId,
			ratingNumber: userRating,
		});

		await fetchRecord(`http://localhost:3000/rating/with-user-rating/${localStorage.getItem('userId')}`);
	};

	useEffect(() => {
		fetchRecord(`http://localhost:3000/rating/with-user-rating/${localStorage.getItem('userId')}`);
		fetchUserData(`http://localhost:3000/users/${localStorage.getItem('userId')}`);
		fetchCategories(`http://localhost:3000/categories`);
	}, []);

	if ((isLoading && !movies) || (userDataLoading && !userData)) {
		return (
			<div className='flex flex-row items-center'>
				<Spinner size='lg' />
			</div>
		);
	}

	const MoviesComponent = () => {
		return (
			<div className='container mx-auto px-4'>
				<div className='grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{movies &&
						movies?.length > 0 &&
						movies.map((movie) => (
							<div
								key={movie.id}
								className='bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105'
							>
								{/* <img src={`https://picsum.photos/400/300?random=${index + 1}`} alt={movie.title} className='w-full h-48 object-cover' /> */}
								<div className='p-4'>
									<h3 className='text-xl font-semibold text-white mb-1'>{movie.title.toUpperCase()}</h3>
									<p className='text-sm text-gray-400 mb-3'>{movie.description}</p>
									<div className='flex flex-row'>
                                        {
                                            movie.categories.map((category)=> {
                                                return (
                                                    <div className='flex flex-row'>
                                                        <Chip className='bg-primary text-white mr-2'>
                                                        {category.categoryName}
                                                        </Chip>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
									<div className='text-yellow-400  my-4 mt-6'>
										{RATINGARRAY.map((rating, index) => (
											<span
												key={index}
												onClick={() => {
													handleUserRating(rating, movie.id);
												}}
												className={`${
													movie.userRating && movie.userRating === rating
														? ' text-white rouned-lg border-2 border-yellow-400 rounded-lg px-2 py-1 cursor-pointer'
														: 'mr-2 p-1 my-2 cursor-pointer hover:bg-yellow-400 text-white rounded-lg'
												}`}
											>
												{rating}
											</span>
										))}
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		);
	};

	const UserComponent = ({ userData }) => {
		
		const [isVisible, setIsVisible] = useState(false);

		const toggleVisibility = () => setIsVisible(!isVisible);
		const formik = useFormik({
			initialValues: {
				username: userData.username,
				// password: userData.password,
				name: userData.name,
				address: userData.address,
				categories: userData.categories,
			},
			// validationSchema,
			onSubmit: async (values) => {
				const { username, password, name, address, categories } = values;
				await patchRecord(`http://localhost:3000/users/${localStorage.getItem('userId')}`, {
					username,
					password,
					name,
					address,
					categories: categories.split(','),
				});
			},
		});

		return (
			<>
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

						<Select
							label='Favorite Animal'
							placeholder='Select an animal'
							selectionMode='multiple'
							className='max-w-xs my-2'
							name='categories'
							onChange={formik.handleChange}
							defaultSelectedKeys={userData.categories.map((category) => category.id.toString())}
							multiple={true}
						>
							{categoriesData?.map((category) => (
								<SelectItem key={category.id}>{category.categoryName}</SelectItem>
							))}
						</Select>

						<div>
							<Button className='text-white bg-primary' type='submit'>
								Update
							</Button>
						</div>
					</form>
				</div>
			</>
		);
	};

	return (
		<div>
			<div className='flex flex-row justify-between items-center'>
				<h2 className='text-2xl font-bold'>User</h2>

				<Button
					className='bg-primary text-white'
					onClick={() => {
						localStorage.removeItem('token');
						localStorage.removeItem('userId');
						router.push('/');
					}}
				>
					Logout
				</Button>
			</div>

			<Tabs>
				<Tab key='movies' title='Movies'>
					<MoviesComponent />
				</Tab>
				<Tab key='user' title='User'>
					<UserComponent userData={userData} />
				</Tab>
			</Tabs>
		</div>
	);
}
