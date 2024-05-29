export type registrationResponse = Promise<{
  message: string;
  status: number;
  device_id: string | null;
  tokens: { access: string; refresh: string } | null;
}>;
