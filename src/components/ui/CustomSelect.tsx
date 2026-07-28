import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  className = ""
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: { value: string; label: string; className?: string }[];
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-lg px-4 py-2 bg-white flex justify-between items-center cursor-pointer hover:border-[#3b82f6] transition-colors ${isOpen ? 'ring-2 ring-[#3b82f6]/20 border-[#3b82f6]' : 'border-gray-200'}`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto p-1">
                {options.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                      value === opt.value ? 'bg-blue-50 text-[#3b82f6] font-medium' : 'hover:bg-gray-50 text-gray-700'
                    } ${opt.className || ''}`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
