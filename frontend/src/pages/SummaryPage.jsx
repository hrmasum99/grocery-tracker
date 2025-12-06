import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import api from '../services/api';

const SummaryPage = () => {
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({
    type: 'monthly',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
  });

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  const fetchSummary = async () => {
    try {
      const data = await api.expenses.getSummary(filters);
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2" />
          Summary Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Type"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
              { value: 'range', label: 'Date Range' },
            ]}
          />

          {filters.type === 'monthly' && (
            <>
              <Input
                label="Year"
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              />
              <Select
                label="Month"
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: new Date(2000, i).toLocaleString('default', { month: 'long' }),
                }))}
              />
            </>
          )}

          {filters.type === 'yearly' && (
            <Input
              label="Year"
              type="number"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            />
          )}

          {filters.type === 'range' && (
            <>
              <Input
                label="Start Date"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </>
          )}
        </div>
      </Card>

      {summary && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">{summary.title}</h3>
          <div className="text-5xl font-bold mt-4">${summary.totalExpenditure.toFixed(2)}</div>
          <p className="text-indigo-100 mt-2">Total Expenditure</p>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;