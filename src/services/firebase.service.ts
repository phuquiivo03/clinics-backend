// import { RecaptchaVerifier, type ApplicationVerifier, type Auth } from "firebase/auth";
// import { auth } from "../config/firebase"; // Import 'auth' đã khởi tạo

// let recaptchaVerifier: ApplicationVerifier | null = null;
// class FirebaseService {
//     private static instance: FirebaseService;
    
//     private constructor() {
//         // Initialize Firebase here
//     }
    
//     public static getInstance(): FirebaseService {
//         if (!FirebaseService.instance) {
//         FirebaseService.instance = new FirebaseService();
//         }
//         return FirebaseService.instance;
//     }
    
//     async setupRecaptcha(containerId: string): Promise<void> {
//   // Đảm bảo chỉ khởi tạo một lần hoặc reset nếu cần
//   if (recaptchaVerifier && typeof (recaptchaVerifier as any).clear === 'function') {
//     (recaptchaVerifier as any).clear(); // Xóa instance cũ nếu có
//   }
//   return new Promise((resolve, reject) => {
//     try {
//       recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
//         'size': 'invisible', // 'invisible' hoặc 'normal'
//         'callback': (response: any) => {
//           // reCAPTCHA đã được giải quyết thành công
//           console.log("reCAPTCHA solved:", response);
//           // Thông thường bạn không cần làm gì ở đây nếu dùng invisible reCAPTCHA,
//           // signInWithPhoneNumber sẽ tự động kích hoạt.
//           resolve();
//         },
//         'expired-callback': () => {
//           // reCAPTCHA đã hết hạn, yêu cầu người dùng giải quyết lại
//           console.log("reCAPTCHA expired, please try again.");
//           // Có thể reset reCAPTCHA ở đây
//           reject(new Error("reCAPTCHA hết hạn, vui lòng thử lại."));
//         }
//       });
//       recaptchaVerifier.render().then(resolve).catch(reject); // Quan trọng: render reCAPTCHA
//     } catch (error) {
//       console.error("Lỗi thiết lập reCAPTCHA:", error);
//       reject(error);
//     }
//   });
// }
// }