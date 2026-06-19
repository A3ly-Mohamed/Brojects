// import { configureStore, ReducerType } from '@reduxjs/toolkit'
// import { authReducer, AuthState } from './auth.slice'
// import App from 'next/app';
// import { cartReducer, CartState } from '@/features/cart/store/cart.slice';
// import { useSelector } from 'react-redux';




// export type PreloadedState = {
//     auth: AuthState;
//     cart:CartState
// };

// export function creatStore(PreloadedState:PreloadedState) {
//     const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         cart:cartReducer
//     },
//     preloadedState: PreloadedState
//     })
//     return store;
// }


// export type AppStore = ReturnType<typeof creatStore>;
// export type AppState = ReturnType<AppStore['getState']>;


// export const useAppSelector=useSelector.TypedUseSelectorHook<AppState>();

import { configureStore } from "@reduxjs/toolkit";
import { authReducer, AuthState } from "./auth.slice";
import { cartReducer, CartState } from "@/features/cart/store/cart.slice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

export type PreloadedState = {
  auth: AuthState;
  cart: CartState;
};

export function creatStore(preloadedState: PreloadedState) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },
    preloadedState,
  });
  return store;
}

export type AppStore = ReturnType<typeof creatStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Hooks مخصصة
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;



