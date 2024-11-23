import { Link, useLocation } from 'wouter';
import { Home, Search, Bell, User, Book } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Book, label: 'Journal', href: '/journal' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200'>
      <ul className='flex justify-around'>
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <li key={item.href} className='flex-1'>
              <Link
                href={item.href}
                className={`flex flex-col items-center py-2 text-xs ${
                  isActive ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <item.icon className='w-6 h-6 mb-1' />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
