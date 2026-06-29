import { createContext } from "react";

/**
 * AUTHENTICATION STORAGE CONTEXT DEFINITION
 * WHY IT EXISTS: This file acts as a globally accessible dependency injection channel.
 * React Native components deep inside the layout hierarchy (like the Sign In form or the
 * App Bar logout button) need direct access to our persistent local storage engine (SecureStore/AsyncStorage)
 * to save or look up authentication JSON Web Tokens (JWT).
 * * Instead of manually passing an authStorage instance down through props layer-by-layer
 * (known as "prop drilling"), we create this context placeholder channel.
 * * HOW IT WORKS:
 * 1. This file instantiates a blank Context object bridge link.
 * 2. In `App.js`, we wrap our application in a `<AuthStorageContext.Provider value={authStorage}>` node.
 * 3. Any child component can then immediately consume the initialized storage instance by calling our
 * custom hook `useAuthStorage()`, which references this exact context bridge underneath.
 */
const AuthStorageContext = createContext();

export default AuthStorageContext;
