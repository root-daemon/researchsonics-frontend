import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="bg-white text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Client Dashboard</h1>
        <div className="space-x-4">
          <Button variant="outline" className="text-white border-white">
            Home
          </Button>
          <Button variant="outline" className="text-white border-white">
            Clients
          </Button>
          <Button variant="outline" className="text-white border-white">
            Settings
          </Button>
        </div>
      </div>
    </nav>
  );
};
