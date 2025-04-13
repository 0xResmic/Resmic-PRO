
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentConfirmationProps {
  amount: any;
  token: string;
  onReset: () => void;
  className?: string;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  amount,
  token,
  onReset,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center space-y-6 py-10 animate-scale-in",
        className
      )}
    >
      <div className="rounded-full bg-green-100 p-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Payment Complete!</h2>
        <p className="text-muted-foreground">
          Your payment of {amount} {token} has been processed successfully.
        </p>
      </div>
      
      <div className="pt-4">
        <Button onClick={onReset} className="min-w-[8rem]">
          Make Another Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
