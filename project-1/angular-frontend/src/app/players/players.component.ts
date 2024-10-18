import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Player } from '../models/Player';
import { HttpService } from '../services/http.service';
import { ReactiveFormsComponent } from '../reactive-forms/reactive-forms.component';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, ReactiveFormsComponent],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})

export class PlayersComponent {

  constructor(private httpService: HttpService) {
    this.getAllPlayers();
  }

  players: Player[] = [];

  getAllPlayers() {
    this.httpService.getAllPlayers().subscribe(data => {
      let tempPlayers: Player[] = [];
      if(data.body)
        for(let player of data.body) {
          tempPlayers.push(new Player(player.playerId,
                                      player.firstName,
                                      player.lastName,
                                      player.teamId,
                                      player.dupr,
                                      player.gender
      ))}
      this.players = tempPlayers;
    })
  }

  createNewPlayer(player: Player) {
    this.httpService.createNewPlayer(player).subscribe(data => {
      this.getAllPlayers();
      this.formDisplay = false;
    })
  }

  //get the player info from that one we select on the frontend to use in the forms
  selectedPlayerId: number = 0;
  selectedPlayer: Player = new Player(0, '', '', 0, 0, '');

  selectPlayer(player: Player) {
 
    this.selectedPlayerId = player.playerId; 
    this.selectedPlayer = player;

    this.editFormDisplay = true;
  }

  updatePlayer(updatedPlayer: any) {
    console.log(this.selectedPlayerId)
    this.httpService.updatePlayer(this.selectedPlayerId, updatedPlayer).subscribe(data => {
      console.log(data.body);
      this.getAllPlayers();
      this.selectedPlayerId = 0; // Reset the selected player ID after update
      this.editFormDisplay = false;
    });
  }


  deletePlayer(id: number) {
    //simple window confirmation pop-up to confirm player deletion
    const confirmation = window.confirm(`Do you want to delete player with ID ${id}?`);

    if(confirmation) {
      this.httpService.deletePlayer(id).subscribe(data => {
      console.log(data);
      this.getAllPlayers();
      })
    } else {
      console.log(`Deletion canceled for player with ID ${id}`)
    }

    
  }

  //control when the either reactive form is displayed to the user
  formDisplay: boolean = false;
  editFormDisplay: boolean = false;

  addNewPlayer() {
    this.formDisplay = true
  }

  editPlayer() {
    this.editFormDisplay = true
  }

}
