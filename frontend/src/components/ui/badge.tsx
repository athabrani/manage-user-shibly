import { clsx } from 'clsx';

export function Badge({ children, variant = 'primary' }: { children: React.ReactNode, variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' }) {
  const styles = {
    primary: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
    neutral: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={clsx("px-2.5 py-0.5 rounded-md text-xs font-semibold", styles[variant])}>
      {children}
    </span>
  );
}