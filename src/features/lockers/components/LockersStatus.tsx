'use client'
import { useAppSelector } from "@/features/auth/store/store";

const statusColor: Record<string, string> = {
    empty: "bg-green-100 border-green-400 text-green-700",
    full: "bg-red-100 border-red-400 text-red-700",
    locked: "bg-gray-200 border-gray-400 text-gray-600",
};

const statusText: Record<string, string> = {
    empty: "فاضي",
    full: "مليان",
    locked: "مقفول",
};

export default function LockersStatus() {
    const lockers = useAppSelector((state) => state.lockers.lockers);

    return (
        <div className="flex gap-4">
            {lockers.map((locker) => (
                <div
                    key={locker.id}
                    className={`w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center font-bold ${statusColor[locker.status]}`}
                >
                    <span>درج {locker.id}</span>
                    <span className="text-sm">{statusText[locker.status]}</span>
                </div>
            ))}
        </div>
    );
}