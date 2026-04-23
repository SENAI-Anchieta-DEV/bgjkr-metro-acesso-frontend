import { useState, useEffect, useCallback } from 'react';

export function useFetch(fetchFn, deps = [], options = {}) {
  const { enabled = true } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [erro, setErro] = useState('');

  const execute = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setErro('');
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setErro(err?.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [enabled, ...deps]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, erro, refetch: execute };
}s