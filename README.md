# Full Stack Open - Part 10: React Native

My work from Part 10 of the Full Stack Open course, which moves from the web into building actual mobile apps with React Native.

## What I learned

- Building UI with React Native's core components (`View`, `Text`, `TextInput`, `Pressable`, `FlatList`) instead of HTML elements
- Handling forms properly with `Formik` and `Yup` — validation, error states, and not letting bad input slip through
- Styling across platforms, including small annoyances like iOS and Android wanting different default fonts (`Platform.select` to the rescue)
- Routing/navigation between screens without things turning into spaghetti

## Project

### Rate Repository App

A mobile app for browsing and reviewing open-source GitHub repos — basically a mini GitHub client. The login flow was the trickiest part: hidden password fields, live validation, and error messages that actually show up where you'd expect them.

- **Stack:** React Native, Expo, Formik, Yup, JavaScript/JSX
- Sign-in form with full validation and instant error styling

## Running it locally

```bash
cd rate-repository-app
npm install
npx expo start
```

Then press `i` for the iOS simulator, or scan the QR code with Expo Go on your phone.
