import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Default icon images for popular blockchains
const BLOCKCHAIN_ICONS: Record<string, string> = {
  Ethereum: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiM2MjdFRUEiIGQ9Ik0xNiAwYzguODM3IDAgMTYgNy4xNjMgMTYgMTZjMCA4LjgzNy03LjE2MyAxNi0xNiAxNlYweiIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0ZGRiIgZD0iTTIwLjkzMiAxMS45MzRsLTQuOTg1IDIuOTQ3VjcuODM0bDQuOTg1IDQuMXptLTUuMDE1IDcuOTEybC00LjljLTIuOTQ4LTEuNzI0LTQuOTk3LTIuOTAxLTQuOTk3LTIuOTAxbDkuOTg0LTE3djUuMDYxbC00Ljk4NCAyLjkzNyA0Ljk4NCAyLjkwMSA0Ljk5Ny0yLjkwMSA0Ljk4NC0yLjkzN1YwTDM2IDE2Ljk0NWwtNC45OTcgMi45MDEtNC45ODQgMi45MzctNC45ODQgMi45MDEtNS4wMTUtMi45MzQtNC45OTgtMi45MDQgNC45OTgtMi45MzR6Ii8+PC9zdmc+",
  bitcoin: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0Y3OTMxQSIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTIzLjE4OSAxNC4wMmMuMzE0LTIuMDk2LTEuMjgzLTMuMjIzLTMuNDY1LTMuOTc1bC43MDgtMi44NC0xLjcyOC0uNDMtLjY5IDIuNzY1Yy0uNDU0LS4xMTQtLjkyLS4yMi0xLjM4NS0uMzI2bC42OTUtMi43ODNMTTUuOTkyIDYubC0uNzA4IDIuODM5Yy0uMzc2LS4wODYtLjc0Ni0uMTctMS4xMDQtLjI2bC4wMDItLjAwOUwxMS42IDcuNzc2bC0uNDYgMS44NDZjMCAwIDEuMjgzLjI5NCAxLjI1Ni4zMTIuNy4xNzUuODI3LjYzOC44MDUgMS4wMDZsLS44MDYgMy4yMzVjLjA0OC4wMTIuMTEuMDMuMTguMDU3bC0uMTgzLS4wNDUtMS4xMzYgNC41NTJjLS4wODYuMjEyLS4zMDMuNTMxLS43OTMuNDEuMDE4LjAyNS0xLjI1Ni0uMzEzLTEuMjU2LS4zMTNsLS44NTggMS45Nzh2LjAwM2gtLjAwNGwtLjA0OS4xMTN6TTE3LjMyNSAxOS44N2wzLjMyNy0xLjMzOGExLjQ0IDEuNDQgMCAwIDAtLjczOC0uMTVsLTIuMzczLjk1NGExLjQyIDEuNDIgMCAwIDAgLjYuNDI5Yy4xOTYuMDc5LjQxMS4xMS42Mi4wODNhMS4zMSAxLjMxIDAgMCAwIC42ODgtLjQ0MiAxLjM3MiAxLjM3MiAwIDAgMC0uNTEyLS41MDggMS40NTQgMS40NTQgMCAwIDAtLjcyNS0uMTVjLS4wODcgMC0uMTc0LjAwNy0uMjYxLjAyMnptLjkxOS0uNjg3aC4wMDRhLjU5My41OTMgMCAwIDEgLjY0NS41OTEuMzI3LjMyNyAwIDAgMS0uMDgxLjE4MmwtLjI1My4yNzNhLjQxNC40MTQgMCAwIDEtLjE5Ni4xMDNsLS4wMzIuMDA3YS40MzYuNDM2IDAgMCAxLS4yMS0uMDA4LjM4Ni4zODYgMCAwIDEtLjE1Mi0uMDg3LjQxLjQxIDAgMCAxLS4xMDYtLjE2LjQ0Ni40NDYgMCAwIDEtLjAzNi0uMTk4Yy4wMDUtLjA5OC4wNDMtLjE5LjEwNi0uMjYxbC4yNjMtLjI5YS41MTQuNTE0IDAgMCAxIC4wNTItLjE1MnptMS4yOTItNC45MThsLTMuNjYgMS40ODRjLjE0Ny4yMjUuNDAyLjM2Ni42NzcuMzY2LjA3NiAwIC4xNTEtLjAxLjIyNC0uMDNsMi42LTEuMDVhMS40NTMgMS40NTMgMCAwIDAtLjYzNC0uNDg5IDEuNTI2IDEuNTI2IDAgMCAwLS43OTctLjA3NiAxLjQ1OCAxLjQ1OCAwIDAgMC0uNjk1LjE5NSAxLjQ4NiAxLjQ4NiAwIDAgMC0uNTYuNDQ2bC0yLjYwNSAxLjA3MWExLjM3NyAxLjM3NyAwIDAgMCAxLjI5Mi4wNWwzLjMyMi0xLjM1NGExLjQwOCAxLjQwOCAwIDAgMC0uMzItLjM0MyAxLjQ2OCAxLjQ2OCAwIDAgMC0uNDAxLS4yMThjLS4wNDgtLjAxNS0uMDk3LS4wMjgtLjE0Ny0uMDM4YTEuNTYyIDEuNTYyIDAgMCAwLS4zMzctLjAzMyAxLjQ2IDEuNDYgMCAwIDAtLjgwNC4yNTVjLS4wODMuMDYtLjE2LjEzLS4yMy4yMDV6TTE1LjExIDExLjA0MWwtLjg1NSAzLjQyMWMtLjQyLS4xMDUtLjg0LS4yMS0xLjI2LS4zMTVsLjg1Ni0zLjQzYy4zNzYuMDk0Ljc1My4xODggMS4yNi4zMTV2LjAwOXptLjk5NS4yNDljLjQxNi4xMDYuODM4LjIxIDEuMjYuMzE2bC0uODU2IDMuNDNjLS40Mi0uMTA2LS44NC0uMjEtMS4yNi0uMzE1bC44NTYtMy40M3ptLjkyLjIzN2wtLjg1NSAzLjQyYy0uNDIxLS4xMDUtLjg0MS0uMjEtMS4yNjEtLjMxNWwuODU2LTMuNDI5Yy40MjEuMTA2Ljg0Mi4yMSAxLjI2LjMxNXYuMDFoLS4wMDF6bS45MS4yMjhsLS44NTUgMy40M2MtLjQyLS4xMDYtLjg0LS4yMS0xLjI2LS4zMTZsLjg1Ni0zLjQzYy40Mi4xMDYuODQuMjEgMS4yNi4zMTZ6Ii8+PC9nPjwvc3ZnPg==",
  Solana: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSI2NCIgZmlsbD0iIzAwMCIvPjxwYXRoIGZpbGw9IiM4RkM0RDIiIGQ9Ik0zNS4zNzYgNzIuNzk3czYuOTU4LTQuMTc0IDEzLjc4LTQuMTc0aDQ1Ljc2M2MxLjk1NCAwIDUuMjMyIDEuMzg4IDYuOTU4IDIuNzc2IDEuOTUzIDEuMzg4IDE4Ljg3NCAxNi42NTYgMjAuODI4IDE3LjA3LjY0OC4yNzcuODMzLjY5NC42NTQuODMzLS4xOC4xMzgtLjM1OS4yNzctLjgzMy4yNzdINzguNjczYy0xLjk1MyAwLTMuMjE2LTEuMzg4LTYuOTU4LTIuNzc2TDM1LjM3NiA3Mi43OTd6bTAgMTcuMDdsNi42MDUtMy45MDFzNy4xNC00LjQ0OCAxMy43OC00LjQ0OGg0NS43NjNjMS45NTQgMCAuODMzIDEuMzg5LTIuMDkgMi43NzdsLTYuOTU5IDIuNzc1aC01Ny4wOHoiLz48cGF0aCBmaWxsPSIjRTREQzYyIiBkPSJNMzUuMzc2IDM4LjQ0N3M2Ljk1OC00LjE3NCAxMy43OC00LjE3NGg0NS43NjNjMS45NTQgMCA1LjIzMiAxLjM4OCA2Ljk1OCAyLjc3NiAxLjk1MyAxLjM4OCAxOC44NzQgMTYuNjU2IDIwLjgyOCAxNy4wNy42NDguMjc3LjgzMy42OTQuNjU0LjgzMy0uMTguMTM4LS4zNTkuMjc3LS44MzMuMjc3SDc4LjY3M2MtMS45NTMgMC0zLjIxNi0xLjM4OC02Ljk1OC0yLjc3NkwzNS4zNzYgMzguNDQ3eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0zNS4zNzYgNTUuNTE3bDYuNjA1LTMuOTAxczYuNDctNS4wMzIgMTMuNzgtNC40NDhoNDUuNzYzYzEuOTU0IDAgLjgzMyAxLjM4OS0yLjA5IDIuNzc3bC02Ljk1OSAyLjc3NmgtNTcuMDh2Mi43NzZ6Ii8+PC9nPjwvc3ZnPg==",
  Polygon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE2IiB5MT0iMCIgeDI9IjE2IiB5Mj0iMzIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MjQ3ZTUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM5MTUxZTAiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iYiI+PHBhdGggZD0iTTI1LjEyLDExLjY0LDIxLDkuMjZhLjkxLjkxLDAsMCwwLS45MSwwbC00LjEyLDIuMzhhLjg5Ljg5LDAsMCwwLS40NS43OHY0Ljc2YS44OS44OSwwLDAsMCwuNDUuNzhMMjAuMSwyMC4zNGEuOTEuOTEsMCwwLDAsLjkxLDBsMy41OS0yLjA3YS4yNC4yNCwwLDAsMSwuMzYuMjF2Mi43MWEuMjQuMjQsMCwwLDEtLjEyLjIxbC03LjkxLDQuNTdsLTcuNzgtNC41YS4yNC4yNCwwLDAsMS0uMTItLjIxVjE0LjQxYS4yNC4yNCwwLDAsMSwuMTItLjIxbDcuNzgtNC41YS4yNC4yNCwwLDAsMSwuMjUsMGw3LjkxLDQuNTdhLjI0LjI0LDAsMCwxLC4xMi4yMVYxNy4xYS4yNC4yNCwwLDAsMS0uMTIuMjFMMjAuNTYsMTlhLjI0LjI0LDAsMCwxLS4yNSwwbC0zLjA4LTEuNzhhLjI0LjI0LDAsMCwxLS4xMi0uMjFWMTQuNjNhLjI0LjI0LDAsMCwxLC4xMi0uMjFsMy4wOC0xLjc4YS4yNC4yNCwwLDAsMSwuMjUsMGwzLjA4LDEuNzhhLjI0LjI0LDAsMCwxLC4xMi4yMXYxLjc4YS4yNC4yNCwwLDAsMSwuMzYuMjFWMTIuNDJBLjg5Ljg5LDAsMCwwLDI1LjEyLDExLjY0WiIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNiKSI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ1cmwoI2EpIi8+PC9nPjwvc3ZnPg==",
};

interface BlockchainSelectorProps {
  value: string;
  onChange: (value: string) => void;
  blockchains: string[];
  className?: string;
}

const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({
  value,
  onChange,
  blockchains,
  className,
}) => {
  const getBlockchainIcon = (blockchain: string): string => {
    return BLOCKCHAIN_ICONS[blockchain.toLowerCase()] || '';
  };

  const getBlockchainName = (blockchain: string): string => {
    // Capitalize the first letter and format as needed
    return blockchain.charAt(0).toUpperCase() + blockchain.slice(1);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="blockchain" className="text-sm font-medium">
        Select Blockchain
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="blockchain"
          className="w-full h-11 bg-card border-input text-sm font-medium"
        >
          <SelectValue placeholder="Select a blockchain">
            {value && (
              <div className="flex items-center">
                {getBlockchainIcon(value) && (
                  <div className="w-5 h-5 mr-2 overflow-hidden rounded-full">
                    <img 
                      src={getBlockchainIcon(value)} 
                      alt={getBlockchainName(value)} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span>{getBlockchainName(value)}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border border-border">
          {blockchains.map((chain) => (
            <SelectItem
              key={chain}
              value={chain}
              className="py-2.5 cursor-pointer"
            >
              <div className="flex items-center">
                {getBlockchainIcon(chain) && (
                  <div className="w-5 h-5 mr-2 overflow-hidden rounded-full">
                    <img 
                      src={getBlockchainIcon(chain)} 
                      alt={getBlockchainName(chain)} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span>{getBlockchainName(chain)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BlockchainSelector;