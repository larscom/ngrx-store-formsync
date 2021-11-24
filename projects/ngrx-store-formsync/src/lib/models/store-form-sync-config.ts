export interface StoreFormSyncConfig {
  /**
   * Only sync to the store when submitting the form.
   * @default false
   */
  syncOnSubmit: boolean;
  /**
   * Only sync to the store when the form status is valid.
   * @default false
   */
  syncValidOnly: boolean;
  /**
   * Sync the raw form value to the store (this will include disabled form controls)
   * @default false
   */
  syncRawValue: boolean;
}

export const defaultConfig: StoreFormSyncConfig = {
  syncOnSubmit: false,
  syncRawValue: false,
  syncValidOnly: false
};
