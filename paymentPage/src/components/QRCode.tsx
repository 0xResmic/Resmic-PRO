
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeProps {
  walletAddress: string;
  amount: number;
  token: string;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({
  walletAddress,
  amount,
  token,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Wallet address has been copied to your clipboard.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR code data URL
  const generateQRCode = () => {
    // This is a placeholder - in a real app, you'd use a QR code library
    // For simplicity, we'll use a placeholder image
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTc2IDc2SDEwMFYxMDBINzZWNzZaTTEwMCAxMDBIMTI0VjEyNEgxMDBWMTAwWk03NiAxMjRIMTAwVjE0OEg3NlYxMjRaTTEyNCAxMDBIMTQ4VjEyNEgxMjRWMTAwWk0xMDAgMTI0SDEyNFYxNDhIMTAwVjEyNFpNMTI0IDEyNEgxNDhWMTQ4SDEyNFYxMjRaTTE0OCAxMDBIMTcyVjEyNEgxNDhWMTAwWk0xMDAgMTQ4SDEyNFYxNzJIMTAwVjE0OFpNMTI0IDE0OEgxNDhWMTcySDEyNFYxNDhaIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI3NiIgeT0iNzYiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iNzYiIHk9IjEwMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxNDgiIHk9Ijc2IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjE0OCIgeT0iMTQ4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9Ijc2IiB5PSIxNDgiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTQ4IiB5PSIxMDAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTAwIiB5PSI3NiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxMjQiIHk9Ijc2IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=`;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl bg-card p-6 border animate-scale-in",
        className
      )}
    >
      <div className="text-sm font-medium text-muted-foreground mb-4">
        Scan this QR code to pay {amount} {token}
      </div>
      
      <div className="bg-white p-3 rounded-lg mb-6 w-48 h-48 shadow-sm">
        <img 
          src={generateQRCode()} 
          alt="Payment QR Code" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="w-full space-y-2">
        <div className="text-sm font-medium">Wallet Address:</div>
        <div className="flex items-center">
          <div className="bg-secondary rounded-l-lg p-3 flex-1 overflow-hidden">
            <div className="truncate text-sm">{walletAddress}</div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "min-w-[3rem] h-11 rounded-r-lg flex items-center justify-center transition-colors",
              copied
                ? "bg-green-500 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {copied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCode;
