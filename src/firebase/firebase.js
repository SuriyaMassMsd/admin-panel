import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { useEffect, useState, useRef } from "react";
import { UAParser } from "ua-parser-js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function useFcmToken() {
  const [fcmToken, setFcmToken] = useState(null);
  const fcmTokenRef = useRef(null);
  const parser = new UAParser();
  const deviceInfo = parser.getResult();
  const deviceType = deviceInfo.os.name;
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPIDKEY;

  useEffect(() => {
    const generateFcmToken = async () => {
      try {
        const supported = await isSupported();
        if (!supported) {
          console.log("Browser not supported for FCM");
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Notification permission not granted");
          return;
        }

        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        const token = await getToken(messaging, {
          vapidKey: vapidKey,
          serviceWorkerRegistration: registration,
        });

        console.log("✅ FCM Token acquired:", token);
        setFcmToken(token);
        fcmTokenRef.current = token;
      } catch (error) {
        console.error("Error fetching FCM token", error);
      }
    };

    if (vapidKey) {
      generateFcmToken();
    } else {
      console.error("VAPID Key not found");
    }
  }, [vapidKey]);

  const getFcmToken = () => fcmTokenRef.current;

  return { fcmToken, deviceType, getFcmToken };
}

export default useFcmToken;
