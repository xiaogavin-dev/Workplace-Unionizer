// 'use client'
// import { useRef } from 'react'
// import { Provider } from 'react-redux'
// import { makeStore, AppStore } from '../lib/store'

// const StoreProvider = ({ children }: { children: React.ReactNode }) => {
//     const storeRef = useRef<AppStore>()
//     if (!storeRef.current) {
//         storeRef.current = makeStore()
//         storeRef.current.dispatch(setEnv(true))
//         storeRef.current.dispatch(setToken('placeholder'))
//         storeRef.current.dispatch(
//             setPayload({
//                 attributes: [
//                     { handle: 'fname', value: 'John' },
//                     { handle: 'lname', value: 'Doe' },
//                     { handle: 'email', value: 'john.doe@example.com' },
//                     { handle: 'uuid', value: 'temp' },
//                 ],
//                 status: [{ group: 'group1', subgroups: ['subgroup1'] }]
//             })
//         )

//     }
//     return (
//         <Provider store={storeRef.current}>
//             {children}
//         </Provider>
//     )
// }

// export default StoreProvider