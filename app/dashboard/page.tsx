import Overview from "./_components/overview";
import RecentActivities from "./_components/recent-activities";

const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-sora tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to your administration panel.
        </p>
      </div>
      <Overview />
      <div className="">
        <RecentActivities />
      </div>
    </div>
  );
};

export default DashboardPage;
