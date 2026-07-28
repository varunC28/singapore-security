export default function ProductSkeleton() {
  return (
    <div className="bg-dark rounded-2xl overflow-hidden product-card flex flex-col animate-pulse">
      <div className="aspect-square skeleton-dark bg-dark-200"></div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-4 skeleton-dark bg-white/10 rounded w-[70%] mb-2"></div>
        <div className="h-4 skeleton-dark bg-white/10 rounded w-[50%] mb-4"></div>
        
        <div className="h-3 skeleton-dark bg-white/5 rounded w-[30%] mb-auto"></div>
        
        <div className="mt-4">
          <div className="h-6 skeleton-dark bg-white/10 rounded w-[40%] mb-4"></div>
          <div className="h-[44px] skeleton-dark bg-white/10 rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );
}
