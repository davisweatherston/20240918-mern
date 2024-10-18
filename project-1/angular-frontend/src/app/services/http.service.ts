import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../models/Player';
import { Team } from '../models/Team';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

// PLAYER SECTION

  getAllPlayers(): Observable<HttpResponse<Player[]>> {
    return this.http.get<Player[]>('http://localhost:3000/players', {observe: 'response'})
  }

  getPlayerById(id: number): Observable<HttpResponse<Player[]>> {
    return this.http.get<Player[]>('http://localhost:3000/players/' + id, {observe : 'response'});
  }

  getPlayersByTeamId(id: number): Observable<HttpResponse<Player[]>> {
    return this.http.get<Player[]>('http://localhost:3000/players/team/' + id, {observe: 'response'})
  }

  createNewPlayer(player : Player): Observable<HttpResponse<Player>> {
    return this.http.post<Player>('http://localhost:3000/players', player, { observe : 'response'});
  }

  updatePlayer(id: number, updatedPlayer: Player): Observable<HttpResponse<Player>> {
    return this.http.put<Player>('http://localhost:3000/players/' + id, updatedPlayer, { observe: 'response' });
  }

  deletePlayer(id: number): Observable<HttpResponse<void>> {
    return this.http.delete<void>('http://localhost:3000/players/' + id, { observe: 'response' });
  }

//TEAM SECTION

  getAllTeams(): Observable<HttpResponse<Team[]>> {
    return this.http.get<Team[]>('http://localhost:3000/teams', {observe: 'response'})
  }

  getAverageDupr(teamId: number) {
    return this.http.get<any>(`http://localhost:3000/teams/${teamId}/average-dupr`);
  }

  createTeam(team: Team) {
    return this.http.post<Team>('http://localhost:3000/teams', team, {observe: 'response'})
  }

  deleteTeam(id: number): Observable<HttpResponse<void>> {
    return this.http.delete<void>('http://localhost:3000/teams/' + id, {observe: 'response'})
  }

  editTeamName(id: number, name: any): Observable<HttpResponse<any>> {
    return this.http.put<any>('http://localhost:3000/teams/' + id, { teamName: name }, {observe: 'response'})
  }
}
