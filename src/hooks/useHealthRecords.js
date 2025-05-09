import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { healthRecordService } from '../services/healthRecordService';

export function useHealthRecords(activeTab, t) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    fetchUser();
  }, []);

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const { getHealthRecords } = await import('../lib/supabase/health-records');
      const fetchedRecords = await getHealthRecords(user.id, activeTab === 'all' ? null : activeTab);
      setRecords(fetchedRecords);
    } catch (err) {
      setError(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  }, [user, activeTab, t]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const deleteRecord = async (recordId) => {
    if (!user) return;
    try {
      await healthRecordService.deleteRecord(recordId, user.id);
      setRecords(prev => prev.filter(r => r.id !== recordId));
    } catch {
      setError(t('errors.deleteFailed'));
    }
  };

  return { records, loading, error, user, fetchRecords, deleteRecord, setError };
}
