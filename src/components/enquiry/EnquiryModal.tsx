import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/constants';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

import OTPInput from './OTPInput';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'details' | 'otp' | 'success';

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const { items: cartItems, totalPrice, clearCart } = useCartStore();
  const cartTotal = totalPrice();
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Firebase Auth state
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('details');
      setName('');
      setPhone('');
      setOtp('');
      setError('');
      setLoading(false);
      setResendTimer(0);
      setConfirmationResult(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && step === 'details' && !loading) {
      onClose();
    }
  };

  const validatePhone = (p: string) => {
    return /^[6-9]\d{9}$/.test(p);
  };

  const setupRecaptcha = () => {
    const win = window as any;
    if (!win.recaptchaVerifier) {
      win.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit Indian phone number starting with 6-9');
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const win = window as any;
      const appVerifier = win.recaptchaVerifier;
      const phoneNumber = `+91${phone}`;

      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      
      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
      
      // Reset recaptcha if error
      const win = window as any;
      if (win.recaptchaVerifier) {
        win.recaptchaVerifier.clear();
        win.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6 || !confirmationResult) return;
    setError('');
    setLoading(true);

    try {
      // 1. Verify OTP with Firebase
      await confirmationResult.confirm(otp);

      // 2. Submit enquiry to Supabase
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          phone: `+91${phone}`,
          customer_name: name,
          items: cartItems,
          total: cartTotal
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save enquiry');
      }

      clearCart();
      setStep('success');
    } catch (err: any) {
      console.error('OTP Verification failed:', err);
      setError('Invalid OTP or verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div id="recaptcha-container"></div>
      
      <div className="relative w-full max-w-md bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-[#334155]">
        
        {step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#334155]/50 text-gray-400 hover:bg-[#334155] hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence initial={false} mode="wait">
            {step === 'details' && (
              <motion.div
                key="details"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="p-6 md:p-8 flex flex-col h-full"
              >
                <h2 className="text-xl font-bold text-white mb-2">Send Enquiry</h2>
                <p className="text-sm text-gray-400 mb-6">
                  {itemCount} item(s) • Total: {formatPrice(cartTotal)}
                </p>

                <form onSubmit={handleSendOTP} className="space-y-5 flex-grow">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-white focus:outline-none focus:border-[#3b82f6] transition-colors text-[16px]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-[#334155] bg-[#334155] text-gray-300 text-[16px] font-medium">
                        +91
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-r-xl text-white focus:outline-none focus:border-[#3b82f6] transition-colors text-[16px]"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                  
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || phone.length !== 10 || name.length < 2}
                      className="w-full py-3.5 px-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="p-6 md:p-8 flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-full flex justify-start mb-4">
                  <button
                    onClick={() => setStep('details')}
                    className="text-gray-400 hover:text-white flex items-center text-sm font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                <p className="text-gray-400 text-sm mb-8">
                  Enter the 6-digit code sent to +91 {phone}
                </p>

                <OTPInput value={otp} onChange={setOtp} disabled={loading} error={error} />

                <div className="mt-6 mb-8">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in <span className="text-white">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={() => handleSendOTP()}
                      disabled={loading}
                      className="text-sm font-medium text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 px-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Verify'
                  )}
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="p-8 md:p-10 flex flex-col items-center justify-center h-full text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-3">Enquiry Sent Successfully!</h2>
                <p className="text-gray-400 mb-8">
                  Our team will reach you shortly on<br/>
                  <span className="text-white font-medium">+91 {phone}</span>
                </p>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 px-4 bg-[#334155] hover:bg-[#475569] text-white rounded-xl font-semibold transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
