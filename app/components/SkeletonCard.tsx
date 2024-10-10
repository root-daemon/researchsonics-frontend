import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SkeletonCard() {
  return (
    <Card className="w-full animate-pulse border-2 border-[#f6c90e] shadow-lg">
      <CardHeader className="rounded-t-lg bg-white">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-300" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-300" />
            <div className="h-3 w-32 rounded bg-gray-200" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 rounded-b-lg bg-white">
        <div className="h-8 rounded bg-gray-200" />
        <div className="h-8 rounded bg-gray-200" />
        <div className="ml-auto h-8 w-32 rounded bg-gray-300" />
      </CardContent>
    </Card>
  );
}
