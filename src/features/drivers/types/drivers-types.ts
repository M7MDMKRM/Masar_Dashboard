export interface DriverStatCard {
  id: string;
  title: string;
  value: string | number;
  changePercentage: number;
  changeType: "increase" | "decrease";
  description?: string;
  badgeText?: string;
}

export type DriverAccountStatus = "active" | "suspended_temp" | "suspended" | "pending_verification";

export interface DriverRowItem {
  id: string;
  name: string;
  phone: string;
  registrationDate: string;
  rating: string; // e.g. "4.5 / 5.0"
  completedTrips: number;
  plan: string; // e.g. "باقة 16 ديناراً"
  status: DriverAccountStatus;
  statusText: string;
}

export interface DriversPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
}

export interface VerificationDocumentItem {
  id: string;
  title: string;
  uploadedDate: string;
  imageUrl: string;
  status: "pending_review" | "approved" | "rejected";
  statusText: string;
}

export interface VehiclePhotoItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface VehicleVerificationStatusItem {
  id: string;
  title: string;
  status: "approved" | "pending_review" | "rejected";
  statusText: string;
}

export interface VehicleDocumentItem {
  id: string;
  title: string;
  uploadedDate: string;
  fileSize?: string;
  downloadUrl?: string;
}

export interface DriverVehicleData {
  specs: {
    vehicleType: string;
    manufacturer: string;
    model: string;
    manufacturingYear: string;
    color: string;
    plateNumber: string;
    seatsCount: string;
  };
  photos: VehiclePhotoItem[];
  verificationStatuses: VehicleVerificationStatusItem[];
  documents: VehicleDocumentItem[];
}

export interface AccountLogItem {
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

export interface DriverAccountStatusData {
  stats: DriverStatCard[];
  logs: AccountLogItem[];
}

export type DriverTripStatus = "upcoming" | "in_progress" | "completed" | "cancelled";

export interface DriverTripItem {
  id: string;
  tripNumber: string;
  route: string;
  dateTime: string;
  seats: number;
  bookings: number;
  seatPrice: string;
  status: DriverTripStatus;
  statusText: string;
}

export interface DriverTripsData {
  trips: DriverTripItem[];
  pagination: DriversPaginationMeta;
}

export interface RatingDistributionItem {
  stars: number;
  count: number;
  percentage: number;
}

export interface ReviewCommentItem {
  id: string;
  userName: string;
  userInitial: string;
  date: string;
  rating: number;
  tags: string[];
  comment: string;
}

export interface DriverRatingsData {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistributionItem[];
  commonTags: string[];
  reviews: ReviewCommentItem[];
}

export interface DriverDetailsData {
  id: string;
  name: string;
  avatarUrl: string;
  gender: string;
  age: number;
  phone: string;
  rating: number;
  reviewCount: number;
  status: DriverAccountStatus;
  statusText: string;
  summaryStats: {
    totalTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    currentPlanValue: string;
  };
  personalInfo: {
    fullName: string;
    phone: string;
    age: number;
    registrationDate: string;
    lastActive: string;
    city: string;
  };
  tripStats: {
    totalTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    averageRating: number;
  };
  currentPlan: {
    statusText: string;
    price: string;
    duration: string;
    commission: string;
    activationDate: string;
    expiryDate: string;
  };
  verificationData: {
    statusText: string;
    identityDocuments: VerificationDocumentItem[];
    vehicleDocuments: VerificationDocumentItem[];
  };
  vehicleData: DriverVehicleData;
  accountStatusData: DriverAccountStatusData;
  tripsData: DriverTripsData;
  ratingsData: DriverRatingsData;
}

export interface DriversPageData {
  stats: DriverStatCard[];
  drivers: DriverRowItem[];
  pagination: DriversPaginationMeta;
}
