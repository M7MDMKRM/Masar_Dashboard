export interface TripItem {
  id: string;
  tripNumber: string; // e.g. TRP-4821
  driverName: string; // e.g. عبدالله الحربي
  route: string; // e.g. عمان ← الزرقاء
  departureCity: string;
  destinationCity: string;
  requestedDate: string; // e.g. 30 أكتوبر 2026، 3:00 م
  tripType: "recurring" | "single"; // متكررة | فردية
  seatsRatio: string; // e.g. "3 / 4"
  seatPrice: string; // e.g. "3.5 د.أ"
  status: "in_progress" | "upcoming" | "completed" | "cancelled";
  statusText: string; // قيد التنفيذ | قادمة | مكتملة | ملغاة
}

export interface TripStatCard {
  id: string;
  title: string;
  value: string;
  percentageBadge: string;
  changeType: "increase" | "decrease";
  badgeColorClass: string;
  description: string;
}

export interface TripsPageData {
  stats: TripStatCard[];
  trips: TripItem[];
  totalTrips: number;
}

export interface TripBookingPassenger {
  id: string;
  passengerName: string; // e.g. أحمد محمد
  seatsCount: number; // e.g. 1
  bookingNumber: string; // e.g. BK-2104
  bookingDate: string; // e.g. 25 أكتوبر 2026، 9:00 ص
  phone: string; // e.g. 0790 112 456
  rating?: string; // e.g. "4.8 / 5.0"
  status: "confirmed" | "cancelled";
  statusText: string; // مؤكد
}

export interface TripTimelineStep {
  stepNumber: number; // 1, 2, 3, 4
  title: string; // تم نشر الرحلة, تم تسجيل الحجوزات, بدأت الرحلة, اكتملت الرحلة
  date: string; // 25 أكتوبر 2026، 9:00 ص
  isCompleted: boolean;
  isActive: boolean;
}

export interface TripDetailsData {
  id: string;
  tripNumber: string; // TR-90132
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
  statusText: string; // قادمة
  driverName: string; // أحمد خالد
  route: string; // عمان ← إربد
  stats: {
    totalSeats: { value: string; label: string; description: string };
    bookedSeats: { value: string; label: string; percentage: string; description: string };
    availableSeats: { value: string; label: string; badge: string; description: string };
    totalBookingValue: { value: string; label: string; description: string };
  };
  summary: {
    departureCity: string; // عمان
    destinationCity: string; // إربد
    tripDate: string; // 28 أكتوبر 2026
    tripTime: string; // 4:30 مساءً
    bookedSeatsCount: number; // 3
    totalSeatsCount: number; // 4
    availableSeatsCount: number; // 1
    seatPrice: string; // 12 د.أ
    gender: string; // غير محدد
    tripType: string; // فردية | متكررة
    recurrenceDays?: string; // e.g. كل أحد وثلاثاء
    endDate?: string; // e.g. 30 ديسمبر 2026
    status: string; // قادمة | مكتملة
  };
  driverInfo: {
    id: string;
    name: string; // أحمد مدحت عبد العظيم شلبي
    rating: number; // 4.8
    ratingsCount: number; // 289
    totalTrips: number; // 312
    completedTrips: number; // 298
    avatarUrl?: string;
  };
  passengers: TripBookingPassenger[];
  timeline: TripTimelineStep[];
  cancellationDetails?: {
    cancelledBy: "driver" | "admin" | "passenger";
    reason: string;
    reasonText?: string;
    notes?: string;
  };
}
