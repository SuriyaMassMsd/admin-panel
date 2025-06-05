const firebaseConfig = {
  apiKey: "AIzaSyAV7k6_saYU-eE8dxopIA0lhDTrAIv6oqQ",
  authDomain: "notify-4beb2.firebaseapp.com",
  projectId: "notify-4beb2",
  storageBucket: "notify-4beb2.firebasestorage.app",
  messagingSenderId: "792235329521",
  appId: "1:792235329521:web:677aa6aa5e485fdf9fa650",
  measurementId: "G-ZCLJFECT9P",
};

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/icon.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
