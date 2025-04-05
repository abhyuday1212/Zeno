import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { auth } from "@/auth";
import SignOut from "./signOut";
import { ModeToggle } from "./mode-toggle";
import { FaVideo } from "react-icons/fa";

export default async function Navbar() {
  // const [open, setOpen] = useState(false);
  const session = await auth();

  const NavItems = () => (
    <>
      {!session ? (
        <div className="flex gap-2 justify-center">
          <ModeToggle />
          <Link href="/auth/signin">
            <Button variant="default">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="default">Sign Up</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* <Link href={session ? "/user/home" : "/"}>
            <Button variant="ghost" className="text-bold-text">
              Home
            </Button>
          </Link> */}
          <Link href="/user/call">
            <Button variant="ghost" className="text-bold-text">
              Call
            </Button>
          </Link>
          {/* <Link href="/user/status">
            <Button variant="ghost" className="text-bold-text">
              Waiting Queue
            </Button>
          </Link> */}

          <div className="flex items-center justify-start gap-2 ml-1">
            <ModeToggle />

            <Link href="/user/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-bold-text" />
              </Button>
            </Link>
            <SignOut />
          </div>
        </>
      )}
    </>
  );

  return (
    <nav className="border-b bg-background ">
      <div className="flex h-16 items-center max-w-7xl mx-auto">
        <Link
          href={session ? "/user/home" : "/"}
          className="flex items-center space-x-2"
        >
          <FaVideo className="h-6 w-6 text-bold-text" />
          <span className="text-xl font-bold text-bold-text">Zeno</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="ml-auto hidden md:flex items-center space-x-4">
          <NavItems />
        </div>

        {/* Mobile Navigation */}
        {/* <div className="ml-auto md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div> */}
      </div>
    </nav>
  );
}
