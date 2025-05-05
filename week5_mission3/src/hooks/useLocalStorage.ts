export const useLocalStorage = (key: string) => {
    const setItem = (value: string) => {
      try {
        localStorage.setItem(key, value); // ✅ stringify ❌
      } catch (error) {
        console.error(error);
      }
    };
  
    const getItem = () => {
      try {
        const item = localStorage.getItem(key);
        return item ?? null; // ✅ JSON.parse ❌
      } catch (error) {
        console.error(error);
        return null;
      }
    };
  
    const removeItem = () => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(error);
      }
    };
  
    return { setItem, getItem, removeItem };
  };
  