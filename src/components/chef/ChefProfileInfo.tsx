import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Chef } from '@/types/restaurant';
import { Phone, Mail, MapPin, Calendar, Briefcase, Clock, DollarSign, Award } from 'lucide-react';
import { format } from 'date-fns';

interface ChefProfileInfoProps {
  chef: Chef;
}

const statusColors: Record<string, string> = {
  available: 'bg-status-success text-white',
  busy: 'bg-status-error text-white',
  break: 'bg-status-warning text-black',
  offline: 'bg-muted text-muted-foreground',
};

const positionLabels: Record<string, string> = {
  head_chef: 'Head Chef',
  chef: 'Chef',
  assistant_chef: 'Assistant Chef',
};

const sectionLabels: Record<string, string> = {
  veg: 'Vegetarian',
  non_veg: 'Non-Vegetarian',
  snacks: 'Snacks',
  bakery: 'Bakery',
  other: 'Other',
};

const shiftLabels: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  rotational: 'Rotational',
};

const mealTypeLabels: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

export const ChefProfileInfo = ({ chef }: ChefProfileInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage src={chef.avatar} alt={chef.name} />
            <AvatarFallback className="text-3xl bg-primary/10 text-primary">
              {chef.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Badge className={`mt-4 ${statusColors[chef.status]}`}>
            {chef.status.charAt(0).toUpperCase() + chef.status.slice(1)}
          </Badge>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{chef.name}</h2>
            <p className="text-muted-foreground">
              {chef.position ? positionLabels[chef.position] || chef.position : 'Chef'} • ID: {chef.employeeId || chef.id}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chef.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{chef.phone}</span>
              </div>
            )}
            {chef.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{chef.email}</span>
              </div>
            )}
            {chef.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                <MapPin className="h-4 w-4" />
                <span>{chef.address}</span>
              </div>
            )}
            {chef.dateOfBirth && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>DOB: {format(new Date(chef.dateOfBirth), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Briefcase className="h-4 w-4" />
            <span className="text-xs">Position</span>
          </div>
          <p className="font-medium text-foreground">
            {chef.position ? positionLabels[chef.position] : 'Chef'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Award className="h-4 w-4" />
            <span className="text-xs">Kitchen Section</span>
          </div>
          <p className="font-medium text-foreground">
            {chef.kitchenSection ? sectionLabels[chef.kitchenSection] : chef.station}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Work Shift</span>
          </div>
          <p className="font-medium text-foreground">
            {chef.workShift ? shiftLabels[chef.workShift] : chef.shift}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Award className="h-4 w-4" />
            <span className="text-xs">Experience</span>
          </div>
          <p className="font-medium text-foreground">
            {chef.experience ? `${chef.experience} years` : 'N/A'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Join Date</span>
          </div>
          <p className="font-medium text-foreground">
            {chef.joinDate ? format(new Date(chef.joinDate), 'MMM dd, yyyy') : 'N/A'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Award className="h-4 w-4" />
            <span className="text-xs">Meal Type</span>
          </div>
          <p className="font-medium text-foreground">
            {chef.assignedMealType ? mealTypeLabels[chef.assignedMealType] : 'All'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Briefcase className="h-4 w-4" />
            <span className="text-xs">Employee ID</span>
          </div>
          <p className="font-medium text-foreground">{chef.employeeId || chef.id}</p>
        </div>

        {chef.salary && (
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Salary</span>
            </div>
            <p className="font-medium text-foreground">${chef.salary.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
