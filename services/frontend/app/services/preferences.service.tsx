import { HttpService } from "./http.service";

export interface Preferences {
  defaultShareAction: string;
  defaultExpirationTime: number | null;
}

export class PreferencesService {
  static async update(
    userId: string,
    key: string,
    value: string | number | null
  ) {
    const res = await HttpService.patch(`/preferences/${userId}/${key}`, {
      value,
    });
    if (res.ok) {
      const data = await res.json();
      return data as Preferences;
    }
  }

  static async get(userId: string) {
    const res = await HttpService.get(`/preferences/${userId}`);
    if (res.ok) {
      const data = await res.json();
      return data as Preferences;
    }
  }
}
