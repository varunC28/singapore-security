import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Enquiry } from '@/types';
import { formatPrice } from '@/lib/constants';
import { Phone, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      setEnquiries(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, status: Enquiry['status']) => {
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (!error) {
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
    }
  };

  const filteredEnquiries = enquiries.filter(e => filter === 'all' ? true : e.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          {['all', 'new', 'contacted', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                filter === f ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No enquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry: Enquiry) => {
            const isExpanded = expandedId === enquiry.id;
            const items = (enquiry.items as any[]) || [];
            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            return (
              <div key={enquiry.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                {/* Header Row */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : enquiry.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">{enquiry.customer_name}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase tracking-wider ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <a href={`tel:${enquiry.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-[#3b82f6] transition-colors">
                        <Phone size={16} />
                        {enquiry.phone}
                      </a>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        {formatDate(enquiry.created_at)}
                      </div>
                      <div className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {enquiry.items.length} items • {formatPrice(enquiry.total)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <select
                      value={enquiry.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateStatus(enquiry.id, e.target.value as any);
                      }}
                      onClick={e => e.stopPropagation()}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#3b82f6] outline-none bg-white flex-1 sm:flex-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                    
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t border-gray-100 p-4 sm:p-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Order Details</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b border-gray-200">
                          <tr>
                            <th className="pb-2 font-medium">Product</th>
                            <th className="pb-2 font-medium">Price</th>
                            <th className="pb-2 font-medium">Qty</th>
                            <th className="pb-2 font-medium text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {items.map((item, idx) => (
                            <tr key={idx} className="text-gray-900">
                              <td className="py-3 font-medium">{item.name}</td>
                              <td className="py-3 text-gray-600">{formatPrice(item.price)}</td>
                              <td className="py-3 text-gray-600">&times;{item.quantity}</td>
                              <td className="py-3 font-medium text-right">{formatPrice(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="pt-4 text-right font-semibold text-gray-900">Total Estimate:</td>
                            <td className="pt-4 text-right font-bold text-[#3b82f6] text-base">{formatPrice(total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
