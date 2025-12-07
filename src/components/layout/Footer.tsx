export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">RestaurantOS v1.0</span>
        <span className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} NCC UAT Portal • Chef Management System • All Rights Reserved
        </span>
      </div>
    </footer>
  );
};
