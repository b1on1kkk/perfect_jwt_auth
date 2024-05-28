export interface Data {
  name?: string;
  email: string;
  password: string;
  status: boolean;
}

export interface LoginData extends Data {
  device_id: string | null;
}
