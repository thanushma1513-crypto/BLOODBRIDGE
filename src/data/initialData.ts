import { User, DonorProfile, BloodRequest, EmergencyAlert, AlertResponse } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Dr. Sarah Jenkins',
    email: 'sarah@citycare.org',
    phone: '+1 (555) 234-5678',
    role: 'HOSPITAL',
    hospital_name: 'Metro Trauma Center',
    hospital_id: 'HOSP-NY-8891',
    hospital_address: '100 Emergency Way, Medical District',
    latitude: 16.5062,
    longitude: 80.6480,
    alert_opt_in: true,
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Rahul Sharma (User A - Requester)',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    role: 'USER',
    age: 28,
    latitude: 16.5062,
    longitude: 80.6480,
    alert_opt_in: true,
    created_at: '2026-03-05T14:30:00Z',
  },
  {
    id: 3,
    name: 'Priya Patel (User B - 2.1 KM Away, B-)',
    email: 'priya.b@example.com',
    phone: '+91 98765 11223',
    role: 'USER',
    age: 25,
    latitude: 16.5180,
    longitude: 80.6350, // Approx 2.1 km away
    alert_opt_in: true,
    created_at: '2026-03-08T09:15:00Z',
  },
  {
    id: 4,
    name: 'Marcus Vance (User C - 4.1 KM Away, AB+)',
    email: 'marcus@example.com',
    phone: '+91 98765 99887',
    role: 'USER',
    age: 32,
    latitude: 16.5350,
    longitude: 80.6200, // Approx 4.1 km away
    alert_opt_in: true,
    created_at: '2026-03-10T11:45:00Z',
  },
  {
    id: 5,
    name: 'Elena Rostova (User D - 8.2 KM Away, O+)',
    email: 'elena@example.com',
    phone: '+91 98765 77665',
    role: 'USER',
    age: 29,
    latitude: 16.5650,
    longitude: 80.5900, // Approx 8.2 km away (Outside 5km radius)
    alert_opt_in: true,
    created_at: '2026-03-12T16:20:00Z',
  },
  {
    id: 6,
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+91 98765 33445',
    role: 'USER',
    age: 34,
    latitude: 16.5120,
    longitude: 80.6550, // Approx 1.1 km away
    alert_opt_in: false, // Opted out of emergency alerts
    created_at: '2026-03-14T08:00:00Z',
  }
];

export const INITIAL_DONORS: DonorProfile[] = [
  {
    id: 1,
    user_id: 3,
    donor_name: 'Priya Patel',
    age: 25,
    blood_group: 'B-',
    health_issues: false,
    availability: 'Available',
    phone: '+91 98765 11223',
    email: 'priya.b@example.com',
    latitude: 16.5180,
    longitude: 80.6350,
    alert_opt_in: true,
    created_at: '2026-03-08T09:30:00Z',
  },
  {
    id: 2,
    user_id: 4,
    donor_name: 'Marcus Vance',
    age: 32,
    blood_group: 'AB+',
    health_issues: false,
    availability: 'Available',
    phone: '+91 98765 99887',
    email: 'marcus@example.com',
    latitude: 16.5350,
    longitude: 80.6200,
    alert_opt_in: true,
    created_at: '2026-03-10T12:00:00Z',
  },
  {
    id: 3,
    user_id: 5,
    donor_name: 'Elena Rostova',
    age: 29,
    blood_group: 'O+',
    health_issues: false,
    availability: 'Available',
    phone: '+91 98765 77665',
    email: 'elena@example.com',
    latitude: 16.5650,
    longitude: 80.5900,
    alert_opt_in: true,
    created_at: '2026-03-12T16:30:00Z',
  },
  {
    id: 4,
    user_id: 6,
    donor_name: 'David Chen',
    age: 34,
    blood_group: 'O-',
    health_issues: false,
    availability: 'Currently Unavailable',
    phone: '+91 98765 33445',
    email: 'david.chen@example.com',
    latitude: 16.5120,
    longitude: 80.6550,
    alert_opt_in: false,
    created_at: '2026-03-14T08:15:00Z',
  }
];

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 101,
    requester_id: 1,
    requester_name: 'Metro Trauma Center (ICU Wing)',
    hospital_name: 'Metro Trauma Center',
    blood_group: 'O-',
    patient_age: 41,
    units_required: 3,
    phone: '+1 (555) 234-5678',
    description: 'Critical emergency: Multiple trauma surgery patient in Operating Room 3 requires immediate O- negative blood.',
    radius_km: 10,
    latitude: 16.5062,
    longitude: 80.6480,
    status: 'ACTIVE',
    created_at: '2026-09-21T07:15:00Z',
    expires_at: '2026-09-22T07:15:00Z',
    alerts_count: 14,
    responses_count: 3
  },
  {
    id: 102,
    requester_id: 2,
    requester_name: 'Rahul Sharma',
    hospital_name: 'City General Hospital',
    blood_group: 'A+',
    patient_age: 63,
    units_required: 2,
    phone: '+91 98765 43210',
    description: 'Scheduled cardiac bypass tomorrow morning, platelet & whole blood reserve needed urgently.',
    radius_km: 5,
    latitude: 16.5080,
    longitude: 80.6420,
    status: 'ACTIVE',
    created_at: '2026-09-20T18:30:00Z',
    expires_at: '2026-09-21T18:30:00Z',
    alerts_count: 8,
    responses_count: 1
  }
];

export const INITIAL_RESPONSES: AlertResponse[] = [
  {
    id: 1,
    request_id: 101,
    user_id: 3,
    responder_name: 'Priya Patel',
    responder_phone: '+91 98765 11223',
    blood_group: 'B-',
    message: 'I am nearby at Medical Square, can reach the hospital within 20 minutes if needed.',
    response: 'I_CAN_HELP',
    created_at: '2026-09-21T07:35:00Z'
  },
  {
    id: 2,
    request_id: 101,
    user_id: 4,
    responder_name: 'Marcus Vance',
    responder_phone: '+91 98765 99887',
    blood_group: 'AB+',
    message: 'Registered as donor, standing by in case auxiliary plasma is required.',
    response: 'I_CAN_HELP',
    created_at: '2026-09-21T07:42:00Z'
  }
];

export const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 501,
    request_id: 101,
    user_id: 3,
    distance_km: 2.1,
    status: 'DELIVERED',
    created_at: '2026-09-21T07:15:00Z',
    request: INITIAL_REQUESTS[0]
  },
  {
    id: 502,
    request_id: 101,
    user_id: 4,
    distance_km: 4.1,
    status: 'DELIVERED',
    created_at: '2026-09-21T07:15:00Z',
    request: INITIAL_REQUESTS[0]
  }
];

