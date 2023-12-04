import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { Button } from "./ui/button";
import "@/css/Entries.css";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/Firebase";

interface Entry {
  created: Date;
  locked: Date;
  text: string;
}

export default function Entries(): JSX.Element {
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
            created: entryData.created.toDate(), // Convert Firestore timestamp to Date
            locked: entryData.locked.toDate(), // Convert Firestore timestamp to Date
          });
        });

        setEntries(fetchedEntries);
      }
    }

    fetchEntries();

    // Sort the entries based on the locked date
    const sortedEntries = entries.sort(
      (a, b) => a.locked.getTime() - b.locked.getTime()
    );

    // Separate entries based on locked date
    const locked = sortedEntries.filter((entry) => entry.locked > currentDate);
    const unlocked = sortedEntries.filter(
      (entry) => entry.locked <= currentDate
    );

    setLockedEntries(locked);
    setUnlockedEntries(unlocked);
  }, [entries]);

  return (
    <Card className="h-full flex flex-col">
      <ScrollArea className="w-full h-full">
        <CardHeader>
          <CardTitle>
            {unlockedEntries.length === 0
              ? "Locked entries:"
              : "Unlocked entries:"}
          </CardTitle>
          {unlockedEntries.length === 0 ? (
            lockedEntries.length === 0 ? (
              <CardDescription>No entries to show!</CardDescription>
            ) : (
              <div className="lockedWrapper">
                {lockedEntries.map((entry) => (
                  <Alert className="text-left lockedEntry">
                    <FaLock />

                    <AlertTitle>
                      {entry.created.toLocaleDateString()}
                    </AlertTitle>
                    <AlertDescription>
                      This entry is locked until{" "}
                      {entry.locked.toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )
          ) : (
            unlockedEntries.map((entry) => (
              <AlertDialog key={entry.created.getTime()}>
                <AlertDialogTrigger>
                  <Alert className="text-left flex">
                    <FaLockOpen />
                    <div className="flex flex-col pt-1">
                      <AlertTitle>
                        {entry.created.toLocaleDateString()}
                      </AlertTitle>
                      <AlertDescription>
                        This entry is ready to open!
                      </AlertDescription>
                    </div>
                    <Button className="ml-auto mt-1 readButton">
                      Read now
                    </Button>
                  </Alert>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {entry.created.toLocaleDateString()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {entry.text}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Lock Again</AlertDialogCancel>
                    <AlertDialogAction>Close</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ))
          )}
        </CardHeader>
        <CardHeader className="bottomHalf">
          <CardTitle>
            {unlockedEntries.length === 0
              ? "Unlocked entries:"
              : "Locked entries:"}
          </CardTitle>
          {unlockedEntries.length === 0 ? (
            <CardDescription>No unlocked entries!</CardDescription>
          ) : lockedEntries.length === 0 ? (
            <CardDescription>No locked entries to show!</CardDescription>
          ) : (
            <div className="lockedWrapper">
              {lockedEntries.map((entry) => (
                <Alert
                  className="text-left lockedEntry"
                  key={entry.created.getTime()}
                >
                  <FaLock />

                  <AlertTitle>{entry.created.toLocaleDateString()}</AlertTitle>
                  <AlertDescription>
                    This entry is locked until{" "}
                    {entry.locked.toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardHeader>
      </ScrollArea>
    </Card>
  );
}
