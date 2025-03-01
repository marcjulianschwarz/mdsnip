export interface Preferences {
  defaultShareAction: string;
  defaultExpirationTime: number | null;
}

export const DEFAULT_PREFERENCES: Preferences = {
  defaultExpirationTime: null,
  defaultShareAction: 'view',
};
