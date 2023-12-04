import "@/css/Analytics.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { MdIosShare } from "react-icons/md";
import { entries } from "@/entries";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [lockedEntries, setLockedEntries] = useState(0);
  const [unlockedEntries, setUnlockedEntries] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    setTotalEntries(entries.length);
    const currentDate = new Date();

    // Convert date strings to Date objects and sort the entries
    const sortedEntries = entries
      .map((entry) => ({
        ...entry,
        created: parseDateString(entry.created),
        locked: parseDateString(entry.locked),
      }))
      .sort((a, b) => a.locked.getTime() - b.locked.getTime());

    // Separate entries based on locked date
    const locked = sortedEntries.filter((entry) => entry.locked > currentDate);
    const unlocked = sortedEntries.filter(
      (entry) => entry.locked <= currentDate
    );

    setLockedEntries(locked.length);
    setUnlockedEntries(unlocked.length);
  }, [entries]);

  return (
    <div className="analyticsWrapper">
      <div className="analyticsRow mt-11">
        <Card className="streak">
          <CardHeader>
            <CardTitle>Your current streak:</CardTitle>
            <h2>0 Weeks</h2>
            <CardDescription>In row you have written entries.</CardDescription>
          </CardHeader>
        </Card>
        <Button className="share">
          <MdIosShare />
        </Button>
      </div>
      <div className="analyticsRow totals">
        <Card className="w-[32.5%]">
          <CardHeader>
            <CardTitle>Total Entries:</CardTitle>
            <h2>{totalEntries}</h2>
          </CardHeader>
        </Card>
        <Card className="w-[32.5%]">
          <CardHeader>
            <CardTitle>Locked Entries:</CardTitle>
            <h2>{lockedEntries}</h2>
          </CardHeader>
        </Card>
        <Card className="w-[32.5%]">
          <CardHeader>
            <CardTitle>Unlocked Entries:</CardTitle>
            <h2>{unlockedEntries}</h2>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

// Helper function to parse date strings in "DD-MM-YYYY" format
function parseDateString(dateString: string): Date {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // Month is 0-based
}
