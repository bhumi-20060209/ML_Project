import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunc, autoFetch = true, initialParams = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const execute = useCallback(async (params = initialParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(params);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errMsg = err.message || 'An unexpected error occurred';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, initialParams]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  return { data, loading, error, refetch: execute };
};
