import { useRef, KeyboardEvent, ChangeEvent, ClipboardEvent } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function OTPInput({ value, onChange, error, disabled }: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, ''); // Ensure numeric
    if (!val) return;

    // We only take the last character entered in case of fast typing
    const newChar = val[val.length - 1];
    const newValue = value.split('');
    newValue[index] = newChar;
    const finalValue = newValue.join('').slice(0, 6);
    onChange(finalValue);

    // Move to next input
    if (index < 5 && newChar) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = value.split('');
      
      // If there's a value in the current box, clear it
      if (newValue[index]) {
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        // If empty, move to previous and clear it
        newValue[index - 1] = '';
        onChange(newValue.join(''));
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      onChange(pastedData);
      const focusIndex = Math.min(pastedData.length, 5);
      inputsRef.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 md:space-x-3">
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const char = value[index] || '';
          return (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={char}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              disabled={disabled}
              className={`w-12 h-14 md:w-14 md:h-16 rounded-xl border-2 text-center text-xl font-bold bg-white text-gray-900 transition-colors focus:outline-none
                ${
                  error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#3b82f6]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
              `}
              maxLength={2}
            />
          );
        })}
      </div>
      {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
    </div>
  );
}
