# Training Tracker Setup Guide

## Overview
The Training Tracker is a comprehensive 15-month planche mastery program integrated into your application. It allows you to track daily progress, mark exercises as complete, and add personal notes for each training day.

## Features

### 📅 15-Month Progressive Program
- Month-by-month structured training plan
- Progressive difficulty from foundation to full planche mastery
- Each month includes specific goals, bonus skills, and milestone checks

### ✅ Interactive Daily Tracking
- Check off completed exercises
- Visual progress bars for each day
- Automatic completion timestamps
- Reset functionality for days

### 📝 Personal Notes
- Add daily training notes
- Track how you felt during each session
- Document observations and improvements

### 📊 Progress Statistics
- Track completed tasks vs total tasks
- Monitor daily completion percentage
- View overall monthly progress

## Setup Instructions

### 1. Seed the Database

First, you need to populate Firebase with the training data:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the seed page:
   ```
   http://localhost:3000/admin/seed
   ```

3. Click the "Seed Database" button to populate Firebase with all 15 months of training data

4. Once successful, you'll see a confirmation message

### 2. Access the Training Tracker

After seeding, you can access the training tracker in two ways:

1. **Via Navigation Menu**: Click on "Training" in the sidebar
2. **Direct URL**: Visit `/training`

### 3. Using the Training Tracker

#### Viewing Months
- The main training page shows all 15 months
- Each card displays:
  - Month number and phase name
  - Top 2 goals (with indicator for more)
  - Bonus skills to work on

#### Monthly View
Click on any month to see:
- Weekly schedule (Monday-Sunday)
- Monthly goals and bonus skills
- Milestone checks
- Overall progress statistics

#### Daily Tracking
Each day card includes:
- Training focus for the day
- Interactive checklist of exercises
- Progress bar showing completion
- Note section for personal observations
- Completion timestamp when all tasks are done
- Reset button to clear progress

#### Adding Notes
1. Click the edit icon in the note section
2. Type your observations
3. Click "Save" to store the note

## Firebase Structure

The training data is stored in Firebase Firestore with the following structure:

```
training/
├── month-1/
│   ├── month: 1
│   ├── phase: "Foundation Building"
│   ├── goals: [...]
│   ├── bonus_skills_to_work: [...]
│   ├── weekly_schedule:
│   │   ├── monday:
│   │   │   ├── day: "Monday"
│   │   │   ├── focus: "Push Day"
│   │   │   ├── checklist: [{text: "...", completed: false}, ...]
│   │   │   ├── note: "..."
│   │   │   └── completedAt: "2025-01-15T10:30:00Z"
│   │   ├── tuesday: {...}
│   │   └── ...
│   ├── milestone_check: [...]
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
├── month-2/
└── ...
```

## Key Components

### Server Actions (`src/actions/training-actions.ts`)
- `getTrainingMonths()` - Fetch all months
- `getTrainingMonth(monthId)` - Fetch specific month
- `updateDayChecklist()` - Toggle checklist item
- `updateDayNote()` - Save daily note
- `resetDayProgress()` - Reset day completion
- `getProgressStats()` - Calculate progress statistics

### Pages
- `/training` - Main overview page with all months
- `/training/[monthId]` - Individual month detail page
- `/admin/seed` - Database seeding page

### Components
- `DayCard` - Interactive card for each training day
- Includes checkbox tracking, notes, and progress visualization

## Navigation

The training tracker is accessible via the sidebar navigation:
- Home icon - Returns to YouTube collections
- Dumbbell icon - Opens training tracker

## Tips for Use

1. **Start at Month 1**: Begin with the foundation building phase
2. **Check Daily**: Mark exercises as you complete them
3. **Add Notes**: Document how exercises felt, any struggles, or wins
4. **Review Milestones**: At the end of each month, check the milestone requirements
5. **Stay Consistent**: The program is designed for 6 days/week training
6. **Rest Days**: Sunday is designated as rest/recovery day

## Important Guidelines

⚠️ **Training Safety**:
- Always warm up for 10-15 minutes
- Focus on form over reps/time
- If you feel pain (not fatigue), rest immediately
- Sleep 7-9 hours per night
- Stay hydrated and eat adequate protein

## Troubleshooting

### Data Not Showing
- Make sure you've run the seed script at `/admin/seed`
- Check your Firebase configuration in `src/firebase/config.ts`

### Checkboxes Not Updating
- Check your internet connection
- Verify Firebase permissions
- Check browser console for errors

### Progress Not Saving
- Ensure you're logged into Firebase
- Check Firestore rules allow write access

## Technical Stack

- **Frontend**: Next.js 15, React 19
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Future Enhancements

Potential additions:
- Export progress to PDF
- Share progress with friends
- Photo uploads for form checks
- Video exercise demonstrations
- Nutrition tracking integration
- Rest timer between sets

---

**Ready to start your planche journey?** Visit `/admin/seed` to populate your database and begin training! 💪
