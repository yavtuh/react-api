import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import useAuthContext from '../contexts/AuthContext';

const useFetch = (url, method = 'get', body = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(new AbortController());
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (signal) => {
      setIsLoading(true);
      setError(null);
      try {
        const config = {
          url,
          method,
          signal,
        };
        if (body) {
          config.data = body;
        }

        const response = await api(config);
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setUser(null);
          navigate('/login');
        } else {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [url, method, body, navigate, setUser]
  );

  useEffect(() => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    fetchData(abortControllerRef.current.signal);

    return () => {
      abortControllerRef.current.abort();
    };
  }, [fetchData]);

  const refetch = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    fetchData(abortControllerRef.current.signal);
  };

  return { data, error, setIsLoading, setError, isLoading, refetch };
};

export default useFetch;
