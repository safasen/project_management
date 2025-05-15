// import { create } from "zustand";

// export const useUserStore = create((set) => ({
//     currentUsered: null,
//     isLoading: true,
//     fetchUser: async (user) => {
//         if (!user) {return set({currentUsered:null, isLoading:false})}

//         try {
//             set({currentUsered: {...user}, isLoading:false})

//         } catch (error) {
//             return set({currentUsered:null, isLoading:false})
//         }
//     }
// }))