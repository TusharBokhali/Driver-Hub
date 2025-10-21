import AsyncStorage from "@react-native-async-storage/async-storage";

type StorageData = string | object | number | boolean;

export const AsyncStorageService = {
  // ✅ Data Save
  storeData: async (key: string, value: StorageData) => {
    try {
      if (value === undefined || value === null) {
        console.log(
          `AsyncStorage: skipping store, value is ${value}, use removeItem instead`
        );
        return false;
      }

      const data = typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, data);
      return true;
    } catch (error) {
      console.log("AsyncStorage storeData error:", error);
      return false;
    }
  },

  // ✅ Data Get (generic type support)
  getItem: async <T = any>(key: string): Promise<T | null> => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        try {
          return JSON.parse(data) as T;
        } catch {
          // agar JSON nahi hai to normal string return karo
          return data as unknown as T;
        }
      }
      return null;
    } catch (error) {
      console.log("AsyncStorage getItem error:", error);
      return null;
    }
  },

  // ✅ Data Remove
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.log("AsyncStorage removeItem error:", error);
      return false;
    }
  },
};
