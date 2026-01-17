import { memo } from 'react';
import { 
  BarChart2, Database, Palette, Settings, Share2, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type MobileTab = 'view' | 'data' | 'style' | 'config' | 'share';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  hasData?: boolean;
  className?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const NavItem = memo(({ icon, label, isActive, onClick, disabled }: NavItemProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "mobile-nav-item flex-1 touch-target",
      isActive ? "mobile-nav-item-active" : "mobile-nav-item-inactive",
      disabled && "opacity-40 pointer-events-none"
    )}
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
));

NavItem.displayName = 'NavItem';

function MobileBottomNav({ 
  activeTab, 
  onTabChange, 
  hasData = false,
  className 
}: MobileBottomNavProps) {
  return (
    <nav 
      className={cn(
        "mobile-bottom-nav",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch h-14">
        <NavItem
          icon={<Eye className="h-5 w-5" />}
          label="View"
          isActive={activeTab === 'view'}
          onClick={() => onTabChange('view')}
        />
        <NavItem
          icon={<Database className="h-5 w-5" />}
          label="Data"
          isActive={activeTab === 'data'}
          onClick={() => onTabChange('data')}
        />
        <NavItem
          icon={<Palette className="h-5 w-5" />}
          label="Style"
          isActive={activeTab === 'style'}
          onClick={() => onTabChange('style')}
        />
        <NavItem
          icon={<Settings className="h-5 w-5" />}
          label="Config"
          isActive={activeTab === 'config'}
          onClick={() => onTabChange('config')}
        />
        <NavItem
          icon={<Share2 className="h-5 w-5" />}
          label="Share"
          isActive={activeTab === 'share'}
          onClick={() => onTabChange('share')}
          disabled={!hasData}
        />
      </div>
    </nav>
  );
}

export default memo(MobileBottomNav);
