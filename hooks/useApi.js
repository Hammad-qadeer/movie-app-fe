import { useState } from 'react';

function useApi() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
    const [data, setData] = useState(null);

	const fetchRecord = async (url) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(url);
			const data = await response.json();
            setData(data);
			return data;
		} catch (error) {
			setError(error);
            setData(null);
		} finally {
			setIsLoading(false);
		}
	};

	const postRecord = async (url, data) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			const responseData = await response.json();
			return responseData;
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const patchRecord = async (url, data) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			const responseData = await response.json();
			return responseData;
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};



    

	return {
		isLoading,
		error,
		success,
        data,
		fetchRecord,
		postRecord,
		patchRecord
	};
}

export default useApi;
