
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectProps {
  amount: number;
  token: string;
  onPaymentComplete: () => void;
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  amount,
  token,
  onPaymentComplete,
  className,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const wallets = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiB2aWV3Qm94PSIwIDAgMjEyIDE4OSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjQ0RCREIyIiBwb2ludHM9IjYwLjc1IDE3My4yNSA4OC4zMTMgMTgwLjU2MyA4OC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTA2LjMxMyAxNjguNzUgMTA2LjMxMyAxODAgMTA2LjMxMyAxODcuODc1IDg5LjQzOCAxODcuODc1IDY4LjYyNSAxNzguODc1Ii8+PHBvbHlnb24gZmlsbD0iI0NEQkRCMiIgcG9pbnRzPSIxMDUuNzUgMTczLjI1IDEzMi43NSAxODAuNTYzIDEzMi43NSAxNzEgMTM1IDE2OC43NSAxNTAuNzUgMTY4Ljc1IDE1MC43NSAxODAgMTUwLjc1IDE4Ny44NzUgMTMzLjg3NSAxODcuODc1IDExMy4wNjMgMTc4Ljg3NSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjU2LjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjkwLjU2MyAxNTIuNDM4IDgOC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTIwLjkzOCAxNjguNzUgMTIzLjE4OCAxNzEgMTIxLjUgMTUyLjQzOCAxMDQuNjI1IDE1OC4xODgiLz48cG9seWdvbiBmaWxsPSIjRjg5QzM1IiBwb2ludHM9Ijc1LjM3NSAxMy41IDEwNS45MzggNDMuODc1IDkwLjU2MyA3OC4zMTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjE2Ny4wNjMgMTMuNSAxMzYuMTI1IDQ0LjI1IDE1MC43NSA3OC4zMTMiIHRyYW5zZm9ybT0ibWF0cml4KC0xIDAgMCAxIDMwMy4xODggMCkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9Ijc1LjM3NSAxMy41IDkwLjU2MyA3OC4zMTMgNTYuMjUgNzguMzEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSIxNjcuMDYzIDEzLjUgMTUxLjg3NSA3OC4zMTMgMTg2LjE4OCA3OC4zMTMiIHRyYW5zZm9ybT0ibWF0cml4KC0xIDAgMCAxIDMzOC4wNjMgMCkiLz48cG9seWdvbiBmaWxsPSIjRUE4RDNBIiBwb2ludHM9IjU2LjI1IDc4LjMxMyA5MC41NjMgNzguMzEzIDgwLjYyNSAxMTcuMTg4IDU4LjEyNSA4MC42MjUiLz48cG9seWdvbiBmaWxsPSIjRUE4RDNBIiBwb2ludHM9IjE4Ni4xODggNzguMzEzIDE1MS44NzUgNzguMzEzIDE2MS44MTMgMTE3LjU2MyAxODQuMzEzIDgwLjYyNSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMzM4LjA2MyAwKSIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iOTAuNTYzIDc4LjMxMyA4MC42MjUgMTE3LjE4OCAxMDEuODEzIDE1Ny41IDEwNi4zMTMgMTM3LjQzOCAxMDYuMzEzIDExNy4xODgiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjE1MS44NzUgNzguMzEzIDE2MS44MTMgMTE3LjE4OCAxNDAuNjI1IDE1Ny41IDEzNi4xMjUgMTM3LjQzOCAxMzYuMTI1IDExNy4xODgiIHRyYW5zZm9ybT0ibWF0cml4KC0xIDAgMCAxIDI5Ny45MzggMCkiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9IjU2LjI1IDc4LjMxMyA1OC4xMjUgODAuNjI1IDU4LjEyNSAxNTQuMTI1IDU2LjI1IDE1Ni4zNzUiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9IjE4Ni4xODggNzguMzEzIDE4NC4zMTMgODAuNjI1IDE4NC4zMTMgMTU0LjEyNSAxODYuMTg4IDE1Ni4zNzUiIHRyYW5zZm9ybT0ibWF0cml4KC0xIDAgMCAxIDM3MC41IDApIi8+PHBvbHlnb24gZmlsbD0iI0Y4OUQzNSIgcG9pbnRzPSI1OC4xMjUgODAuNjI1IDgwLjYyNSAxMTcuMTg4IDU4LjEyNSAxNTQuMTI1Ii8+PHBvbHlnb24gZmlsbD0iI0Y4OUQzNSIgcG9pbnRzPSIxODQuMzEzIDgwLjYyNSAxNjEuODEzIDExNy41NjMgMTg0LjMxMyAxNTQuMTI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAzNDYuMTI1IDApIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI1OC4xMjUgMTU0LjEyNSA5MC41NjMgMTU2LjM3NSA4OC4zMTMgMTcxIDkwLjU2MyAxNzMuMjUgNTguMTI1IDE3My4yNSIvPjxwb2x5Z29uIGZpbGw9IiNEODdDMzAiIHBvaW50cz0iMTg0LjMxMyAxNTQuMTI1IDE1MS44NzUgMTU2LjM3NSAxNTQuMTI1IDE3MSAxNTEuODc1IDE3My4yNSAxODQuMzEzIDE3My4yNSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMzQyLjE4NyAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFQThEM0EiIHBvaW50cz0iOTAuNTYzIDE1Ni4zNzUgOTAuNTYzIDE3My4yNSA1OC4xMjUgMTczLjI1IDU4LjEyNSAxNTQuMTI1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSIxNTEuODc1IDE1Ni4zNzUgMTUxLjg3NSAxNzMuMjUgMTg0LjMxMyAxNzMuMjUgMTg0LjMxMyAxNTQuMTI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAzMzYuMTg4IDApIi8+PHBvbHlnb24gZmlsbD0iI0Y4OUQzNSIgcG9pbnRzPSI5MC41NjMgMTgwLjU2MyA4OS40MzggMTg3Ljg3NSA2OC42MjUgMTc4Ljg3NSA2MC43NSAxNzMuMjUgOTAuNTYzIDE3My4yNSIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTUxLjg3NSAxODAuNTYzIDE1MyAxODcuODc1IDE3My44MTMgMTc4Ljg3NSAxODEuNjg4IDE3My4yNSAxNTEuODc1IDE3My4yNSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMzQyLjE4NyAwKSIvPjxwb2x5Z29uIGZpbGw9IiNDQkJEQjIiIHBvaW50cz0iOTAuNTYzIDE3My4yNSA4OC4zMTMgMTcxIDkwLjU2MyAxNTYuMzc1IDkyLjI1IDE1Ny41IDEyMS4xMjUgMTU3LjUgMTIzLjE4OCAxNTYuMzc1IDEyMS41IDE3MSAxMjMuMTg4IDE3My4yNSIvPjxwb2x5Z29uIGZpbGw9IiMzOTM5MzkiIHBvaW50cz0iODEgNjAgMTA0LjYyNSA0NS41NjMgMTI3LjEyNSA2MCAxMDcuNjI1IDkxLjkzOCIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iNTguMTI1IDE1NC4xMjUgNTYuMjUgMTU2LjM3NSA1OC4xMjUgMTczLjI1IDYwLjc1IDE3My4yNSIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iMTg0LjMxMyAxNTQuMTI1IDE4Ni4xODggMTU2LjM3NSAxODQuMzEzIDE3My4yNSAxODEuNjg4IDE3My4yNSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMzcwLjUgMCkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9IjkwLjU2MyAxNTYuMzc1IDkyLjI1IDE1Ny41IDEwNS43NSAxNTguODEzIDEyMC4zNzUgMTU4LjEyNSAxMjEuMTI1IDE1Ny41IDEyMy4xODggMTU2LjM3NSAxMjEuNSAxNTIuNDM4IDEwMi4zNzUgMTQ5LjQzOCA5MC41NjMgMTUyLjQzOCIvPjxwb2x5Z29uIGZpbGw9IiM0NDM5MzkiIHBvaW50cz0iOTIuMjUgMTU3LjUgOTAuNTYzIDE1Ni4zNzUgOTAuNTYzIDE3My4yNSA5Mi4yNSAxNTcuNSIvPjxwb2x5Z29uIGZpbGw9IiM0NDM5MzkiIHBvaW50cz0iMTIxLjEyNSAxNTcuNSAxMjMuMTg4IDE1Ni4zNzUgMTIxLjUgMTczLjI1IDEyMS4xMjUgMTU3LjUiLz48L2c+PC9zdmc+",
    },
    {
      id: "wallet-connect",
      name: "WalletConnect",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjEuNDM4IDM2LjY1MmM0OC45MTItNDcuOTQ2IDEyOC4yNzQtNDcuOTQ2IDE3Ny4xODUgMGw1Ljg4NyA1Ljc3M2M1LjQ1IDUuMzQgNS40NSAxNC4wMDQgMCAxOS4zNDRsLTIwLjEzNiAxOS43NTVjLTIuNzI1IDIuNjctNy4xNDUgMi42Ny05Ljg3IDBsLTguMTAzLTcuOTVjLTM0LjEzNy0zMy41LTg5LjUzOS0zMy41LTEyMy42NzYgMGwtOC42OTEgOC41MjVjLTIuNzI1IDIuNjctNy4xNDUgMi42Ny05Ljg3IDBsLTIwLjEzNy0xOS43NTRjLTUuNDUtNS4zNC01LjQ1LTE0LjAwNSAwLTE5LjM0NGw1Ljg4OS01Ljc3NFoiIGZpbGw9IiMzQjk5RkMiLz48cGF0aCBkPSJNMTY2LjEzNiA4Ni4wOTJsMTcuOTQ1IDE3LjYwM2MyLjcyNSAyLjY3IDcuMTQ0IDIuNjcgOS44NyAwTDI0OC4wNSA1MC42NzdjNi4wODItNS45Ni0uMzQ4LTE1Ljk4OS04LjcyLTEzLjE0M2wtLjQ3LjE1OGM3NS4yNzQgMzQuNzYzIDczLjIwNiAxMjMuMzMxLTMuOTIyIDE1NS41MzYtNTEuNTI4IDM2LjQ0NS0xMjkuMS00LjUzNS0xNjcuMjQ5LTYwLjQ4N2wtNi41NTUtNy43OTZjLTQuNDM2LTUuMjc5LTE0LjU2Ni0xMC40MjMtMTcuMTktMTMuMDA2bDEwLjI5Mi0xMC4wOGMzLjk3Ni0zLjkgOS4zMDgtNC42NDUgMTMuNjk0LTIuMTI3bDg4LjU4NCA0MS41NzIgMTAuNjMyLTEwLjQyM2MxLjM2My0xLjMzNiAzLjE4My0yLjA4NSA1LjEtMi4wODVDMTYyLjkyOCA4My44MDggMTY0Ljc3MyA4NC41NyAxNjYuMTM2IDg2LjA5MloiIGZpbGw9IiMzQjk5RkMiLz48L3N2Zz4=",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSI1MTIiIGN5PSI1MTIiIHI9IjUxMiIgZmlsbD0iIzAwNTJGRiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1MiA1MTJDMTUyIDcwNS4xIDMxOC45IDg3MiA1MTIgODcyQzcwNS4xIDg3MiA4NzIgNzA1LjEgODcyIDUxMkM4NzIgMzE4LjkgNzA1LjEgMTUyIDUxMiAxNTJDMzE4LjkgMTUyIDE1MiAzMTguOSAxNTIgNTEyWk00MjAgNDk2QzQyOC44IDQ5NiA0MzYgNTAzLjIgNDM2IDUxMkM0MzYgNTIwLjggNDI4LjggNTI4IDQyMCA1MjhIMzg4QzM3OS4yIDUyOCAzNzIgNTIwLjggMzcyIDUxMkMzNzIgNTAzLjIgMzc5LjIgNDk2IDM4OCA0OTZINDIwWk02MzYgNDk2QzY0NC44IDQ5NiA2NTIgNTAzLjIgNjUyIDUxMkM2NTIgNTIwLjggNjQ0LjggNTI4IDYzNiA1MjhINjA0QzU5NS4yIDUyOCA1ODggNTIwLjggNTg4IDUxMkM1ODggNTAzLjIgNTk1LjIgNDk2IDYwNCA0OTZINjM2Wk01MTIgNjQwQzU4MS45IDY0MCA2MzkgNTgzIDYzOSA1MTJDNjM5IDQ0MSA1ODEuOSAzODQgNTEyIDM4NEM0NDIuMSAzODQgMzg1IDQ0MSAzODUgNTEyQzM4NSA1ODMgNDQyLjEgNjQwIDUxMiA2NDBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
    },
  ];

  const handleConnect = (walletId: string) => {
    setConnecting(true);
    
    // Simulate a wallet connection
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: `Your ${wallets.find(w => w.id === walletId)?.name} wallet is now connected.`,
      });
    }, 1000);
  };

  const handlePay = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
      
      toast({
        title: "Payment Complete",
        description: `Your payment of ${amount} ${token} has been sent successfully.`,
        variant: "default",
      });
    }, 1500);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-6 p-6 animate-scale-in",
        className
      )}
    >
      {!connected ? (
        <>
          <div className="text-center space-y-2 mb-4">
            <h3 className="text-lg font-medium">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Select a wallet to connect and make your payment
            </p>
          </div>
          
          <div className="w-full grid gap-3">
            {wallets.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                className="w-full justify-start h-14 text-base hover:bg-secondary"
                disabled={connecting}
                onClick={() => handleConnect(wallet.id)}
              >
                <div className="flex items-center w-full">
                  <div className="w-8 h-8 mr-3">
                    <img
                      src={wallet.icon}
                      alt={wallet.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span>{wallet.name}</span>
                  {connecting && (
                    <div className="ml-auto">
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Complete Payment</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet is connected and ready to make a payment
            </p>
          </div>
          
          <div className="bg-secondary rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Amount</div>
            <div className="text-2xl font-semibold mb-1">
              {amount} <span className="text-primary">{token}</span>
            </div>
          </div>
          
          <Button
            className="w-full h-12 text-base"
            disabled={processing}
            onClick={handlePay}
          >
            {processing ? (
              <div className="flex items-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Processing...</span>
              </div>
            ) : (
              "Complete Payment"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
