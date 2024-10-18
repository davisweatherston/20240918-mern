import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Team } from '../models/Team';
import { HttpService } from '../services/http.service';
import { TeamComponent } from '../team/team.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, TeamComponent, FormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent {

  constructor(private httpService: HttpService) {
    this.getAllTeams();
  }

  teams: Team[] = [];

  getAllTeams() {
    this.httpService.getAllTeams().subscribe(data => {
      let tempTeams: Team[] = [];
      if(data.body)
        for(let team of data.body) {
          tempTeams.push(new Team(team.teamId,
                                team.teamName
      ))}
      this.teams = tempTeams;
    })
  }

addNewTeam: boolean = false;
teamId: number = 1;
teamName: string = '';
createNewTeam() {
  let newTeam = new Team(this.teamId,
                        this.teamName
                        )
  this.httpService.createTeam(newTeam).subscribe(data => {
    console.log(data.body);
    this.getAllTeams();
    this.addNewTeam = false;
  })
}

addTeam() {
  this.addNewTeam = true;
}
}
