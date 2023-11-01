# CareOnGo
Based on Mobile Apps with focus in Health and Consultant. Build with React Native and style from NativeBase

## Instalasi & Setup NativeBase

## Preview

Tampilan Halaman Admin

![preview](https://github.com/yanuarcy/CareOnGo/blob/7a6139a60c1d9e8cc28e4c47bb7e7b98c2fba1ab/Home-CareOnGo.png)

Step 1:
Install `NativeBase` dan dependencies nya dengan mengeksekusi command berikut ini pada terminal

```
npm install native-base
```

```
npx expo install react-native-svg
```

```
npx expo install react-native-safe-area-context
```

Step 2:
Patch `NativeBase` (Jika Muncul Warning SSRProvider) dengan membuka file `node_modules/native-base/src/core/NativeBaseProvider.tsx` Cari dan lihat pada baris ke 97 dan ubah <SSRProvider>{children}</SSRProvider> menjadi:

```
{React.version >= '18' ? children : <SSRProvider>{children}</SSRProvider>}
```

Step 3:
Pada terminal, jalankan command: 

```
npx patch-package native-base
```

## Instalasi & Setup React Navigation

Step 1:
Masuk ke direktori project yang telah dibuat, kemudian install `React Navigation`

```
npm install @react-navigation/native
```

```
npm install @react-navigation/native-stack

```

```
npm install @react-navigation/bottom-tabs
```

```
npx expo install react-native-screens react-native-safe-area-context
```

