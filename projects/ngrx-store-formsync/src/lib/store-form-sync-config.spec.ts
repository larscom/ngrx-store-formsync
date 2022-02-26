import { defaultConfig } from './store-form-sync-config';

describe('StoreFormSyncConfig', () => {
  it('default config should serialize', () => {
    const object = { a: 1 };
    const serialized = defaultConfig.serialize(object);

    expect(serialized).toStrictEqual(JSON.stringify(object));
  });

  it('default config should deserialize and revive dates', () => {
    const object = { a: 1, date: new Date(), dateString: '2022-02-26T22:12:15.667Z' };
    const deserialized = defaultConfig.deserialize(JSON.stringify(object));

    expect(deserialized.a).toStrictEqual(1);
    expect(deserialized.date).toBeInstanceOf(Date);
    expect(deserialized.dateString).toBeInstanceOf(Date);
  });
});
