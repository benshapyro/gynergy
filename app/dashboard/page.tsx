import { DailyQuote } from "@/components/journal/DailyQuote";
import { JournalStatus } from "@/components/journal/JournalStatus";
import { DailyAction } from "@/components/journal/DailyAction";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      {/* Daily Quote Section */}
      <DailyQuote />

      {/* Journal Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <JournalStatus type="morning" />
        <JournalStatus type="evening" />
      </div>

      {/* Daily Action */}
      <DailyAction />
    </div>
  );
}
