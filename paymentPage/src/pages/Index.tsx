
import { useState, useEffect } from "react";
import Checkout from "@/components/Checkout";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Simulate a short loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background to-secondary/5">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading payment gateway...</p>
        </div>
      ) : (
        <div className="w-full max-w-screen-xl flex flex-col items-center">
          <div className="w-full max-w-4xl mx-auto">
            <Checkout />
          </div>
          
          <footer className="mt-16 text-sm text-muted-foreground text-center">
            <p>Built with  ❤️ by <a href="https://resmic.com" target="_blank">Resmic</a></p>
            <p>&copy; {new Date().getFullYear()}  All rights reserved.</p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
