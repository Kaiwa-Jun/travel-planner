"use client";

import { Calendar, Clock, GripVertical, MapPin } from "lucide-react";

export const ScheduleSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-medium text-lg flex items-center gap-2 text-muted-foreground sticky top-0 bg-background py-2">
          <Calendar className="h-4 w-4" />
          <div className="h-4 bg-muted rounded animate-pulse w-32" />
        </div>
        <div className="space-y-3 mt-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 border rounded-lg"
            >
              <div className="flex items-center self-stretch text-muted-foreground">
                <GripVertical className="h-4 w-4" />
              </div>
              <div className="flex items-center px-2 py-4">
                <div className="flex-shrink-0 w-20 md:w-20 aspect-[4/3]">
                  <div className="w-full h-full rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                  <div className="h-3 bg-muted rounded animate-pulse w-16" />
                </div>
                <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
