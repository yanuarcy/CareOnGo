# CareOnGo
Based on Mobile Apps with focus in Health and Consultant. Build with React Native and style from NativeBase


## Preview

Tampilan Halaman Admin

![preview](https://github.com/yanuarcy/CareOnGo/blob/94eb219fc495efe363f1d9fdbd2e86a429c52566/Home-CareOnGo.png)

## Instalasi & Setup NativeBase


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

## Instalasi Depedencies

Install gifted-chat
```
npm install react-native-gifted-chat --save
```

Install linear-gradient
```
npx expo install expo-linear-gradient
```

Install moment
```
npx expo install moment
```

Install Swiper
```
npx expo install react-native-swiper
```

Install Menu Popup
```
npx expo install react-native-popup-menu
```

Install Async Storage
```
npx expo install react-native-async-storage/async-storage
```


