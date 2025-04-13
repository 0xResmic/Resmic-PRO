
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QrCode, Wallet } from "lucide-react";

interface PaymentMethodProps {
  selectedMethod: "wallet" | "qrcode" | null;
  onSelectMethod: (method: "wallet" | "qrcode") => void;
  className?: string;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelectMethod,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-sm font-medium">Select Payment Method</div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant={selectedMethod === "wallet" ? "default" : "outline"}
          className={cn(
            "flex-col h-auto py-6 space-y-2 transition-all duration-200",
            selectedMethod === "wallet" ? "shadow-lg" : ""
          )}
          onClick={() => onSelectMethod("wallet")}
        >
          <Wallet className="h-6 w-6 mb-1" />
          <span className="font-medium">Connect Wallet</span>
          <span className="text-xs text-current opacity-80 font-normal">
            Pay directly from your wallet
          </span>
        </Button>
        
        <Button
          type="button"
          variant={selectedMethod === "qrcode" ? "default" : "outline"}
          className={cn(
            "flex-col h-auto py-6 space-y-2 transition-all duration-200",
            selectedMethod === "qrcode" ? "shadow-lg" : ""
          )}
          onClick={() => onSelectMethod("qrcode")}
        >
          <QrCode className="h-6 w-6 mb-1" />
          <span className="font-medium">Scan QR Code</span>
          <span className="text-xs text-current opacity-80 font-normal">
            Scan QR code with your wallet
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethod;
