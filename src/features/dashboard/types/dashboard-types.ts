export interface StatCardItem {
  id: string;
  title: string;
  value: string | number;
  changePercentage: number;
  changeType: "increase" | "decrease";
  description: string;
}

export interface FeaturedTripSummary {
  activeCount: number;
  unitText: string;
  title: string;
  description: string;
}

export type TripStatus = "in_progress" | "pending_execution" | "completed" | "cancelled";

export interface ActiveTrip {
  id: string;
  tripNumber: string;
  driverName: string;
  route: string;
  startTime: string;
  passengerCount: number;
  status: TripStatus;
  statusText: string;
}

export type VerificationRequestStatus = "pending_review" | "incomplete_docs" | "approved" | "rejected";

export interface VerificationRequest {
  id: string;
  driverName: string;
  phone: string;
  requestDate: string;
  status: VerificationRequestStatus;
  statusText: string;
}

export interface PopularRoute {
  id: string;
  route: string;
  count: number;
  percentage: number;
}

export type ComplaintStatus = "resolved" | "in_progress" | "pending_review" | "open";

export interface RecentComplaint {
  id: string;
  complaintNumber: string;
  complainant: string;
  respondent: string;
  issueType: string;
  date: string;
  status: ComplaintStatus;
  statusText: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
}

export interface DashboardData {
  stats: StatCardItem[];
  featuredTrip: FeaturedTripSummary;
  activeTrips: ActiveTrip[];
  activeTripsPagination: PaginationMeta;
  verificationRequests: VerificationRequest[];
  verificationPagination: PaginationMeta;
  popularRoutes: PopularRoute[];
  recentComplaints: RecentComplaint[];
  complaintsPagination: PaginationMeta;
}
