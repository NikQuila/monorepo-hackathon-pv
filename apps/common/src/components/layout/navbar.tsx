"use client";

import { Menu, X } from 'lucide-react';
import { cn } from '@common/lib/utils';
import { Button } from '@common/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@common/components/ui/sheet';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// const navItems = [
//   { label: 'Planes', href: '/planes' },
//   { label: 'The studio', href: '/studio' },
//   { label: 'The app', href: '#' },
//   { label: "Let's talk naked", href: '#' },
// ];

// const navActions = [
//   { label: 'Mi cuenta', href: '#' },
// ];

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) => (
  <a
    href={href}
    className={cn(
      'uppercase font-semibold hover:underline underline-offset-4',
      'text-sm leading-tight text-white',
      isActive && 'text-gray-900 underline hover:brightness-110'
    )}
  >
    {children}
  </a>
);

const DesktopNav = ({ pathname }: { pathname: string }) => (
  <nav className="hidden lg:flex justify-between items-center gap-4">
    <a href="/">
      <Image
        className=""
        src="/logo.svg"
        alt="OOH Logo"
        width={180}
        height={38}
        priority
      />
    </a>

    {/* <div className="w-full flex items-center gap-6">
      {navItems.map((item) => (
        <Nava key={item.href} href={item.href} isActive={pathname === item.href}>
          {item.label}
        </Nava>
      ))}
    </div> */}

    <Button variant="primary" asChild>
      <a href="#">
        Book a demo
      </a>
    </Button>
  </nav>
);

const MobileNav = ({ pathname }: { pathname: string }) => (
  <div className="block lg:hidden">
    <div className="flex items-center justify-between gap-4">
      {/* <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="text-white" size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="*:p-4 overflow-y-auto h-svh [&_.close]:hidden">
          <SheetHeader className="!p-2">
            <SheetTitle className="top-0 h-20 w-full justify-between gap-4 flex flex-row items-center">
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="text-gray-700" size={24} />
                </Button>
              </SheetClose>
              <a href="/">
                <Image
                  className=""
                  src="/logo.svg"
                  alt="OOH Logo"
                  width={180}
                  height={38}
                  priority
                />
              </a>
            </SheetTitle>
          </SheetHeader>
          <div className="my-4 flex *:text-xl flex-col gap-6 *:text-gray-700">
            {navItems.map((item) => (
              <SheetClose key={item.href} asChild>
                <Nava href={item.href}>
                  {item.label}
                </Nava>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet> */}

      <a href="/">
        <Image
          className=""
          src="/logo.svg"
          alt="OOH Logo"
          width={180}
          height={38}
          priority
        />
      </a>

      <Button variant="primary" asChild>
        <a href="#">
          Book a demo
        </a>
      </Button>
    </div>
  </div>
);

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="z-50 absolute w-screen [&_nav]:max-w-screen-xl [&_nav]:mx-auto top-0 px-4 h-20 content-center">
      <DesktopNav pathname={pathname} />
      <MobileNav pathname={pathname} />
    </div>
  );
};

export default Navbar;
