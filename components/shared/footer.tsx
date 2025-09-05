/**
 * Application footer component
 * 
 * Provides a consistent footer across all pages with copyright information,
 * legal links, and responsive layout. Displays current year dynamically
 * and maintains proper spacing and alignment.
 * 
 * @component Footer
 * @returns {JSX.Element} Responsive footer with copyright and navigation links
 * 
 * @features
 * - Dynamic copyright year calculation
 * - Responsive layout (stacked on mobile, horizontal on desktop)
 * - Legal and informational links
 * - Consistent styling with application theme
 * - Proper spacing and typography
 * 
 * @responsive
 * - Mobile-first design with vertical stacking
 * - Horizontal layout on medium screens and up
 * - Centered alignment on mobile devices
 * - Flexible gap spacing that adapts to screen size
 * 
 * @accessibility
 * - Semantic footer element
 * - Proper link contrast and hover states
 * - Keyboard accessible navigation
 * - Screen reader friendly content structure
 * 
 * @example
 * ```tsx
 * // Used in layout components
 * <Footer />
 * // Automatically displays current year and legal links
 * ```
 * 
 * @styling
 * - Subtle top border for visual separation
 * - Muted text colors for secondary content
 * - Smooth color transitions on hover
 * - Container-based responsive layout
 * - Consistent padding and margins
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} ALX Polly. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}