export type LockerStatus = "empty" | "full" | "locked";

export interface Locker {
    id: number;
    status: LockerStatus;
    orderId: string | null;
}