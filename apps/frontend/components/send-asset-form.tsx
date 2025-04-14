"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ASSETS = [
  { id: "eth", name: "Ethereum", amount: "1 ETH" },
  { id: "usdc", name: "USDC", amount: "100 USDC" },
  { id: "token", name: "Access Token", amount: "1 Token" },
];

export function SendAssetForm() {
  const router = useRouter();
  const { token } = useAuth();
  const [email, setEmail] = useState("");
  const [assetId, setAssetId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate amount based on asset type
    if (assetId === "nft") {
      if (!Number.isInteger(Number(amount))) {
        setError("NFT amount must be a whole number");
        return;
      }
    } else {
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        setError("Amount must be a positive number");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/send`,
        {
          email,
          assetId,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push(`/success?id=${response.data.id}`);
    } catch (err) {
      setError("Failed to send asset. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Recipient Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="recipient@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="asset">Select Asset</Label>
        <Select value={assetId} onValueChange={setAssetId} required>
          <SelectTrigger id="asset">
            <SelectValue placeholder="Select an asset to send" />
          </SelectTrigger>
          <SelectContent>
            {ASSETS.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type={assetId === "nft" ? "number" : "text"}
          placeholder={assetId === "nft" ? "1" : "0.0"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step={assetId === "nft" ? "1" : "0.000000000000000001"}
          min={assetId === "nft" ? "1" : "0"}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={true}>
        {loading ? "Sending..." : "Send Asset"}
      </Button>
    </form>
  );
}
