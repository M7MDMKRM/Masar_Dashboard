export interface PassengerStatCard {
  id: string;
  title: string;
  value: string | number;
  changePercentage: number;
  changeType: "increase" | "decrease";
  description: string;
}

export type PassengerAccountStatus = "active" | "suspended_temp" | "suspended";

export interface PassengerRowItem {
  id: string;
  name: string;
  phone: string;
  registrationDate: string;
  completedBookings: number;
  cancelledBookings: number;
  complaintsCount: number;
  status: PassengerAccountStatus;
  statusText: string;
}

export interface PassengersPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
}

export interface PassengersPageData {
  stats: PassengerStatCard[];
  passengers: PassengerRowItem[];
  pagination: PassengersPaginationMeta;
}

export interface PassengerAccountLogItem {
  id: string;
  title: string;
  reason: string;
  relatedTrip: string;
  date: string;
  type: "warning" | "violation" | "temp_suspension";
  typeText: string;
  status: "recorded" | "penalty_ended";
  statusText: string;
}

export interface PassengerAccountStatusData {
  stats: {
    id: string;
    title: string;
    value: string | number;
    badgeText?: string;
  }[];
  logs: PassengerAccountLogItem[];
}

export type PassengerBookingStatus = "upcoming" | "in_progress" | "completed" | "cancelled";

export interface PassengerBookingItem {
  id: string;
  bookingNumber: string;
  tripNumber: string;
  route: string;
  dateTime: string;
  seats: number;
  seatPrice: string;
  status: PassengerBookingStatus;
  statusText: string;
}

export interface PassengerBookingsData {
  bookings: PassengerBookingItem[];
  pagination: PassengersPaginationMeta;
}

export type PassengerTripRequestStatus = "matched" | "active" | "expired" | "cancelled";

export interface PassengerTripRequestItem {
  id: string;
  requestNumber: string;
  route: string;
  requestedDate: string;
  timeRange: string;
  seats: number;
  createdDate: string;
  status: PassengerTripRequestStatus;
  statusText: string;
}

export interface PassengerTripRequestsData {
  requests: PassengerTripRequestItem[];
  pagination: PassengersPaginationMeta;
}

export type PassengerComplaintStatus = "resolved" | "under_review";

export interface PassengerComplaintItem {
  id: string;
  complaintNumber: string;
  partyName: string;
  reason: string;
  relatedTrip: string;
  date: string;
  status: PassengerComplaintStatus;
  statusText: string;
}

export interface PassengerComplaintsData {
  submittedComplaints: PassengerComplaintItem[];
  againstComplaints: PassengerComplaintItem[];
}

export interface PassengerRatingGivenItem {
  id: string;
  driverName: string; // e.g. "أحمد خالد"
  tripNumber: string; // e.g. "TR-90131"
  route: string; // e.g. "عمان ← الزرقاء"
  dateTime: string; // e.g. "30 ديسمبر 2026، 9:00 ص"
  rating: number; // e.g. 4.5
  tag: string; // e.g. "سائق محترف"
}

export interface PassengerRatingsData {
  stats: {
    totalRatings: {
      value: number;
      description: string;
    };
    averageRating: {
      value: string;
      description: string;
    };
    ratingsWithComment: {
      value: number;
      description: string;
    };
    totalRatingsTrend: {
      value: number;
      changePercentage: number;
      changeType: "increase" | "decrease";
      description: string;
    };
  };
  commonTags: string[];
  ratingsGiven: PassengerRatingGivenItem[];
  pagination: PassengersPaginationMeta;
}

export interface PassengerDetailsData {
  id: string;
  name: string;
  avatarUrl: string;
  gender: string;
  age: number;
  phone: string;
  status: PassengerAccountStatus;
  statusText: string;
  summaryStats: {
    totalBookings: number;
    completedTrips: number;
    cancelledBookings: number;
    tripRequests: number;
  };
  personalInfo: {
    fullName: string;
    phone: string;
    age: number;
    registrationDate: string;
    lastActive: string;
    city: string;
  };
  activityStats: {
    totalBookings: number;
    completedTrips: number;
    cancelledBookings: number;
    tripRequests: number;
  };
  lastBooking: {
    route: string;
    statusText: string;
    price: string;
    date: string;
    seats: string;
  };
  accountStatusData: PassengerAccountStatusData;
  bookingsData: PassengerBookingsData;
  tripRequestsData: PassengerTripRequestsData;
  complaintsData: PassengerComplaintsData;
  ratingsData: PassengerRatingsData;
}
