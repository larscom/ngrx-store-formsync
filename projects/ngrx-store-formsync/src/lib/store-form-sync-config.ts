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
  /**
   * Serialize function that gets called before dispatch
   */
  serialize: (formValue: any) => string;
  /**
   * Deserialize function that gets called before patching the form.
   *
   * ISO Date objects which are stored as a string gets revived as Date object by default.
   */
  deserialize: (formValue: string) => any;
}
