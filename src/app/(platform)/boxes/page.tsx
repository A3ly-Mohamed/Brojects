'use client'

import { useState, useEffect } from "react";
import { useAppSelector } from "@/features/auth/store/store";
import { toast } from "react-hot-toast";

const statusStyles: Record<string, { card: string; badge: string; text: string }> = {
    empty: {
        card: "bg-white border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "text-emerald-600"
    },
    full: {
        card: "bg-white border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-md cursor-not-allowed opacity-90",
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        text: "text-rose-600"
    }
};

const statusText: Record<string, string> = {
    empty: "متاح (فاضي)",
    full: "مشغول (مليان)",
};

type LockerStatus = "empty" | "full";

interface Locker {
    id: number;
    name: string;
    description: string;
    availableTime?: string;
    status: LockerStatus;
}

const defaultLockers: Locker[] = [
    {
        id: 1,
        name: "خزانة أمنية الذكية A-1",
        description: "مخصصة للبريد والطرود المتوسطة الحجم، تحتوي على شاحن داخلي.",
        availableTime: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        status: "full"
    },
    {
        id: 2,
        name: "خزانة أمنية الذكية B-4",
        description: "مخصصة للمستندات والملفات المهمة، أمان عالي وحماية ضد الحريق.",
        status: "empty"
    },
    {
        id: 3,
        name: "خزانة أمنية الذكية C-2",
        description: "مساحة واسعة للحقائب والأجهزة الإلكترونية الكبيرة.",
        status: "empty"
    },
];

export default function LockersStatus() {
    const storeLockers = useAppSelector((state) => state?.lockers?.lockers);
    const [lockers, setLockers] = useState<Locker[]>(defaultLockers);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLockerId, setSelectedLockerId] = useState<number | null>(null);

    useEffect(() => {
        if (storeLockers && storeLockers.length > 0) {
            const enriched = storeLockers.map((l: any, idx: number) => {
                const isFull = l.status === "full";
                return {
                    ...defaultLockers[idx % defaultLockers.length],
                    id: l.id,
                    status: l.status === "locked" ? "empty" : l.status,
                    availableTime: isFull ? new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : undefined
                };
            });
            setLockers(enriched);
        }
    }, [storeLockers]);

    const handleLockerClick = (id: number, currentStatus: LockerStatus) => {
        if (currentStatus === "full") {
            toast.error(`عذراً، درج ${id} مليان حالياً ولا يمكن تغييره!`, {
                position: "bottom-left",
            });
            return;
        }

        setSelectedLockerId(id);
        setIsModalOpen(true);
    };

    const handleConfirmScan = () => {
        if (selectedLockerId === null) return;

        const currentTime = new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
        });

        setLockers((prevLockers) =>
            prevLockers.map((locker) =>
                locker.id === selectedLockerId
                    ? { ...locker, status: "full", availableTime: currentTime }
                    : locker
            )
        );

        // Close Modal safely before firing toast
        setIsModalOpen(false);

        // Triggers the successful verification feedback notice
        toast.success(`تم مسح الرمز وتأكيد حجز درج ${selectedLockerId} بنجاح!`, {
            position: "bottom-left",
        });

        setSelectedLockerId(null);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6" dir="rtl">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-r-4 border-indigo-500 pr-3">
                حالة الخزائن والادراج الذكية
            </h2>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lockers.map((locker) => {
                    const style = statusStyles[locker.status] || statusStyles.empty;
                    return (
                        <div
                            key={locker.id}
                            onClick={() => handleLockerClick(locker.id, locker.status)}
                            className={`group border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between select-none ${style.card}`}
                        >
                            <div>
                                {/* Header Info */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm">
                                        #{locker.id}
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${style.badge}`}>
                                        {statusText[locker.status]}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                                    {locker.name}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {locker.description}
                                </p>
                            </div>

                            {/* Footer Metadata */}
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 min-h-[45px]">
                                {locker.status === "full" && locker.availableTime ? (
                                    <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>وقت الحجز: {locker.availableTime}</span>
                                    </div>
                                ) : (
                                    <span className="text-emerald-600 font-medium">جاهز للاستخدام الفوري</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* QR Code Confirmation Modal Backdrop */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    {/* Modal Box */}
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 transform scale-100 transition-all">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            تأكيد اختيار الدرج #{selectedLockerId}
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            يرجى مسح الرمز الشريطي (QR Code) لتأكيد عملية حجز الخزانة.
                        </p>

                        {/* Middle QR Container */}
                        <div className="bg-slate-50 p-4 rounded-xl inline-block border border-slate-200 mb-6">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LockerConfirmation"
                                alt="QR Code"
                                className="w-36 h-36 mx-auto"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleConfirmScan}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
                            >
                                محاكاة مسح الرمز وتأكيد الاختيار
                            </button>
                            <button
                                onClick={() => { setIsModalOpen(false); setSelectedLockerId(null); }}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}   