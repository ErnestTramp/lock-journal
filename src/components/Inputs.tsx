import "@/css/Inputs.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Entries from "./Entries";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/Firebase";
import { useToast } from "@/components/ui/use-toast";

export default function Inputs() {
  const [currentDate, setCurrentDate] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [entry, setEntry] = useState("");

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = date.toLocaleString("en-GB", options);
    setCurrentDate(formattedDate);
  }, []);

  function setDateHandler(amount: number) {
    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() + amount);
    setDate(newDate);
  }

  const { toast } = useToast();

  async function handleSubmit() {
    if (entry === "") {
      toast({
        variant: "destructive",
        title: "Please write at least one word!",
      });
    } else if (date === undefined) {
      toast({
        variant: "destructive",
        title: "Please select a lock date!",
      });
    } else if (date === undefined && entry === "") {
      toast({
        variant: "destructive",
        title: "Please select a lock date and write at least one word!",
      });
    } else {
      if (auth.currentUser) {
        addDoc(collection(db, "users", auth.currentUser.uid, "entries"), {
          text: entry,
          created: serverTimestamp(),
          locked: date,
        });
        toast({
          title: `This entry has been locked until: ${date.toLocaleDateString()}!`,
        });
        onTabChange("past");
      }
    }
  }

  const [tab, setTab] = useState("new");

  const onTabChange = (value: string) => {
    setTab(value);
  };

  return (
    <div className="inputsWrapper">
      <Tabs value={tab} onValueChange={onTabChange} className="tabsWrapper">
        <TabsList>
          <TabsTrigger value="new">Write an entry</TabsTrigger>
          <TabsTrigger value="past">My entries</TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{currentDate}</CardTitle>
            </CardHeader>
            <CardContent className="h-[77%]">
              <Textarea
                className="newText"
                placeholder="Write anything you want and we will keep it safe until the date you set. So, whats on your mind?"
                onChange={(e) => {
                  setEntry(e.target.value);
                }}
              />
            </CardContent>
            <CardFooter className="mt-auto">
              <AlertDialog>
                <AlertDialogTrigger className="ml-auto">
                  <Button>Lock this entry</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Once this entry is locked, you wont be able to unlock it
                      again... make sure you wrote everything on your mind.
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
                    <AlertDialogAction onClick={handleSubmit}>
                      Lock
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="past" className="h-full">
          <Entries></Entries>
        </TabsContent>
      </Tabs>
    </div>
  );
}
