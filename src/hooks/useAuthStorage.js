import { useContext } from "react";
import AuthStorageContext from "../contexts/AuthStorageContext";

/**
 * REUSABLE AUTH STORAGE CONSUMER HOOK (useAuthStorage)
 * WHY IT EXISTS: To abstract away the implementation details of context extraction.
 * Instead of writing `import { useContext } from 'react'` and `import AuthStorageContext from...`
 * inside every single component that needs to touch local storage, we bundle that lookup logic
 * into this short utility hook shorthand.
 * * HOW IT WORKS: It leverages React's built-in `useContext` runtime engine to step up the component
 * tree, locate the nearest `<AuthStorageContext.Provider>` value node object, and pull out the
 * initialized storage helper instance.
 * * @returns {Object} The active authStorage class instance configuration containing token manipulation methods.
 */
const useAuthStorage = () => {
  return useContext(AuthStorageContext);
};

export default useAuthStorage;
