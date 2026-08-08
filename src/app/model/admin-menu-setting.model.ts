export interface AdminMenuSetting {
  menuKey: string;
  label: string;
  isEnabled: boolean;
}

export interface AdminMenuSettingRequest {
  items: AdminMenuSetting[];
}
