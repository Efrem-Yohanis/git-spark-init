import { OrderTimeline as TimelineType } from '@/types/restaurant';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
  timeline: TimelineType[];
}

export const OrderTimeline = ({ timeline }: OrderTimelineProps) => {
  return (
    <div className="space-y-4">
      {timeline.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'h-3 w-3 rounded-full',
                index === 0 ? 'bg-primary animate-pulse' : 'bg-muted-foreground/50'
              )}
            />
            {index < timeline.length - 1 && (
              <div className="w-0.5 flex-1 bg-border mt-2" />
            )}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-foreground">{event.event}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">
                {format(event.timestamp, 'HH:mm:ss')}
              </span>
              {event.actor && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{event.actor}</span>
                </>
              )}
            </div>
            {event.details && (
              <p className="text-xs text-muted-foreground mt-1">{event.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
