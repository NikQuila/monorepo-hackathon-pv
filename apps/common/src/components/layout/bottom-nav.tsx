import { Link, useLocation } from 'wouter';
import { Home, Notebook, Plus, MessageCircle } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { Button } from '../ui/button';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Notebook, label: 'Journal', href: '/journal' },
];

export function BottomNav() {
  const [location, setLocation] = useLocation();
  const middleIndex = Math.ceil(navItems.length / 2);

  return (
    <nav
      className='fixed max-w-md mx-auto z-40 bottom-0 left-0 right-0 bg-white border-t border-gray-200'
    >
      <ul className='relative flex px-8 pb-3 justify-around'>
        {navItems.map((item, index) => {
          const isActive = location === item.href;
          return (
            <Fragment key={item.href}>
              {index === middleIndex && (
                <li className='size-14 aspect-square' />
              )}
              <li className='w-14 h-auto aspect-square'>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center py-2 text-xs ${
                    isActive
                      ? 'border-t-2 border-neutral-800'
                      : 'text-gray-500 border-t-2 border-transparent'
                  }`}
                >
                  <item.icon className='w-6 h-6 my-1' />
                </Link>
              </li>
            </Fragment>
          );
        })}
      </ul>
      <Button
        variant='primary'
        onClick={() => setLocation('/onboarding')}
        className='bg-[linear-gradient(90deg,_#FCE6CF_15%,_#FBCFFC_50%,_#CCD5FF_85%)] shadow-none size-20 [&_svg]:size-11 [&_svg]:stroke-[1.5] absolute -translate-y-1/2 left-1/2 -translate-x-1/2 top-0'
      >
        <Plus />
      </Button>
    </nav>
  );
}
