
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CouponInputProps {
  onApply: (coupon: string, discount: number) => void;
  className?: string;
}

const CouponInput: React.FC<CouponInputProps> = ({ onApply, className }) => {
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { toast } = useToast();

  // Mock coupon validation function
  const validateCoupon = (code: string): { valid: boolean; discount: number } => {
    // In a real app, this would make an API call to validate
    const validCoupons = {
      "CRYPTO10": 10,
      "WELCOME20": 20,
      "SAVE15": 15
    };

    const discount = validCoupons[code as keyof typeof validCoupons];
    return { valid: !!discount, discount: discount || 0 };
  };

  const handleApply = () => {
    if (!coupon.trim()) return;
    
    setApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      const { valid, discount } = validateCoupon(coupon);
      
      if (valid) {
        onApply(coupon, discount);
        setApplied(true);
        toast({
          title: "Coupon Applied",
          description: `${discount}% discount has been applied.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code you entered is invalid.",
          variant: "destructive",
        });
        setCoupon("");
      }
      
      setApplying(false);
    }, 600);
  };

  const handleClear = () => {
    setCoupon("");
    setApplied(false);
    onApply("", 0);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="coupon" className="text-sm font-medium">
        Coupon Code
      </label>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            id="coupon"
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => !applied && setCoupon(e.target.value.toUpperCase())}
            className={cn(
              "h-11 pr-10 transition-all duration-200",
              applied && "bg-secondary text-secondary-foreground font-medium"
            )}
            disabled={applying || applied}
          />
          {applied && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant={applied ? "outline" : "default"}
          size="sm"
          className={cn(
            "h-11 px-4 min-w-[5rem] font-medium transition-all duration-200",
            applying && "opacity-80"
          )}
          onClick={applied ? handleClear : handleApply}
          disabled={applying || (!applied && !coupon.trim())}
        >
          {applying ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : applied ? (
            <div className="flex items-center">
              <X className="h-4 w-4 mr-1.5" />
              <span>Remove</span>
            </div>
          ) : (
            "Apply"
          )}
        </Button>
      </div>
      {!applying && !applied && (
        <p className="text-xs text-muted-foreground">
          Try: CRYPTO10, WELCOME20, SAVE15
        </p>
      )}
    </div>
  );
};

export default CouponInput;
