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

const dateRegExp = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

export const defaultConfig: StoreFormSyncConfig = {
  syncOnSubmit: false,
  syncRawValue: false,
  syncValidOnly: false,
  serialize: (formValue: any): string => JSON.stringify(formValue),
  deserialize: (formValue: string): any =>
    JSON.parse(formValue, (_: string, value: string) => (dateRegExp.test(String(value)) ? new Date(value) : value))
};
