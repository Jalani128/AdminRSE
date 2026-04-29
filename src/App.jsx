    if (isLoadingAuth) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f8f9ff]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Loading Admin Panel...</p>
          </div>
        </div>
      );
    }