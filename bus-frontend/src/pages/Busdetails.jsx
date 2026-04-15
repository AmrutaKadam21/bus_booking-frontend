// import React, { useEffect, useMemo, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import Search from '../components/Home/Search';
// import SearchResult from '../components/Service/SearchResult';
// // import Leftcard from '../components/BusBooking/Leftcard';
// // import Sortcard from '../components/BusBooking/Sortcard';
// // import BusResultCard from '../components/BusBooking/BusResultCard';
// // import BookingModal from '../components/BusBooking/BookingModal';
// // import TicketCard from '../components/BusBooking/TicketCard';
// // import { useSearchContext } from '../context/SearchContext';
// // import { createBooking, fetchRoutes } from '../services/busService';

// const Busdetails = () => {
//   // const { criteria, updateCriteria, updateMeta, resultMeta } = useSearchContext();
//   // const [searchParams] = useSearchParams();
//   // const [routes, setRoutes] = useState([]);
//   // const [status, setStatus] = useState('idle');
//   // const [error, setError] = useState('');
//   // const [sortOption, setSortOption] = useState('departure');
//   // const [filters, setFilters] = useState({ busTypes: [], departureSlot: '', maxPrice: 0 });
//   // const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });
//   // const [filtersInitialized, setFiltersInitialized] = useState(false);
//   // const [bookingRoute, setBookingRoute] = useState(null);
//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [bookingSuccess, setBookingSuccess] = useState(null);
//   // const [bookingError, setBookingError] = useState('');

//   // useEffect(() => {
//   //   setFilters(prev => ({ ...prev, maxPrice: 0 }));
//   //   setFiltersInitialized(false);
//   // }, [criteria.origin, criteria.destination, criteria.travelDate]);

//   // useEffect(() => {
//   //   const origin = searchParams.get('origin');
//   //   const destination = searchParams.get('destination');
//   //   const travelDate = searchParams.get('date');

//   //   const updates = {};
//   //   if (origin && origin !== criteria.origin) {
//   //     updates.origin = origin;
//   //   }
//   //   if (destination && destination !== criteria.destination) {
//   //     updates.destination = destination;
//   //   }
//   //   if (travelDate && travelDate !== criteria.travelDate) {
//   //     updates.travelDate = travelDate;
//   //   }

//   //   if (Object.keys(updates).length) {
//   //     updateCriteria(updates);
//   //   }
//   // }, [searchParams, updateCriteria, criteria]);

//   // useEffect(() => {
//   //   if (!criteria.origin || !criteria.destination || !criteria.travelDate) {
//   //     return;
//   //   }

//   //   setStatus('loading');
//   //   setError('');

//   //   const query = {
//   //     origin: criteria.origin,
//   //     destination: criteria.destination,
//   //     travelDate: criteria.travelDate,
//   //     sortBy: sortOption,
//   //     maxPrice: filters.maxPrice || undefined,
//   //     departureSlot: filters.departureSlot || undefined,
//   //     busTypes: filters.busTypes.length ? filters.busTypes.join(',') : undefined,
//   //     minPrice: priceBounds.min || undefined,
//   //   };

//   //   fetchRoutes(query)
//   //     .then(response => {
//   //       setRoutes(response.data || []);
//   //       updateMeta(response.meta || {});
//   //       setStatus('success');
//   //     })
//   //     .catch(err => {
//   //       setError(err.message);
//   //       setStatus('error');
//   //     });
//   // }, [criteria, filters, sortOption, priceBounds.min, updateMeta]);

//   // useEffect(() => {
//   //   if (!filtersInitialized && resultMeta.priceRange?.max) {
//   //     setPriceBounds(resultMeta.priceRange);
//   //     setFilters(prev => ({ ...prev, maxPrice: resultMeta.priceRange.max }));
//   //     setFiltersInitialized(true);
//   //   }
//   // }, [filtersInitialized, resultMeta.priceRange]);

//   // const handleStartBooking = (route) => {
//   //   setBookingRoute(route);
//   //   setBookingError('');
//   //   setBookingSuccess(null);
//   // };

//   // const handleFilterChange = updates => {
//   //   setFilters(prev => ({ ...prev, ...updates }));
//   // };

//   // const handleBookingSubmit = async payload => {
//   //   setIsSubmitting(true);
//   //   setError('');
//   //   try {
//   //     const booking = await createBooking(payload);
//   //     setBookingSuccess(booking);
//   //     setBookingError('');
//   //     const seatsRequested = payload.seatNumbers?.length || payload.seats || 0;
//   //     setRoutes(prev => prev.map(route => {
//   //       const matchesRouteId = payload.routeId && route.id === payload.routeId;
//   //       const matchesRouteCode = booking?.routeSnapshot?.routeCode && route.routeCode === booking.routeSnapshot.routeCode;
//   //       if (matchesRouteId || matchesRouteCode) {
//   //         return { ...route, availableSeats: Math.max(route.availableSeats - seatsRequested, 0) };
//   //       }
//   //       return route;
//   //     }));
//   //     setBookingRoute(null);
//   //   } catch (submitError) {
//   //     setBookingError(submitError.message);
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

//   // const renderState = useMemo(() => {
//   //   if (status === 'loading') {
//   //     return (
//   //       <div className="flex flex-col gap-4">
//   //         {Array.from({ length: 3 }).map((_, index) => (
//   //           <div key={index} className="animate-pulse bg-white rounded-3xl h-48" />
//   //         ))}
//   //       </div>
//   //     );
//   //   }

//   //   if (status === 'error') {
//   //     return (
//   //       <div className="w-full bg-red-50 border border-red-200 rounded-3xl p-6 text-red-600 font-semibold">
//   //         {error}
//   //       </div>
//   //     );
//   //   }

//   //   if (!routes.length) {
//   //     return (
//   //       <div className="w-full bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
//   //         <p className="font-bold text-lg">No buses found for this combination</p>
//   //         <p className="text-sm mt-2">Try adjusting filters or picking another day.</p>
//   //       </div>
//   //     );
//   //   }

//   //   return (
//   //     <div className="space-y-6">
//   //       {routes.map(route => (
//   //         <BusResultCard key={route.id} route={route} onBook={handleStartBooking} />
//   //       ))}
//   //     </div>
//   //   );
//   // }, [status, routes, error]);

//  return (
//   //   <div className="min-h-screen bg-white pb-10">
//   //     <Search />

//   //     <div className="max-w-7xl mx-auto px-2 flex flex-col lg:flex-row gap-4 items-start">
//   //       <aside className="sticky top-6">
//   //         <Leftcard filters={filters} onChange={handleFilterChange} priceBounds={priceBounds} />
//   //       </aside>

//   //       <main className="flex-1 w-full space-y-4">
//   //         <Sortcard
//   //           currentSort={sortOption}
//   //           onSortChange={setSortOption}
//   //           resultCount={routes.length}
//   //           isLoading={status === 'loading'}
//   //         />

//   //         {bookingSuccess && (
//   //           <TicketCard booking={bookingSuccess} onDismiss={() => setBookingSuccess(null)} />
//   //         )}

//   //         {bookingError && (
//   //           <div className="bg-red-50 border border-red-200 text-red-600 rounded-3xl p-4">
//   //             {bookingError}
//   //           </div>
//   //         )}

//   //         {renderState}
//   //       </main>
//   //     </div>

//   //     <BookingModal
//   //       route={bookingRoute}
//   //       travelDate={criteria.travelDate}
//   //       onClose={() => setBookingRoute(null)}
//   //       onConfirm={handleBookingSubmit}
//   //       isSubmitting={isSubmitting}
//   //     />
//   //   </div>
//  // return 

//   );
// };

// export default Busdetails;


import React from 'react';
import SearchResult from '../components/Service/SearchResult';

const Busdetails = () => {
  return (
    <SearchResult />
  );
};

export default Busdetails;