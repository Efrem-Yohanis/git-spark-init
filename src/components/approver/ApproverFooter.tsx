export function ApproverFooter() {
  return (
    <footer className="border-t bg-card py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>© 2026 M-Pesa Ethiopia | Campaign Approval Portal</p>
        <div className="flex gap-4">
          <span className="hover:text-foreground cursor-pointer">Privacy</span>
          <span className="hover:text-foreground cursor-pointer">Security</span>
          <span className="hover:text-foreground cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}
