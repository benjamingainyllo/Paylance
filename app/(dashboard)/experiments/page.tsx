import { FlaskConical } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function ExperimentsPage() {
  return (
    <ComingSoon
      icon={FlaskConical}
      title="Experiments"
      summary="Test what actually makes people buy."
      planned={[
        "Try two prices for the same offer and see which earns more",
        "Test different titles and cover images on a storefront",
        "Compare checkout layouts on real traffic",
        "Call a result only once there's enough data to trust it",
      ]}
      insteadHref="/revenue"
      insteadLabel="See your revenue"
    />
  );
}
