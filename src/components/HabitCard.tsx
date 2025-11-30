import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  id: string;
  name: string;
  isCompletedToday: boolean;
  streak: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard = ({
  id,
  name,
  isCompletedToday,
  streak,
  onToggle,
  onDelete,
}: HabitCardProps) => {
  return (
    <Card
      className={cn(
        "habit-card-shadow transition-smooth p-5 hover:scale-[1.02] border-2",
        isCompletedToday
          ? "bg-primary/5 border-primary/30"
          : "bg-card border-border"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Checkbox
            id={id}
            checked={isCompletedToday}
            onCheckedChange={() => onToggle(id)}
            className="h-6 w-6 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="flex-1">
            <label
              htmlFor={id}
              className={cn(
                "text-lg font-medium cursor-pointer transition-smooth select-none",
                isCompletedToday && "text-muted-foreground line-through"
              )}
            >
              {name}
            </label>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <Flame className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-accent">
                  {streak} day{streak !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="text-muted-foreground hover:text-destructive transition-smooth shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
