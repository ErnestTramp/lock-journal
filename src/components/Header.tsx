import "@/css/Header.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
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
import { useEffect, useState } from "react";
import signInWithGoogle, { auth, signOutWithGoogle } from "@/Firebase";
import { FcGoogle } from "react-icons/fc";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    });
  }, []);

  return (
    <header>
      <h1>My Journal</h1>
      <div className="actionButtons">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="ghost">
              <RxHamburgerMenu className="scale-150" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={signOutWithGoogle}>
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {isLogged ? (
          <Avatar className="border">
            <AvatarImage src={auth.currentUser?.photoURL || ""} />
            <AvatarFallback>
              {auth.currentUser?.displayName
                ? auth.currentUser.displayName.charAt(0) +
                  auth.currentUser.displayName.charAt(1)
                : "PFP"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Button onClick={signInWithGoogle} variant="outline">
            <FcGoogle className="mr-3" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
