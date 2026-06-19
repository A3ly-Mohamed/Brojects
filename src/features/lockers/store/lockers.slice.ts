'use client'
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Locker } from "../types/locker.types";

export interface LockersState {
    lockers: Locker[];
    lastAssignedLockerId: number | null;
}

const initialState: LockersState = {
    lockers: [
        { id: 1, status: "full", orderId: null },
        { id: 2, status: "empty", orderId: null },
        { id: 3, status: "empty", orderId: null },
    ],
    lastAssignedLockerId: null,
};

const lockersSlice = createSlice({
    name: "lockers",
    initialState,
    reducers: {
        assignOrderToLocker: (state, action: PayloadAction<{ orderId: string }>) => {
            const freeLocker = state.lockers.find((l) => l.status === "empty");
            if (freeLocker) {
                freeLocker.status = "locked";
                freeLocker.orderId = action.payload.orderId;
                state.lastAssignedLockerId = freeLocker.id;
            } else {
                state.lastAssignedLockerId = null;
            }
        },
        resetLocker: (state, action: PayloadAction<{ id: number }>) => {
            const locker = state.lockers.find((l) => l.id === action.payload.id);
            if (locker) {
                locker.status = "empty";
                locker.orderId = null;
            }
        },
    },
});

export const lockersReducer = lockersSlice.reducer;
export const { assignOrderToLocker, resetLocker } = lockersSlice.actions;


