"use client";
import { Plus, PieChart, Calculator } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-stone-100">
      <nav className="bg-white shadow-sm py-4 px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Project Name</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Student Dashboard</h2>
          </div>
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
            <Plus />
          </div>
        </header>

        <div className="grid grid-cols-2 gap-6">
          {/* Repeated Cards */}
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Maths CT - 3</h3>
                <span className="p-2 bg-blue-100 rounded-full">
                  <Calculator className="text-blue-600" />
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Algebra</span>
                  <span className="font-medium border rounded-xl px-2">92/100</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  Average: <span className="text-green-500 font-medium">91.67%</span>
                </span>
                <span>
                  Grade: <span className="text-green-500 font-medium">A</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Overall Performance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PieChart className="text-blue-600 mr-2" />
              <span className="text-lg">
                Total Average: <span className="font-medium text-green-500">90.00%</span>
              </span>
            </div>
            <div className="text-lg">
              Overall Grade: <span className="font-medium text-green-500">A-</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
