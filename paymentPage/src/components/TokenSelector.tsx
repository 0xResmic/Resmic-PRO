import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Default token icons
const TOKEN_ICONS: Record<string, string> = {
  // eth: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjE2IiBmaWxsPSIjNjI3RUVBIi8+PHBhdGggZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTYuNDk4IDQuMjV2OC43NzJsMy44MTYgMi42MzUtNi4wNDMgNC4yMjJMMTAuMyAxNC4xMjVWNC4yNWg2LjE5OHptMSA4Ljc3M2wzLjgxNiAyLjYzNS0zLjgxNiAyLjc1di01LjM4NXptLTEgNS4zODVsLTMuODE2LTIuNzVsMy44MTYtMi42MzV2NS4zODV6Ii8+PC9nPjwvc3ZnPg==",
  // usdt: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzI2QTE3QiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xNyA4LjJjNC44IDAgOC43IDEuNiA4LjcgMy42cy0zLjkgMy42LTguNyAzLjZjLTQuOCAwLTguNy0xLjYtOC43LTMuNnMzLjktMy42IDguNy0zLjZtNS41IDQuM3Y2YzAgLjUgMCAuOS0uMiAxLjNzLS40LjgtLjggMS4xYy0uMy4zLS43LjYtMS4yLjgtLjYuMy0xLjIuNS0xLjkuNi0uOC4yLTEuNi4zLTIuNS4zLS45IDAtMS43LS4xLTIuNS0uMy0uNy0uMS0xLjMtLjMtMS45LS42LS41LS4yLS45LS41LTEuMi0uOC0uMy0uMy0uNi0uNy0uOC0xLjEtLjEtLjQtLjItLjgtLjItMS4zdi02Yy41LjggMS4yIDEuNSAyLjEgMiAuNi40IDEuMy43IDIgLjkuOC4zIDEuNi40IDIuNC40LjggMCAxLjYtLjEgMi40LS40LjctLjIgMS40LS41IDItLjkuOS0uNSAxLjYtMS4yIDIuMS0yem0wIDBhNC4yIDQuMiAwIDAgMS0xLjUgMS4xIDE0LjEgMTQuMSAwIDAgMS0xLjguN2MtMS40LjQtMy4xLjUtNC4yLjVzLTIuOC0uMS00LjItLjVhMTQuMSAxNC4xIDAgMCAxLTEuOC0uNyA0LjIgNC4yIDAgMCAxLTEuNS0xLjF2NC4xYzAgLjQuMi45LjggMS4yLjUuNCAxLjMuNyAyLjMuOS45LjIgMS45LjMgMyAuM3MyLjEtLjEgMy0uM2MxLS4yIDEuOC0uNSAyLjMtLjkuNi0uMy44LS44LjgtMS4yaC4ydi00LjFlLS4xLjF6Ii8+PC9nPjwvc3ZnPg==",
  // usdc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzJEQkQ0QiIvPjxwYXRoIGQ9Ik0xNC4zNSA3LjM1NGMuMjM3LS41NDQuOTI2LS44MTYgMS40NjUgMGEuNzMyLjczMiAwIDAgMSAuMTMuNDF2LjAzNWE0LjA2OSA0LjA2OSAwIDAgMSAzLjg3IDMuOTY5YzAgLjEzNS4xMDkuMjQzLjI0My4yNDNoMS44OTNhLjI0Mi4yNDIgMCAwIDAgLjI0My0uMjQzQTcuMzE4IDcuMzE4IDAgMCAwIDE2IDQuMTE3SDEzLjgxNFY0LjA4M2EuNzMyLjczMiAwIDAgMSAuMTMtLjQxYy41MzktLjgxNiAxLjIyOC0uNTQ0IDEuNDY1IDBhLjczMi43MzIgMCAwIDEgLjEzLjQxdi4wMzVoMi4xOTNBNy43MjIgNy43MjIgMCAwIDAgOS45OTkgMTEuNzZhLjI0Mi4yNDIgMCAwIDAgLjI0My4yNDNoMS45MjhhLjI0Mi4yNDIgMCAwIDAgLjI0My0uMjQzIDQuMDY5IDQuMDY5IDAgMCAxIDMuNzktMy45NjZ2LS4wMzJjMC0uMTU4LjA0LS4zMDMuMTQ5LS40MSIsIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMTYuMDAxIDI1LjE5M2gyLjE4OHYtLjAzNWEuNzMyLjczMiAwIDAgMSAuMTMtLjQxYy41NC0uODE2IDEuMjI4LS41NDQgMS40NjUgMGEuNzMyLjczMiAwIDAgMSAuMTMuNDF2LjA0M2gtMi4xOGE3LjcyMiA3LjcyMiAwIDAgMCA3LjgzNC03LjY3NGEuMjQyLjI0MiAwIDAgMC0uMjQzLS4yNDNoLTEuOTI5YS4yNDIuMjQyIDAgMCAwLS4yNDMuMjQzIDQuMDY5IDQuMDY5IDAgMCAxLTMuNzcgMy45NzJ2LjAzNWMwIC4xNTgtLjA0LjMwMy0uMTQ5LjQxLS4yMzcuNTQ0LS45MjYuODE2LTEuNDY1IDAtLjEwOC0uMTA3LS4xNDktLjI1Mi0uMTQ5LS40MXYtLjAzNUE0LjA2OSA0LjA2OSAwIDAgMSAxMS45NSAxNy43NmEuMjQyLjI0MiAwIDAgMC0uMjQzLS4yNDNIOS44MTRhLjI0Mi4yNDIgMCAwIDAtLjI0My4yNDNBNy4zMTggNy4zMTggMCAwIDAgMTYgMjUuMTkzaC4wMDJ2LjAzNWMwIC4xNTgtLjA0LjMwMy0uMTQ5LjQxLS4yMzcuNTQ0LS45MjYuODE2LTEuNDY1IDAtLjEwOC0uMTA3LS4xMzEtLjI1My0uMTMtLjQxVjI1aC0yLjE5QTcuNzIyIDcuNzIyIDAgMCAwIDIwIDE3LjMyNWEuMjQyLjI0MiAwIDAgMC0uMjQzLS4yNDNoLTEuODkzYS4yNDIuMjQyIDAgMCAwLS4yNDMuMjQzICA0LjExNiA0LjExNiAwIDAgMS0zLjg5IDMuOTc3di4wMzVjMCAuMTU4LS4wNC4zMDMtLjE0OS40MS0uMjM3LjU0NC0uOTI2LjgxNi0xLjQ2NSAwLS4xMDgtLjEwNy0uMTMxLS4yNTMtLjEzLS40MXYtLjA0M2gyLjE5YTcuNzIyIDcuNzIyIDAgMCAwIDcuODMzLTcuNjc0QTcuNzIyIDcuNzIyIDAgMCAwIDEzLjgxIDYwNXYuMDM1Yy4uMTU4LS4wNC4zMDMtLjE0OS40MS0uMjM3LjU0NC0uOTI2LjgxNi0xLjQ2NSAwLS4xMDgtLjEwNy0uMTMxLS4yNTMtLjEzLS40MXYtLjA0M2gyLjE4djQuMDM1Yy4uMTU4LS4wNC4zMDMtLjE0OS40MS0uMjM3LjU0NC0uOTI2LjgxNi0xLjQ2NSAwLS4xMDgtLjEwNy0uMTMxLS4yNTMtLjEzLS40MXYiLCBmaWxsPSIjRkZGIi8+PC9nPjwvc3ZnPg==",
  // btc: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0Y3OTMxQSIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTIzLjE4OSAxNC4wMmMuMzE0LTIuMDk2LTEuMjgzLTMuMjIzLTMuNDY1LTMuOTc1bC43MDgtMi44NC0xLjcyOC0uNDMtLjY5IDIuNzY1Yy0uNDU0LS4xMTQtLjkyLS4yMi0xLjM4NS0uMzI2bC42OTUtMi43ODNMTTUuOTkyIDYubC0uNzA4IDIuODM5Yy0uMzc2LS4wODYtLjc0Ni0uMTctMS4xMDQtLjI2bC4wMDItLjAwOUwxMS42IDcuNzc2bC0uNDYgMS44NDZjMCAwIDEuMjgzLjI5NCAxLjI1Ni4zMTIuNy4xNzUuODI3LjYzOC44MDUgMS4wMDZsLS44MDYgMy4yMzVjLjA0OC4wMTIuMTEuMDMuMTguMDU3bC0uMTgzLS4wNDUtMS4xMzYgNC41NTJjLS4wODYuMjEyLS4zMDMuNTMxLS43OTMuNDEuMDE4LjAyNS0xLjI1Ni0uMzEzLTEuMjU2LS4zMTNsLS44NTggMS45Nzh2LjAwM2gtLjAwNGwtLjA0OS4xMTN6Ii8+PC9nPjwvc3ZnPg==",
  // sol: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSI2NCIgZmlsbD0iIzAwMCIvPjxwYXRoIGZpbGw9IiM4RkM0RDIiIGQ9Ik0zNS4zNzYgNzIuNzk3czYuOTU4LTQuMTc0IDEzLjc4LTQuMTc0aDQ1Ljc2M2MxLjk1NCAwIDUuMjMyIDEuMzg4IDYuOTU4IDIuNzc2IDEuOTUzIDEuMzg4IDE4Ljg3NCAxNi42NTYgMjAuODI4IDE3LjA3LjY0OC4yNzcuODMzLjY5NC42NTQuODMzLS4xOC4xMzgtLjM1OS4yNzctLjgzMy4yNzdINzguNjczYy0xLjk1MyAwLTMuMjE2LTEuMzg4LTYuOTU4LTIuNzc2TDM1LjM3NiA3Mi43OTd6bTAgMTcuMDdsNi42MDUtMy45MDFzNy4xNC00LjQ0OCAxMy43OC00LjQ0OGg0NS43NjNjMS45NTQgMCAuODMzIDEuMzg5LTIuMDkgMi43NzdsLTYuOTU5IDIuNzc1aC01Ny4wOHoiLz48cGF0aCBmaWxsPSIjRTREQzYyIiBkPSJNMzUuMzc2IDM4LjQ0N3M2Ljk1OC00LjE3NCAxMy43OC00LjE3NGg0NS43NjNjMS45NTQgMCA1LjIzMiAxLjM4OCA2Ljk1OCAyLjc3NiAxLjk1MyAxLjM4OCAxOC44NzQgMTYuNjU2IDIwLjgyOCAxNy4wNy42NDguMjc3LjgzMy42OTQuNjU0LjgzMy0uMTguMTM4LS4zNTkuMjc3LS44MzMuMjc3SDc4LjY3M2MtMS45NTMgMC0zLjIxNi0xLjM4OC02Ljk1OC0yLjc3NkwzNS4zNzYgMzguNDQ3eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0zNS4zNzYgNTUuNTE3bDYuNjA1LTMuOTAxczYuNDctNS4wMzIgMTMuNzgtNC40NDhoNDUuNzYzYzEuOTU0IDAgLjgzMyAxLjM4OS0yLjA5IDIuNzc3bC02Ljk1OSAyLjc3NmgtNTcuMDh2Mi43NzZ6Ii8+PC9nPjwvc3ZnPg==",
  // matic: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE2IiB5MT0iMCIgeDI9IjE2IiB5Mj0iMzIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MjQ3ZTUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM5MTUxZTAiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iYiI+PHBhdGggZD0iTTI1LjEyLDExLjY0LDIxLDkuMjZhLjkxLjkxLDAsMCwwLS45MSwwbC00LjEyLDIuMzhhLjg5Ljg5LDAsMCwwLS40NS43OHY0Ljc2YS44OS44OSwwLDAsMCwuNDUuNzhMMjAuMSwyMC4zNGEuOTEuOTEsMCwwLDAsLjkxLDBsMy41OS0yLjA3YS4yNC4yNCwwLDAsMSwuMzYuMjF2Mi43MWEuMjQuMjQsMCwwLDEtLjEyLjIxbC03LjkxLDQuNTdsLTcuNzgtNC41YS4yNC4yNCwwLDAsMS0uMTItLjIxVjE0LjQxYS4yNC4yNCwwLDAsMSwuMTItLjIxbDcuNzgtNC41YS4yNC4yNCwwLDAsMSwuMjUsMGw3LjkxLDQuNTdhLjI0LjI0LDAsMCwxLC4xMi4yMVYxNy4xYS4yNC4yNCwwLDAsMS0uMTIuMjFMMjAuNTYsMTlhLjI0LjI0LDAsMCwxLS4yNSwwbC0zLjA4LTEuNzhhLjI0LjI0LDAsMCwxLS4xMi0uMjFWMTQuNjNhLjI0LjI0LDAsMCwxLC4xMi0uMjFsMy4wOC0xLjc4YS4yNC4yNCwwLDAsMSwuMjUsMGwzLjA4LDEuNzhhLjI0LjI0LDAsMCwxLC4xMi4yMXYxLjc4YS4yNC4yNCwwLDAsMSwuMzYuMjFWMTIuNDJBLjg5Ljg5LDAsMCwwLDI1LjEyLDExLjY0WiIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNiKSI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ1cmwoI2EpIi8+PC9nPjwvc3ZnPg==",
};

// Token name mapping
const TOKEN_NAMES: Record<string, string> = {
  // eth: "Ethereum",
  // usdt: "Tether",
  // usdc: "USD Coin",
  // btc: "Bitcoin",
  // sol: "Solana",
  // matic: "Polygon",
};

interface TokenSelectorProps {
  blockchain: string;
  value: string;
  onChange: (value: string) => void;
  tokens: string[];
  className?: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  blockchain,
  value,
  onChange,
  tokens,
  className,
}) => {
  const getTokenIcon = (token: string): string => {
    return TOKEN_ICONS[token.toLowerCase()] || '';
  };

  const getTokenName = (token: string): string => {
    return TOKEN_NAMES[token.toLowerCase()] || token.toUpperCase();
  };

  const getTokenSymbol = (token: string): string => {
    return token.toUpperCase();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="token" className="text-sm font-medium">
        Select Token
      </label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={tokens.length === 0}
      >
        <SelectTrigger
          id="token"
          className="w-full h-11 bg-card border-input text-sm font-medium"
        >
          <SelectValue placeholder="Select a token">
            {value && (
              <div className="flex items-center">
                {getTokenIcon(value) && (
                  <div className="w-5 h-5 mr-2 overflow-hidden rounded-full">
                    <img 
                      src={getTokenIcon(value)} 
                      alt={getTokenName(value)} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span>{getTokenName(value)} ({getTokenSymbol(value)})</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border border-border">
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <SelectItem
                key={token}
                value={token}
                className="py-2.5 cursor-pointer"
              >
                <div className="flex items-center">
                  {getTokenIcon(token) && (
                    <div className="w-5 h-5 mr-2 overflow-hidden rounded-full">
                      {/* <img 
                        src={getTokenIcon(token)} 
                        alt={getTokenName(token)} 
                        className="w-full h-full object-cover"
                      /> */}
                    </div>
                  )}
                  <span>{token}</span>
                  {/* <span>{getTokenName(token)} ({getTokenSymbol(token)})</span> */}
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              Select a blockchain first
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TokenSelector;