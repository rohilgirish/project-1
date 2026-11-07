'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, MapPin, Trees, Calculator, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  className?: string;
  onItemClick?: () => void;
  direction?: 'row' | 'col';
}

export default function MenuListButtons({
  className = '',
  onItemClick,
  direction = 'row'
}: Props) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    {
      name: t('nav.home'),
      href: '/',
      icon: <Home className="w-4 h-4" />
    },
    {
      name: t('nav.plots'),
      href: '/plots',
      icon: <Layers className="w-4 h-4" />
    },
    {
      name: t('nav.location'),
      href: '/location',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      name: t('nav.amenities'),
      href: '/amenities',
      icon: <Trees className="w-4 h-4" />
    },
    {
      name: t('nav.pricing'),
      href: '/pricing',
      icon: <Calculator className="w-4 h-4" />
    }
  ];

  return (
    <div
      className={`flex ${
        direction === 'col'
          ? 'flex-col gap-2.5 w-full'
          : 'flex-row items-center gap-1.5 xl:gap-2'
      } ${className}`}
    >
      {menuItems.map(item => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`menu-btn ${direction === 'col' ? 'btn-col' : ''} ${
              isActive ? 'active' : ''
            }`}
            title={item.name}
          >
            <div className="icon">
              {item.icon}
            </div>
            <span className="text">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
