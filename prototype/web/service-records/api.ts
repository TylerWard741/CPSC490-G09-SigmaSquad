// Same demo user as vehicle_select.ts (auth is out of scope).
export const DEMO_USER_ID = 1;

export interface SavedVehicle {
  id: number; make: string; model: string; year: number; trim: string; nickname?: string | null;
}
export interface ServiceType { id: number; name: string }
export interface ServiceRecord {
  id: number; vehicle_id: number; service_type_id: number; service_type: string;
  service_date: string; mileage: number; notes: string | null;
}
export interface NewServiceRecord {
  service_type_id: number; service_date: string; mileage: number; notes?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, init);
  } catch {
    throw new Error("The server can't be reached. Please try again."); // same wording as vehicle_select.ts
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string }).error || `The request failed (${res.status}).`);
  return body as T;
}

export async function listSavedVehicles(): Promise<SavedVehicle[]> {
  return (await request<{ vehicles?: SavedVehicle[] }>(`/users/${DEMO_USER_ID}/vehicles`)).vehicles ?? [];
}

export async function getServiceTypes(): Promise<ServiceType[]> {
  return (await request<{ service_types?: ServiceType[] }>('/service-types')).service_types ?? [];
}

export async function createServiceRecord(vehicleId: number, rec: NewServiceRecord): Promise<ServiceRecord> {
  const body = await request<{ service_record: ServiceRecord }>(`/vehicles/${vehicleId}/service-records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rec), // only the four spec fields: unknown fields get a 400
  });
  return body.service_record;
}

export async function listServiceRecords(vehicleId: number): Promise<ServiceRecord[]> {
  return (await request<{ service_records?: ServiceRecord[] }>(`/vehicles/${vehicleId}/service-records`)).service_records ?? [];
}