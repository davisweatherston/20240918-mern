import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Team } from '../models/Team';
import { Player } from '../models/Player';
import { HttpService } from '../services/http.service';
import { SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {

@Input() team: Team = new Team(1, '')

teamColors: string[] = [  'rgb(170, 164, 152, .8)',
                          'rgb(135, 206, 250, .67)', 
                          'rgb(152, 159, 171, .67)',   
                          'rgb(216, 191, 216, .8)',    
                          'rgb(104, 166, 98, .5)',
                          'rgb(220, 171, 162, .67)',
                          'rgb(238, 232, 170, .67)',  
                          'rgb(120, 90, 160, .55)',      
                          'rgb(152, 251, 152, .67)',   
                          'rgb(173, 216, 230, .8)'     
                        ];

getTeamColor(teamId: number): string {
  return this.teamColors[teamId % this.teamColors.length]
}

getTeamGradient(teamId: number): string {
  const teamColor = this.getTeamColor(teamId); // Assuming getTeamColor method exists
  return `linear-gradient(to bottom, rgb(240, 240, 240), ${teamColor})`;
}

constructor(private httpService: HttpService) {
  
}

ngOnChanges(changes: SimpleChanges): void {
  // Check if the team input has changed and the teamId is available
  if (changes['team'] && this.team && this.team.teamId) {
    // Fetch players for the given team
    this.getPlayersByTeamId(this.team.teamId);
  }
    // Fetch the updated average DUPR for the given team
    this.getAverageDupr(this.team.teamId);
  
}

players: Player[] = [];

getPlayersByTeamId(teamId: number) {
  this.httpService.getPlayersByTeamId(teamId).subscribe(data => {
    let teamPlayers: Player[] = [];
    if(data.body)
      for(let player of data.body) {
        teamPlayers.push(new Player(player.playerId,
                                    player.firstName,
                                    player.lastName,
                                    player.teamId,
                                    player.dupr,
                                    player.gender
    ))}
    this.players = teamPlayers;
  })
}

averageDupr: number = 0;

getAverageDupr(teamId: number) {
  this.httpService.getAverageDupr(teamId).subscribe(data => {
    if (data.averageDupr) {
      this.averageDupr = data.averageDupr;
    }
  });
}

// used to display the Edit Roster button dynamically
changeRoster: boolean = false;
editRoster() {
  this.changeRoster = true;
  this.getAllTeams();
}

selectedPlayerId: number = 0;

playerFirstName: string = '';
playerLastName: string = '';
playerTeamId: number = 0;
playerDupr: number = 0;
playerGender: string = '';

playerTeamIdToUpdate = 0;

tradePlayer: boolean = false;
reassignPlayer(id: number) {
  this.selectedPlayerId = id;
  let updatedPlayer: Player = new Player(0,
                                      this.playerFirstName,
                                      this.playerLastName,
                                      this.playerTeamIdToUpdate,
                                      this.playerDupr,
                                      this.playerGender
  )
  this.tradePlayer = true;
  this.httpService.updatePlayer(id, updatedPlayer).subscribe(data => {
    console.log(data.body)
  })
  this.changeRoster = false;
  // window.location.reload();
}

teamName: string = '';  

formX: number = 0;  // X coordinate of the form
formY: number = 0;  // Y coordinate of the form
changeTeamName: boolean = false;

showForm(event: MouseEvent): void {
  this.formX = event.clientX + 30;  // Get the mouse X coordinate
  this.formY = event.clientY - 120;  // Get the mouse Y coordinate and shift up 120px
  this.changeTeamName = true;  // Show the form
}

editTeamName(id: number): void {
  this.httpService.editTeamName(id, this.teamName).subscribe(data => {
    console.log(data.body);
    this.changeTeamName = false;  // Hide the form after submission
    window.location.reload();
  });
}



deleteTeam(teamId: number) {
  const confirmation = window.confirm(`Do you want to delete team with ID ${teamId}?`);

  if(confirmation) {
  this.httpService.deleteTeam(teamId).subscribe(data => {
    console.log(data.body);
    window.location.reload();
  })}
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



}
