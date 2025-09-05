import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Props interface for the EmptyState component
 * 
 * Defines the configuration options for displaying empty state messages
 * with optional call-to-action elements and visual icons.
 * 
 * @interface EmptyStateProps
 */
type EmptyStateProps = {
  /** Primary heading text for the empty state */
  title: string;
  /** Descriptive text explaining the empty state condition */
  description: string;
  /** Optional text for the action button (requires actionHref) */
  actionLabel?: string;
  /** Optional URL for the action button (requires actionLabel) */
  actionHref?: string;
  /** Optional React element to display as an icon above the text */
  icon?: ReactNode;
};

/**
 * Reusable empty state component for displaying placeholder content
 * 
 * Provides a consistent interface for showing empty states across the application
 * with optional call-to-action buttons and visual elements. Commonly used when
 * lists, dashboards, or content areas have no data to display.
 * 
 * @component EmptyState
 * @param {EmptyStateProps} props - Component configuration
 * @returns {JSX.Element} Rendered empty state with centered layout
 * 
 * @features
 * - Centered layout with responsive design
 * - Optional icon display above content
 * - Primary title and descriptive text
 * - Optional call-to-action button with navigation
 * - Consistent styling across the application
 * - Accessible markup with proper heading hierarchy
 * 
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState
 *   title="No polls found"
 *   description="You haven't created any polls yet."
 * />
 * 
 * // With action button
 * <EmptyState
 *   title="No polls found"
 *   description="Get started by creating your first poll."
 *   actionLabel="Create Poll"
 *   actionHref="/polls/create"
 * />
 * 
 * // With icon
 * <EmptyState
 *   title="No results"
 *   description="Try adjusting your search criteria."
 *   icon={<SearchIcon className="h-12 w-12" />}
 * />
 * ```
 * 
 * @accessibility
 * - Uses semantic heading elements (h3)
 * - Proper text hierarchy and contrast
 * - Keyboard accessible action buttons
 * - Screen reader friendly descriptions
 * 
 * @styling
 * - Centered flex layout with vertical alignment
 * - Responsive padding and spacing
 * - Muted text colors for secondary content
 * - Consistent button styling via UI components
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-6">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}