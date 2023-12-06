import "@/css/Analytics.css";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { MdIosShare } from "react-icons/md";
import { useEffect, useState } from "react";
import { auth, db } from "@/Firebase";
import { collection, getDocs } from "firebase/firestore";
interface Entry {
  created: Date;
  locked: Date;
  text: string;
}
export default function Analytics() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [lockedEntries, setLockedEntries] = useState<Entry[]>([]);
  const [unlockedEntries, setUnlockedEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const currentDate = new Date();

    async function fetchEntries() {
      if (auth.currentUser) {
        const entryCollection = collection(
          db,
          "users",
          auth.currentUser.uid,
          "entries"
        );
        const querySnapshot = await getDocs(entryCollection);
        const fetchedEntries: Entry[] = [];

        querySnapshot.forEach((doc) => {
          const entryData = doc.data();
          fetchedEntries.push({
            text: entryData.text,
            created: entryData.created.toDate(),
            locked: entryData.locked.toDate(),
          });
        });

        setEntries(fetchedEntries);

        const sortedEntries = fetchedEntries.sort(
          (a, b) => a.locked.getTime() - b.locked.getTime()
        );

        const locked = sortedEntries.filter(
          (entry) => entry.locked > currentDate
        );
        const unlocked = sortedEntries.filter(
          (entry) => entry.locked <= currentDate
        );

        setLockedEntries(locked);
        setUnlockedEntries(unlocked);
      }
    }

    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        fetchEntries();
      } else {
        // User is signed out
        // You may want to clear the entries or perform other actions
        setEntries([]);
        setLockedEntries([]);
        setUnlockedEntries([]);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

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
            <h2>{entries.length}</h2>
          </CardHeader>
        </Card>
        <Card className="w-[32.5%]">
          <CardHeader>
            <CardTitle>Locked Entries:</CardTitle>
            <h2>{lockedEntries.length}</h2>
          </CardHeader>
        </Card>
        <Card className="w-[32.5%]">
          <CardHeader>
            <CardTitle>Unlocked Entries:</CardTitle>
            <h2>{unlockedEntries.length}</h2>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
