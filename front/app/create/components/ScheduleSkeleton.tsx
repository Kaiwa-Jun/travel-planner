"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const ScheduleSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-medium text-lg flex items-center gap-2 text-muted-foreground sticky top-0 bg-background py-2">
          <Calendar className="h-4 w-4" />
          <div className="h-4 bg-muted rounded animate-pulse w-32" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-6 bg-muted rounded animate-pulse w-48 mb-2" />
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-32" />
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-40" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
