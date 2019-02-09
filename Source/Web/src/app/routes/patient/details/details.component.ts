import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  sumBy as _sumBy,
  filter as _filter,
  flatten as _flatten,
  groupBy as _groupBy,
} from 'lodash';
import { ModalService, ConfirmModalComponent } from '../../../modules/modals';
import { PopoverOptions } from '../../../modules/popover';
import { RecordResultsComponent, GoalComponent, AddCTTaskComponent } from '../../../components';
import { AuthService, NavbarService, StoreService, UtilsService } from '../../../services';
import { GoalCommentsComponent } from './modals/goal-comments/goal-comments.component';
import { DetailsMockData } from './detailsData';

@Component({
  selector: 'app-patient-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class PatientDetailsComponent implements OnDestroy, OnInit {

  public moment = moment;
  public objectKeys = Object.keys;

  private mockData = new DetailsMockData();

  public user = null;
  public patient = null;
  public carePlan = null;
  public careTeamMembers = [];
  public isUsingMobile = true;

  public planGoals = [];
  public userTasks = [];
  public teamTasks = [];
  public patientTasks = [];
  public assessmentResults = [];
  public symptomResults = [];
  public vitalResults = [];
  public messageQueues = [];
  // Tracks what tasks, if any, are currently being updated.
  public updatingPatientTasks = [];
  public patientTaskStatusChoices = ['done', 'missed'];
  public updatingAssessmentResults = [];
  public updatingSymptomResults = [];
  public updatingVitalResults = [];
  // Date picker options
  public selectedDate = moment();
  public showDate = false;
  public datePickerOptions: PopoverOptions = {
    relativeTop: '48px',
    relativeRight: '0px',
  };
  // Accordion open statuses
  public goalAccordionOpen = false;
  public userTasksOpen = false;
  public teamTasksOpen = false;
  public patientTasksOpen = false;
  public assessmentResultsOpen = false;
  public symptomResultsOpen = false;
  public vitalsResultsOpen = false;
  public messagesOpen = false;
  // Tooltip open statuses
  public goalUpdateTTOpen = false;
  public myTaskOccurTTOpen = false;
  public teamTaskOccurTTOpen = false;
  public patientTaskOccurTTOpen = false;
  public patientTaskAvgEngTTOpen = false;
  public patientTaskUpdateTTOpen = false;
  public symptomReportedTTOpen = false;
  public symptomVsPrevTTOpen = false;
  public symptomVsNextTTOpen = false;
  public symptomVsPlanTTOpen = false;
  public symptomUpdateTTOpen = false;
  public helpfulTTOpen = false;
  // Assessment and vital tooltips occur on multiple tables
  // so they are tied to the id of the vital or assessment
  public assmntOutcomeTTOpen: any = {};
  public assmntSatisfactionTTOpen: any = {};
  public assmntOccurTTOpen: any = {};
  public assmntVsPrevTTOpen: any = {};
  public assmntVsNextTTOpen: any = {};
  public assmntVsPlanTTOpen: any = {};
  public assmntUpdateTTOpen: any = {};
  public vitalReportedTTOpen: any = {};
  public vitalVsPrevTTOpen: any = {};
  public vitalVsNextTTOpen: any = {};
  public vitalVsPlanTTOpen: any = {};
  public vitalUpdateTTOpen: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modals: ModalService,
    private auth: AuthService,
    private store: StoreService,
    private nav: NavbarService,
    public utils: UtilsService,
  ) { }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.nav.patientDetailState(params.patientId, params.planId);
      this.auth.user$.subscribe((user) => {
        if (!user) {
          return;
        }
        this.user = user;
        this.store.PatientProfile.read(params.patientId).subscribe(
          (patient) => {
            this.patient = patient;
            this.nav.addRecentPatient(this.patient);
            let carePlanSub = this.store.CarePlan.read(params.planId).subscribe(
              (carePlan: any) => {
                this.carePlan = carePlan;
                this.refetchAllTasks(this.selectedDate);
                this.store.CarePlan.detailRoute('get', this.carePlan.id, 'care_team_members', {}, {}).subscribe(
                  (teamMembers: any) => {
                    this.careTeamMembers = teamMembers.filter((obj) => {
                      return obj.employee_profile.user.id !== this.user.user.id;
                    });
                  },
                  () => {},
                  () => {},
                );
                let messageSub = this.store.InfoMessageQueue.readListPaged().subscribe(
                  (messageQueues) => {
                    return this.messageQueues = _filter(messageQueues, m => m.plan_template.id === carePlan.plan_template.id);
                  },
                  (err) => {},
                  () => messageSub.unsubscribe()
                );
            },
            (err) => {},
            () => carePlanSub.unsubscribe()
          );
        },
        (err) => {},
        () => {},
      );
      });
    });
  }

  public ngOnDestroy() { }

  public getGoals(patient, planTemplate, start, end) {
    let promise = new Promise((resolve, reject) => {
      let goalsSub = this.store.Goal.readListPaged({
        plan__patient: patient,
        // goal_template__plan_template: planTemplate,
        start_on_datetime__lte: end,
      }).subscribe(
        (res) => resolve(res),
        (err) => reject(err),
        () => {
          goalsSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getUserTasks(planTemplate, date) {
    let promise = new Promise((resolve, reject) => {
      let tasksSub = this.store.User.detailRoute('get', this.user.user.id, 'tasks', {}, {
        plan_template: planTemplate,
        date: date,
        exclude_done: false,
      }).subscribe(
        (res) => resolve(res),
        (err) => reject(err),
        () => {
          tasksSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getTeamMemberTasks(teamMember, planTemplate, date) {
    let promise = new Promise((resolve, reject) => {
      let tasksSub = this.store.User.detailRoute('get', teamMember.employee_profile.user.id, 'tasks', {}, {
        plan_template: planTemplate,
        date: date,
        exclude_done: false,
      }).subscribe(
        (res: any) => {
          res.map((obj) => {
            obj['responsible_person'] = teamMember;
          });
          resolve(res);
        },
        (err) => reject(err),
        () => {
          tasksSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getAllTeamMemberTasks(planTemplate, date) {
    let promises = this.careTeamMembers.map((obj) => this.getTeamMemberTasks(obj, planTemplate, date));
    return Promise.all(promises);
  }

  public getPatientTasks(patient, planTemplate, date) {
    let promise = new Promise((resolve, reject) => {
      let tasksSub = this.store.User.detailRoute('get', patient, 'tasks', {}, {
        plan_template: planTemplate,
        date: date,
        exclude_done: false,
      }).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err),
        () => {
          tasksSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getAssessmentResults(patient, planTemplate, start, end) {
    let promise = new Promise((resolve, reject) => {
      let assessmentsSub = this.store.AssessmentResponse.readListPaged({
        assessment_task__plan__patient: patient,
        assessment_task__assessment_task_template__plan_template: planTemplate,
        modified__lte: end,
        modified__gte: start,
      }).subscribe(
        (res) => resolve(res),
        (err) => reject(err),
        () => {
          assessmentsSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getSymptomResults(patient, planTemplate, start, end) {
    let promise = new Promise((resolve, reject) => {
      let symptomSub = this.store.SymptomRating.readListPaged({
        symptom_task__plan__patient: patient,
        symptom_task__symptom_task_template__plan_template: planTemplate,
        modified__lte: end,
        modified__gte: start,
      }).subscribe(
        (res) => resolve(res),
        (err) => reject(err),
        () => {
          symptomSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getVitalResultsReal(patient, planTemplate, start, end) {
    let promise = new Promise((resolve, reject) => {
      let vitalSub = this.store.VitalResponse.readListPaged({
        vital_task__plan__patient: patient,
        vital_task__vital_task_template__plan_template: planTemplate,
        modified__lte: end,
        modified__gte: start,
      }).subscribe(
        (res) => resolve(res),
        (err) => reject(err),
        () => {
          vitalSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getCareMessagesReal(planTemplate, start, end) {
    let promise = new Promise((resolve, reject) => {
      let messagesSub = this.store.InfoMessage.readListPaged({
        queue__plan_template: planTemplate,
        modified__lte: end,
        modified__gte: start,
      }).subscribe(
        (res) => resolve(res),
        (err) => reject(err),
        () => {
          messagesSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getVitalResults(dateAsMoment = null) {
    if (!dateAsMoment) {
      dateAsMoment = moment();
    }
    return this.mockData.vitalResults.filter((obj) => {
      return dateAsMoment.isSame(obj.date, 'day');
    });
  }

  public refetchAllTasks(dateAsMoment) {
    if (!this.patient || !this.carePlan) {
      return;
    }
    let startOfDay = dateAsMoment.startOf('day').toISOString();
    let endOfDay = dateAsMoment.endOf('day').toISOString();
    let formattedDate = dateAsMoment.format('YYYY-MM-DD');
    this.getGoals(this.patient.id, this.carePlan.plan_template.id, startOfDay, endOfDay).then((goals: any) => {
      this.planGoals = goals;
    });
    this.getUserTasks(this.carePlan.plan_template.id, formattedDate).then((tasks: any) => {
      this.userTasks = tasks;
    });
    this.teamTasks = [];
    this.getAllTeamMemberTasks(this.carePlan.plan_template.id, formattedDate).then((teamMemberTasks) => {
      teamMemberTasks.forEach((tasks) => {
        this.teamTasks = this.teamTasks.concat(tasks);
      });
    });
    this.getPatientTasks(this.patient.user.id, this.carePlan.plan_template.id, formattedDate).then((tasks: any) => {
      this.patientTasks = tasks;
      if (!this.isUsingMobile) {
        this.updatingPatientTasks = this.patientTasks.concat();
      }
    });
    this.getAssessmentResults(this.patient.id, this.carePlan.plan_template.id, startOfDay, endOfDay).then((assessments: any) => {
      this.assessmentResults = _groupBy(assessments, (obj) => obj.assessment_question.assessment_task_template);
      console.log(this.assessmentResults);
      if (!this.isUsingMobile) {
        // this.updatingAssessmentResults = _flatten(this.assessmentResults.concat().map((results) => results.questions));
      }
    });
    this.getSymptomResults(this.patient.id, this.carePlan.plan_template.id, startOfDay, endOfDay).then((symptoms: any) => {
      this.symptomResults = symptoms;
      if (!this.isUsingMobile) {
        this.updatingSymptomResults = this.symptomResults.concat();
      }
    });
    // this.getVitalResultsReal(this.patient.id, this.carePlan.plan_template.id, startOfDay, endOfDay).then((vitals: any) => {
    //   this.vitalResults = vitals;
    //   if (!this.isUsingMobile) {
    //     // this.updatingVitalResults = _flatten(this.vitalResults.concat().map((results) => results.questions))
    //   }
    // });
  }

  public setSelectedDay(dateAsMoment) {
    if (!dateAsMoment) {
      return;
    }
    this.selectedDate = dateAsMoment;
    this.refetchAllTasks(dateAsMoment);
    this.vitalResults = this.getVitalResults(dateAsMoment);
  }

  public nextDate() {
    this.setSelectedDay(this.selectedDate.add(1, 'days'));
  }

  public prevDate() {
    this.setSelectedDay(this.selectedDate.add(-1, 'days'));
  }

  public isViewingToday() {
    return this.selectedDate.isSame(moment().format('YYYY-MM-DD'), 'day');
  }

  public isViewingTomorrow() {
    return this.selectedDate.isSame(moment().add(1, 'days').format('YYYY-MM-DD'), 'day');
  }

  public isViewingYesterday() {
    return this.selectedDate.isSame(moment().add(-1, 'days').format('YYYY-MM-DD'), 'day');
  }

  public tableHeaderDate() {
    if (this.isViewingToday()) {
      return 'Today';
    } else if (this.isViewingYesterday()) {
      return 'Yesterday';
    } else if (this.isViewingTomorrow()) {
      return 'Tomorrow';
    } else {
      return this.selectedDate.format('MMM DD');
    }
  }

  public goalsAverage() {
    if (!this.planGoals || this.planGoals.length === 0) {
      return 0;
    }
    let totalSum = _sumBy(this.planGoals, (obj) => {
      return obj.latest_progress ? obj.latest_progress.rating : 0;
    });
    let average = (totalSum / this.planGoals.length) + .0;
    return Math.round(average * 10) / 10;
  }

  public goalsPercentage() {
    return Math.round((this.goalsAverage() / 5.0) * 100);
  }

  public goalPercentage(progress) {
    return (progress / 5.0) * 100;
  }

  public completedUserTasks() {
    return this.userTasks.filter((obj) => {
      return obj.state === 'done';
    }).length;
  }

  public userTasksPercentage() {
    return Math.round((this.completedUserTasks() / this.userTasks.length) * 100);
  }

  public completedTeamTasks() {
    return this.teamTasks.filter((obj) => {
      return obj.state === 'done';
    }).length;
  }

  public teamTasksPercentage() {
    return Math.round((this.completedTeamTasks() / this.teamTasks.length) * 100);
  }

  public completedPatientTasks() {
    return this.patientTasks.filter((obj) => {
      return obj.state === 'done';
    }).length;
  }

  public patientTasksPercentage() {
    return Math.round((this.completedPatientTasks() / this.patientTasks.length) * 100);
  }

  public outcomeAsssessments() {
    return [];
    // return this.assessmentResults.filter((obj) => obj.tracksOutcome);
  }

  public satisfactionAssessments() {
    return [];
    // return this.assessmentResults.filter((obj) => obj.tracksSatisfaction);
  }

  public totalOutcomeQuestions() {
    return _sumBy(this.outcomeAsssessments(), (obj) => obj.questions.length);
  }

  public totalSatisfactionQuestions() {
    return _sumBy(this.satisfactionAssessments(), (obj) => obj.questions.length);
  }

  public averageOutcomeScore() {
    // let totalSum = _sumBy(this.outcomeAsssessments(), (obj) => {
    //   return _sumBy(obj.questions, (question) => question.rating);
    // });
    // let average = (totalSum / this.totalOutcomeQuestions()) + .0;
    // return Math.round(average * 10) / 10;
    return 0;
  }

  public averageOutcomePercentage() {
    return Math.round((this.averageOutcomeScore() / 5.0) * 100);
  }

  public averageSatisfactionScore() {
    // let totalSum = _sumBy(this.satisfactionAssessments(), (obj) => {
    //   return _sumBy(obj.questions, (question) => question.rating);
    // });
    // let average = (totalSum / this.totalSatisfactionQuestions()) + .0;
    // return Math.round(average * 10) / 10;
    return 0;
  }

  public averageSatisfactionPercentage() {
    return Math.round((this.averageSatisfactionScore() / 5.0) * 100);
  }

  public outcomePercentage(outcome) {
    // return (outcome / 5.0) * 100;
  }

  public averageSymptomRating() {
    let totalSum = _sumBy(this.symptomResults, (obj) => obj.rating);
    let average = (totalSum / this.symptomResults.length) + .0;
    return Math.round(average * 10) / 10;
  }

  public averageSymptomPercent() {
    return Math.round((this.averageSymptomRating() / 5.0) * 100);
  }

  public ratingPercentage(rating) {
    return (rating / 5.0) * 100;
  }

  public addGoal() {
    this.modals.open(GoalComponent, {
      closeDisabled: true,
      width: '512px',
    }).subscribe(() => {});
  }

  public updateGoal(goal) {
    this.modals.open(GoalComponent, {
      closeDisabled: true,
      data: {
        update: true,
        patientName: `${this.patient.user.first_name} ${this.patient.user.last_name}`,
        goal: goal,
      },
      width: '512px',
    }).subscribe((updatedGoal) => {
      if (!updatedGoal) {
        return;
      }
      // TODO: Update individual goal, rather than goal template for all of this plan type.
      this.store.GoalProgress.create({
        goal: goal.id,
        rating: updatedGoal.progress,
      }).subscribe((newProgress) => {
        this.refetchAllTasks(this.selectedDate);
      });
    });
  }

  public openGoalComments(goal) {
    this.modals.open(GoalCommentsComponent, {
      closeDisabled: false,
      data: {
        user: this.user.user,
        patient: this.patient,
        goal: goal,
      },
      width: '512px',
    }).subscribe((res) => {
      console.log(res);
    });
  }

  public openRecordResults(task) {
    this.modals.open(RecordResultsComponent, {
     closeDisabled: true,
     data: {
       patient: this.patient,
       carePlan: this.carePlan,
       tasks: this.userTasks,
       task: task.id,
       totalMinutes: null,
       teamMembers: this.mockData.employees,
       with: null,
       syncToEHR: false,
       notes: '',
       patientEngagement: null,
     },
     width: '512px',
   }).subscribe((results) => {
     if (!results) {
       return;
     }
     // Set team task status to done.
     this.store.TeamTask.update(task.id, {
       status: 'done',
     }, true).subscribe((res) => {
       task.state = 'done';
     });
     // Create billed activity record
     this.store.BilledActivity.create({
       plan: this.carePlan.id,
       activity_type: 'care_plan_review',
       members: [
         this.user.id,
       ],
       sync_to_ehr: results.syncToEHR,
       added_by: this.user.id,
       notes: results.notes,
       time_spent: results.totalMinutes,
     }).subscribe((res) => {
       console.log(res);
     });
   });
  }

  public addCTTask() {
    this.modals.open(AddCTTaskComponent, {
      closeDisabled: true,
      width: '384px',
    }).subscribe(() => {});
  }

  public isUpdatingPatientTask(task) {
    return this.updatingPatientTasks.findIndex((obj) => obj.id === task.id) >= 0;
  }

  public clickUpdatePatientTask(task) {
    this.updatingPatientTasks.push(task);
  }

  public clickSavePatientTask(task) {
    let updateSub = this.store.PatientTask.update(task.id, {
      status: task.state,
    }, true).subscribe(
      (res) => {
        let taskUpdateListIndex = this.updatingPatientTasks.findIndex((obj) => obj.id === task.id);
        this.updatingPatientTasks.splice(taskUpdateListIndex, 1);
      },
      (err) => {},
      () => {
        updateSub.unsubscribe();
      },
    );
  }

  public isUpdatingAssessmentResult(result) {
    return this.updatingAssessmentResults.findIndex((obj) => obj.id === result.id) >= 0;
  }

  public clickUpdateAssessmentResult(result) {
    this.updatingAssessmentResults.push(result);
  }

  public clickSaveAssessmentResult(result) {
    let resultsListIndex = this.updatingAssessmentResults.findIndex((obj) => obj.id === result.id);
    this.updatingAssessmentResults.splice(resultsListIndex, 1);
  }

  public isUpdatingSymptomResult(result) {
    return this.updatingSymptomResults.findIndex((obj) => obj.id === result.id) >= 0;
  }

  public clickUpdateSymptomResult(result) {
    this.updatingSymptomResults.push(result);
  }

  public clickSaveSymptomResult(result) {
    let resultsListIndex = this.updatingSymptomResults.findIndex((obj) => obj.id === result.id);
    this.updatingSymptomResults.splice(resultsListIndex, 1);
  }

  public format24Hour(time) {
    let timeParse = time.split(":");
    let suffix = (timeParse[0] >= 12)? 'PM' : 'AM';
    let hours = (parseInt(timeParse[0]) > 12) ? parseInt(timeParse[0]) -12 : parseInt(timeParse[0]);
    hours = (hours == 0) ? 12 : hours;
    return `${hours}:${timeParse[1]} ${suffix}`;
  }

  public formatTaskType(type: string) {
    return type.toLowerCase().replace('_task', '').replace('patient', 'task');
  }

  public floor(num) {
    return Math.floor(num);
  }

  public formatVitalQuestionType(type: string) {
    if (!type) {
      return '';
    }
    if (type === 'boolean') {
      return 'True/False';
    } else if (type == 'float') {
      return 'Decimal';
    } else if (type === 'string') {
      return 'String';
    } else {
      return type;
    }
  }

  public routeToMessaging() {
    this.router.navigate(['/patient', this.patient.id, 'messaging', this.carePlan.id]);
  }
}
