export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="md:px-6 md:pb-6">
        <div className="bg-dark md:rounded-2xl w-full text-white/70 relative pt-12 pb-6 px-6 md:px-12">
          {/* Subtle accent glow at the top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-accent shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
              <div className="md:col-span-5 lg:col-span-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                  Singapore Security
                  <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
                </h2>
                <p className="text-white/60 text-sm">Premium CCTV & Security Solutions</p>
              </div>
              
              <div className="md:col-span-7 lg:col-span-8 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20 md:justify-end">
                <div className="max-w-xs">
                  <h3 className="label-text text-white/50 text-xs font-bold uppercase tracking-wider mb-4">Visit Us</h3>
                  <p className="mb-2 text-sm">LG 16A Silver Mall 8, RNT Road, Indore-452001, Madhya Pradesh</p>
                  <a 
                    href="https://maps.app.goo.gl/ae4uGFGYZoe9ZMrB8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent-400 hover:text-accent-300 transition-colors text-sm"
                  >
                    Google Maps
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
                
                <div className="shrink-0">
                  <h3 className="label-text text-white/50 text-xs font-bold uppercase tracking-wider mb-4">Contact</h3>
                  <a href="tel:9424066666" className="flex items-center gap-2 mb-3 text-[#60a5fa] hover:text-[#3b82f6] transition-colors text-sm font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    9424066666
                  </a>
                  <a 
                    href="https://wa.me/919424066666" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    WhatsApp
                  </a>
                </div>
                
                <div className="shrink-0">
                  <h3 className="label-text text-white/50 text-xs font-bold uppercase tracking-wider mb-4">Hours</h3>
                  <p className="mb-1 text-sm">Mon – Sat: 10:00 AM – 8:00 PM</p>
                  <p className="text-sm">Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10 text-xs text-white/40 flex justify-center md:justify-start">
              © 2024 Singapore Security. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
