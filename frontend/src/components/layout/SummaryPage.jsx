'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Calendar, PieChart, BarChart3, Loader2 } from 'lucide-react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import api from '@/services/api';

const SummaryPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'monthly',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
  });

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.expenses.getSummary(filters);
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center animate-slideInLeft">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Financial Summary
        </h1>
        <p className="text-gray-600">Track and analyze your spending patterns</p>
      </div>

      {/* Filters Card */}
      <Card className="p-6 animate-slideInRight">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
            <BarChart3 className="text-purple-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Summary Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Report Type"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            options={[
              { value: 'monthly', label: '📅 Monthly Report' },
              { value: 'yearly', label: '📆 Yearly Report' },
              { value: 'range', label: '📊 Custom Range' },
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

      {/* Summary Results */}
      {loading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
            <p className="text-gray-600">Loading summary...</p>
          </div>
        </Card>
      ) : summary ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Summary Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-105 transition-all duration-300 animate-fadeIn relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <TrendingUp size={32} />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Total Expenditure</p>
                    <h3 className="text-2xl font-bold">{summary.title}</h3>
                  </div>
                </div>
                <div className="bg-white/20 p-4 rounded-full animate-pulse-slow backdrop-blur-sm">
                  <span className="text-3xl font-bold">৳</span>
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <div className="text-6xl md:text-7xl font-bold mb-2 animate-float">
                  ৳{summary.totalExpenditure.toFixed(2)}
                </div>
                <div className="flex items-center space-x-2 text-green-100">
                  <Calendar size={16} />
                  <span className="text-sm">
                    {new Date(summary.start).toLocaleDateString()} - {new Date(summary.end).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 p-3 rounded-full">
                  <PieChart className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-green-700 mb-1">Daily Average</p>
              <p className="text-3xl font-bold text-green-900">
                ৳{summary.totalExpenditure > 0 
                  ? (summary.totalExpenditure / Math.ceil((new Date(summary.end) - new Date(summary.start)) / (1000 * 60 * 60 * 24))).toFixed(2)
                  : '0.00'}
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Calendar className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-blue-700 mb-1">Report Period</p>
              <p className="text-2xl font-bold text-blue-900">
                {Math.ceil((new Date(summary.end) - new Date(summary.start)) / (1000 * 60 * 60 * 24))} days
              </p>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BarChart3 className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No data available</h3>
          <p className="text-gray-500">Select a date range to view summary</p>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInLeft">
        <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl">
              <TrendingUp className="text-green-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Track Trends</p>
              <p className="text-lg font-bold text-gray-900">Real-time</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl">
              <PieChart className="text-blue-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Insights</p>
              <p className="text-lg font-bold text-gray-900">AI Powered</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl">
              <BarChart3 className="text-purple-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reports</p>
              <p className="text-lg font-bold text-gray-900">Detailed</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SummaryPage;