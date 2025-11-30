import { useState, useEffect } from "react";
import { HabitCard } from "@/components/HabitCard";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  createdAt: string;
}

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("habits");
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const getTodayString = () => new Date().toISOString().split("T")[0];

  const getStreak = (completedDates: string[]) => {
    const sorted = [...completedDates].sort().reverse();
    let streak = 0;
    let checkDate = new Date();

    for (const dateStr of sorted) {
      const date = new Date(dateStr);
      const diffDays = Math.floor(
        (checkDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
    toast({
      title: "Habit created! 🎯",
      description: `"${name}" added to your tracker.`,
    });
  };

  const toggleHabit = (id: string) => {
    const today = getTodayString();
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const isCompleted = habit.completedDates.includes(today);
          const updatedDates = isCompleted
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today];

          if (!isCompleted) {
            toast({
              title: "Great job! ✨",
              description: `${habit.name} completed for today.`,
            });
          }

          return { ...habit, completedDates: updatedDates };
        }
        return habit;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
    toast({
      title: "Habit removed",
      description: "The habit has been deleted.",
      variant: "destructive",
    });
  };

  const today = getTodayString();
  const completedToday = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            Daily Habits
          </h1>
          <p className="text-muted-foreground text-lg">
            Build consistency, one day at a time
          </p>
        </header>

        {totalHabits > 0 && (
          <div className="mb-8 p-6 rounded-2xl bg-card border-2 border-border habit-card-shadow">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Today's Progress
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-primary">
                  {completedToday}
                </span>
                <span className="text-2xl text-muted-foreground">
                  / {totalHabits}
                </span>
              </div>
              {completedToday === totalHabits && totalHabits > 0 && (
                <p className="text-sm text-primary font-medium mt-2">
                  All habits completed! 🎉
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {habits.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted/50 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Start Your Journey
                </h3>
                <p className="text-muted-foreground">
                  Create your first habit and begin building consistency today.
                </p>
              </div>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                isCompletedToday={habit.completedDates.includes(today)}
                streak={getStreak(habit.completedDates)}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
              />
            ))
          )}
        </div>

        <div className="flex justify-center">
          <AddHabitDialog onAdd={addHabit} />
        </div>
      </div>
    </div>
  );
};

export default Index;
