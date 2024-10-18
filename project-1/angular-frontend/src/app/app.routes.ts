import { Routes } from '@angular/router';
import { PlayersComponent } from './players/players.component';
import { TeamsComponent } from './teams/teams.component';
import { ScheduleComponent } from './schedule/schedule.component';

export const routes: Routes = [
    {
        path: 'players',
        component: PlayersComponent
    },
    {
        path: 'teams',
        component: TeamsComponent
    },
    {
        path: 'schedule',
        component: ScheduleComponent
    }
];
