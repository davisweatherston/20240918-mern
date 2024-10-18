import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Player } from '../models/Player';
import { Team } from '../models/Team';
import { HttpService } from '../services/http.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reactive-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms.component.html',
  styleUrl: './reactive-forms.component.css'
})

export class ReactiveFormsComponent {

  @Input() isUpdateForm: boolean = false;
  @Output() createNewPlayerEvent = new EventEmitter<Player>();
  @Input() selectedPlayerId!: number;
  @Input() selectedPlayer: Player = new Player(0, '', '', 0, 0, '');
  @Output() updatePlayerEvent = new EventEmitter<Player>();

  createForm: FormGroup;

  updateForm: FormGroup;

  teams: Team[] = [];

  test: boolean = true;

  constructor(private httpService: HttpService) {
    this.createForm = new FormGroup({

      createFirstName: new FormControl(this.selectedPlayer.firstName, [Validators.required, Validators.maxLength(32)]),
      createLastName: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      createTeamId: new FormControl(0, [Validators.max(100), Validators.pattern('[0-9]*')]),
      createDupr: new FormControl(0, [Validators.required, Validators.max(8), Validators.min(0), Validators.pattern('^[0-9]*\.?[0-9]+$')]),
      createGender: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern('^[A-Z]+$')])

    })

    this.updateForm = new FormGroup({

      updateFirstName: new FormControl(''),
      updateLastName: new FormControl('', [Validators.maxLength(32)]),
      updateTeamId: new FormControl(0, [Validators.max(100), Validators.pattern('[0-9]*')]),
      updateDupr: new FormControl(0, [Validators.max(8), Validators.min(0), Validators.pattern('^[0-9]*\.?[0-9]+$')]),
      updateGender: new FormControl('', [Validators.maxLength(1), Validators.pattern('^[A-Z]+$')])

    })

  }

  ngOnInit(): void {
    this.getAllTeams();
  }


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

  get createFirstName() {
    return this.createForm.get('createFirstName');
  }

  get createLastName() {
    return this.createForm.get('createLastName');
  }

  get createTeamId() {
    return this.createForm.get('createTeamId');
  }

  get createDupr() {
    return this.createForm.get('createDupr');
  }

  get createGender() {
    return this.createForm.get('createGender');
  }

  resetCreateForm() {
    this.createForm.reset();
  }

  submitCreateForm() {
    this.createNewPlayerEvent.emit(new Player(0,
                                              this.createFirstName?.value,
                                              this.createLastName?.value,
                                              this.createTeamId?.value,
                                              this.createDupr?.value,
                                              this.createGender?.value));

  }


  get updateFirstName() {
    return this.updateForm.get('updateFirstName');
  }

  get updateLastName() {
    return this.updateForm.get('updateLastName');
  }

  get updateTeamId() {
    return this.updateForm.get('updateTeamId');
  }

  get updateDupr() {
    return this.updateForm.get('updateDupr');
  }

  get updateGender() {
    return this.updateForm.get('updateGender');
  }

  resetUpdateForm() {
    this.updateForm.reset();
  }

  submitUpdateForm() {
    this.updatePlayerEvent.emit(new Player(this.selectedPlayerId,
                                          this.updateFirstName?.value,
                                          this.updateLastName?.value,
                                          this.updateTeamId?.value,
                                          this.updateDupr?.value,
                                          this.updateGender?.value));
    this.resetUpdateForm();
  }

}