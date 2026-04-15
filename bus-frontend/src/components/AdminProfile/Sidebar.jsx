// import React from "react";
// import mainBg from "../../assets/Images/profile_bg2.jpg";

// export default function AdminDashboard() {
//   return (
//     <div className="flex min-h-screen">

//       {/* SIDEBAR */}
//       <div
//         className="w-64 text-white p-6 relative"
//         style={{
//           backgroundImage: `url(${mainBg})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {/* overlay */}
//         <div className="absolute inset-0 bg-black/60"></div>

//         {/* content */}
//         <div className="relative z-10">
//           <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

//           <nav className="space-y-4">
//             <p className="hover:bg-white/20 px-3 py-2 rounded cursor-pointer">Add Bus</p>
//             <p className="hover:bg-white/20 px-3 py-2 rounded cursor-pointer">View All Buses</p>
//             <p className="hover:bg-white/20 px-3 py-2 rounded cursor-pointer">Edit Bus</p>
//             <p className="hover:bg-white/20 px-3 py-2 rounded cursor-pointer">Delete Bus</p>
//             <p className="hover:bg-white/20 px-3 py-2 rounded cursor-pointer">Seat Management</p>
//             <p className="hover:bg-white/20 px-3 py-2 rounded cursor-pointer">Availability</p>
//             <p className="hover:bg-white/20 px-3 py-2 rounded cursor-pointer">Route Management</p>
//             <p className="hover:bg-white/20 px-3 py-2 rounded cursor-pointer">Price Management</p>
//           </nav>
//         </div>
//       </div>

//       {/* MAIN DASHBOARD */}
//       <div className="flex-1 bg-orange-50 p-8">

//         <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

//         {/* CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h2 className="text-lg font-semibold">Total Buses</h2>
//             <p className="text-3xl font-bold text-orange-500 mt-2">120</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h2 className="text-lg font-semibold">Active Routes</h2>
//             <p className="text-3xl font-bold text-orange-500 mt-2">45</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h2 className="text-lg font-semibold">Total Bookings</h2>
//             <p className="text-3xl font-bold text-orange-500 mt-2">980</p>
//           </div>

//         </div>

//         {/* TABLE */}
//         <div className="mt-8 bg-white p-6 rounded-xl shadow">
//           <h2 className="text-xl font-semibold mb-4">Recent Buses</h2>

//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="p-2">Bus Name</th>
//                 <th className="p-2">Route</th>
//                 <th className="p-2">Type</th>
//                 <th className="p-2">Price</th>
//                 <th className="p-2">Seats</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-b">
//                 <td className="p-2">Shivneri</td>
//                 <td className="p-2">Pune → Mumbai</td>
//                 <td className="p-2">AC</td>
//                 <td className="p-2">₹800</td>
//                 <td className="p-2">40</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </div>
//   );
// }
