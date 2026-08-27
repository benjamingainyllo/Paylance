import { Zap } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function AutomationsPage() {
  return (
    <ComingSoon
      icon={Zap}
      title="Automations"
      summary="Things that happen on their own after someone buys."
      planned={[
        "Send access links and receipts automatically after a purchase",
        "Follow up with buyers who started checkout but didn't finish",
        "Tag a buyer in your audience based on what they bought",
        "Send a reminder before an event you're hosting",
      ]}
      insteadHref="/audience"
      insteadLabel="See your audience"
    />
  );
}
