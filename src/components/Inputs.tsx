import "@/css/Inputs.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function Inputs() {
  const [currentDate, setCurrentDate] = useState<string>();

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

  return (
    <div className="inputsWrapper">
      <Tabs defaultValue="new" className="tabsWrapper">
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
              />
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="ml-auto">Lock this entry</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="past" className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
