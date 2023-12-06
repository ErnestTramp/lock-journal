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
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/Firebase";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { useToast } from "./ui/use-toast";

interface Entry {
  created: Date;
  locked: Date;
  text: string;
}

export default function Entries(): JSX.Element {
  const [lockedEntries, setLockedEntries] = useState<Entry[]>([]);
  const [unlockedEntries, setUnlockedEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState<Date>();

  function setDateHandler(amount: number) {
    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() + amount);
    setDate(newDate);
  }

  const currentDate = new Date();

  // Function to fetch entries
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

      // Sort the entries based on the locked date
      const sortedEntries = fetchedEntries.sort(
        (a, b) => a.locked.getTime() - b.locked.getTime()
      );

      // Separate entries based on locked date
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

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        fetchEntries();
      } else {
        // User is signed out
        // You may want to clear the entries or perform other actions
        setLockedEntries([]);
        setUnlockedEntries([]);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const { toast } = useToast();

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
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <AlertDialogCancel>Lock Again</AlertDialogCancel>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Once this entry is locked, you wont be able to
                            unlock it again... make sure you wrote everything on
                            your mind.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-2 w-[65%]">
                          <p>Pick an unlock date:</p>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <div className="w-full flex justify-between">
                            <Button
                              variant="outline"
                              className="w-[32.5%]"
                              onClick={() => setDateHandler(3)}
                            >
                              3 Months
                            </Button>
                            <Button
                              variant="outline"
                              className="w-[32.5%]"
                              onClick={() => setDateHandler(6)}
                            >
                              6 Months
                            </Button>
                            <Button
                              variant="outline"
                              className="w-[32.5%]"
                              onClick={() => setDateHandler(12)}
                            >
                              1 Year
                            </Button>
                          </div>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              if (auth.currentUser) {
                                try {
                                  const q = query(
                                    collection(
                                      db,
                                      "users",
                                      auth.currentUser.uid,
                                      "entries"
                                    ),
                                    where("created", "==", entry.created)
                                  );
                                  const snap = await getDocs(q);
                                  snap.forEach(async (doc) => {
                                    await updateDoc(doc.ref, {
                                      locked: date,
                                    });
                                  });
                                  toast({
                                    title: `Entry has been relocked until ${date?.toLocaleDateString()}!`,
                                  });
                                  fetchEntries();
                                } catch (e) {
                                  return e;
                                }
                              }
                            }}
                          >
                            Re-Lock
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
