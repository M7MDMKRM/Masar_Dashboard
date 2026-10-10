export interface BookingItem {
  id: string;
  bookingNumber: string; // e.g. BK-10428
  passengerName: string; // e.g. عبدالله الحربي
  route: string; // e.g. عمان ← الزرقاء
  bookingDate: string; // e.g. 30 أكتوبر 2026، 3:00 م
  tripNumber: string; // e.g. TRP-4821
  seatsRatio: string; // e.g. "3 / 4"
  seatPrice: string; // e.g. "3.5 د.أ"
  status: "in_progress" | "upcoming" | "completed" | "cancelled";
  statusText: string; // قيد التنفيذ | قادمة | مكتملة | ملغاة
}

export interface BookingStatCard {
  id: string;
  title: string;
  value: string;
  percentageBadge: string;
  changeType: "increase" | "decrease";
  badgeColorClass: string;
  description: string;
}

export interface BookingsPageData {
  stats: BookingStatCard[];
  bookings: BookingItem[];
  totalBookings: number;
}

export interface BookingDetailsData {
  id: string;
  bookingNumber: string; // BK-2104
  tripNumber: string; // TR-90132
  bookingDate: string; // 25 أكتوبر 2026
  bookingTime: string; // 11:42 صباحًا
  seatsCount: number; // 2
  seatPrice: string; // 12 د.أ
  totalAmount: string; // 24 د.أ
  paymentMethod: string; // نقدًا مباشرة للسائق
  paymentNotice: string; // الدفع يتم مباشرة بين الراكب والسائق نقدًا عند الرحلة.
  status: "confirmed" | "completed" | "cancelled";
  statusText: string; // مؤكد | مكتمل | ملغي | ملغاة
  cancelledBy?: "driver" | "passenger" | "admin";

  // Timeline for the trip/booking
  timeline: {
    stepNumber: number;
    title: string; // تم إنشاء الحجز, تم تأكيد الحجز, تم ربط الحجز بالرحلة TR-90132
    date: string;
    isCompleted: boolean;
    isActive: boolean;
  }[];

  // Driver details
  driver: {
    id: string;
    name: string; // أحمد مدحت عبد العظيم شلبي
    phone: string; // 078 447 2109
    age: string; // 26 عام
    registrationDate: string; // 15 أكتوبر 2026
    lastActive: string; // اليوم، 8:32 ص
    city: string; // عمان
  };

  // Associated Trip summary
  tripSummary: {
    departureCity: string; // عمان
    destinationCity: string; // إربد
    tripDate: string; // 28 أكتوبر 2026
    tripTime: string; // 4:30 مساءً
    bookedSeats: number; // 3
    totalSeats: number; // 4
    availableSeats: number; // 1
    seatPrice: string; // 12 د.أ
    gender: string; // غير محدد
    tripType: string; // فردية | متكررة
    status: string; // قادمة | مكتملة | ملغاة
  };

  // Passenger details
  passenger: {
    id: string;
    name: string; // أحمد مدحت عبد العظيم شلبي
    phone: string; // 078 447 2109
    age: string; // 26 عام
    registrationDate: string; // 11 ديسمبر 2026
    lastActive: string; // اليوم، 12:30 ص
    city: string; // عمان
  };

  // Passenger Activity Stats
  passengerStats: {
    totalBookings: number; // 42
    completedTrips: number; // 35
    cancelledBookings: number; // 7
    tripRequests: number; // 12
  };

  // Latest booking by passenger
  latestPassengerBooking: {
    route: string; // عمان ← إربد
    date: string; // 27 أكتوبر 2026
    seats: string; // مقعدان
    status: "completed" | "active" | "cancelled";
    statusText: string; // مكتملة
  };

  // Optional details when cancelled by passenger
  passengerCancellation?: {
    selectedReason: string;
    explanation?: string;
  };
}
