import { Inter, Merriweather } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const merriweather = Merriweather({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif" 
});

export const metadata = {
  title: "Lawyers Multivendor SaaS",
  description: "Professional Management System for Law Firms",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans`}>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
