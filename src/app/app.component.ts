import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { storeActions } from '@larscom/ngrx-store-formsync';
import { Store } from '@ngrx/store';
import { IRootState } from './store/models/root-state';

@Component({
  selector: 'app-root',
  template: `
    <div class="container-fluid root">
      <button class="btn btn-primary" (click)="reset()">Reset</button>

      <form [formGroup]="form" [storeFormSyncId]="storeFormSyncId">
        <input type="text" formControlName="lessoncode" />
        <input type="text" formControlName="countrycode" />
        <input type="text" formControlName="languagecode" />
        <div formArrayName="tasks">
          <div *ngFor="let task of tasks; let taskIndex = index">
            <h1>Tasks</h1>
            <div [formGroupName]="taskIndex">
              <input formControlName="taskid" />
              <input formControlName="taskname" />
              <div formArrayName="groups">
                <div *ngFor="let group of getGroupsFor(taskIndex); let groupIndex = index">
                  <h2>Group</h2>
                  <div [formGroupName]="groupIndex">
                    <input formControlName="id" />
                    <input formControlName="name" />
                    <div formArrayName="attributes">
                      <div
                        *ngFor="let attribute of getAttributesFor(taskIndex, groupIndex); let attributeIndex = index"
                      >
                        <h3>Attribute</h3>
                        <div [formGroupName]="attributeIndex">
                          <input formControlName="name" />
                          <input formControlName="contentid" />
                          <input formControlName="value" />
                          <input formControlName="translationvalue" />
                          <input formControlName="placeholder" />
                          <input formControlName="label" />
                          <input formControlName="defaultvalue" />
                          <input formControlName="type" />
                          <input formControlName="element" />
                          <input formControlName="altered" />
                          <input formControlName="translation_id" />
                          <input formControlName="isnew" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div formArrayName="dictionary">
                <div *ngFor="let dict of getDictionaryFor(taskIndex); let dictIndex = index">
                  <h2>Dictionary</h2>
                  <div [formGroupName]="dictIndex">
                    <input formControlName="content_id" />
                    <input formControlName="term" />
                    <input formControlName="translation_id" />
                    <input formControlName="value" />
                    <input formControlName="task_id" />
                    <input formControlName="task_dictionary_id" />
                    <input formControlName="isnew" />
                    <input formControlName="altered" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .root {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 50vw;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  form!: UntypedFormGroup;
  initialFormValue: any;

  readonly storeFormSyncId = '1';

  get tasks(): AbstractControl[] {
    return (<UntypedFormArray>this.form.get('tasks')).controls;
  }

  getGroupsFor(index: number): AbstractControl[] {
    return (<UntypedFormArray>(<UntypedFormArray>this.form.get('tasks')).controls[index].get('groups')).controls;
  }

  getDictionaryFor(index: number): AbstractControl[] {
    return (<UntypedFormArray>(<UntypedFormArray>this.form.get('tasks')).controls[index].get('dictionary')).controls;
  }

  getAttributesFor(taskIndex: number, groupIndex: number): AbstractControl[] {
    return (<UntypedFormArray>(
      (<UntypedFormArray>(<UntypedFormArray>this.form.get('tasks')).controls[taskIndex].get('groups')).controls[
        groupIndex
      ].get('attributes')
    )).controls;
  }

  constructor(private readonly builder: UntypedFormBuilder, private readonly store: Store<IRootState>) {}

  ngOnInit(): void {
    this.form = this.builder.group({
      lessoncode: 'TMM',
      countrycode: 'CA',
      languagecode: 'en',
      tasks: this.builder.array(this.getTasks())
    });

    this.initialFormValue = this.form.value;
  }

  reset(): void {
    const { storeFormSyncId, initialFormValue } = this;

    const value = JSON.parse(JSON.stringify(initialFormValue));

    this.store.dispatch(storeActions.setForm({ storeFormSyncId, value }));
  }

  getTasks(): UntypedFormGroup[] {
    return this.taskData().map((task) =>
      this.builder.group({
        taskid: task.taskid,
        taskname: task.taskname,
        groups: this.builder.array(this.getGroups(task.groups)),
        dictionary: this.builder.array(this.getDictionaries(task.dictionary))
      })
    );
  }

  getDictionaries(dictionaries: any[]): UntypedFormGroup[] {
    return dictionaries.map((dictionary) =>
      this.builder.group({
        content_id: dictionary.content_id,
        term: dictionary.term,
        translation_id: dictionary.translation_id,
        value: dictionary.value,
        task_id: dictionary.task_id,
        task_dictionary_id: dictionary.task_dictionary_id,
        isnew: dictionary.isnew,
        altered: dictionary.altered
      })
    );
  }

  getGroups(groups: any[]): UntypedFormGroup[] {
    return groups.map((group) =>
      this.builder.group({
        id: group.id,
        name: group.name,
        attributes: this.builder.array(this.getAttributes(group.attributes))
      })
    );
  }

  getAttributes(attributes: any[]): UntypedFormGroup[] {
    return attributes.map((attribute) =>
      this.builder.group({
        name: attribute.name,
        contentid: attribute.contentid,
        value: attribute.value,
        translationvalue: attribute.translationvalue,
        placeholder: attribute.placeholder,
        label: attribute.label,
        defaultvalue: attribute.defaultvalue,
        type: attribute.type,
        element: attribute.element,
        altered: attribute.altered,
        translation_id: attribute.translation_id,
        isnew: attribute.isnew
      })
    );
  }

  taskData(): any[] {
    return [
      {
        taskid: 31,
        taskname: 'intro',
        groups: [
          {
            id: 223,
            name: 'Fullscreen Image and Sub-Heading',
            attributes: [
              {
                name: 'Main Heading',
                contentid: 767,
                value: 'Multitasking',
                translationvalue: 'Realización de varias tareas al mismo tiempo',
                placeholder: 'Main Heading',
                label: 'Main Heading',
                defaultvalue: '',
                type: 'text',
                element: 'input',
                altered: false,
                translation_id: 3063,
                isnew: false
              },
              {
                name: 'Sub-Heading',
                contentid: 155,
                value: 'Driver Attitude',
                translationvalue: 'Actitud del conductor',
                placeholder: 'Type Heading',
                label: 'Sub-Heading',
                defaultvalue: '',
                type: 'text',
                element: 'input',
                altered: false,
                translation_id: 3064,
                isnew: false
              },
              {
                name: 'Full-Screen Image',
                contentid: 211,
                value: '/media/lessons/dst/intro/image01-right.jpg',
                translationvalue: null,
                placeholder: 'Image Url',
                label: 'Full-Screen Image',
                defaultvalue: '',
                type: 'image',
                element: 'input',
                altered: false,
                translation_id: null,
                isnew: true
              },
              {
                name: 'Full-Screen Image',
                contentid: 212,
                value: '/media/lessons/dst/intro/image01-left.jpg',
                translationvalue: null,
                placeholder: 'Image Url',
                label: 'Full-Screen Image',
                defaultvalue: '',
                type: 'image',
                element: 'input',
                altered: false,
                translation_id: null,
                isnew: true
              },
              {
                name: 'Full-Screen Image',
                contentid: 213,
                value: '/media/lessons/dst/intro/image01-right.jpg',
                translationvalue: null,
                placeholder: 'Image Url',
                label: 'Full-Screen Image',
                defaultvalue: '',
                type: 'image',
                element: 'input',
                altered: false,
                translation_id: null,
                isnew: true
              },
              {
                name: 'Full-Screen Image Alt',
                contentid: 880,
                value: 'Multitasking - Driver Attitude',
                translationvalue: 'Multitasking - Driver Attitude',
                placeholder: 'Full-Screen Image Alt',
                label: 'Full-Screen Image Alt',
                defaultvalue: '',
                type: 'alt',
                element: 'input',
                altered: false,
                translation_id: 3062,
                isnew: false
              },
              {
                name: 'Icon SVG Data',
                contentid: 3063,
                value: '',
                translationvalue: null,
                placeholder: 'SVG Data',
                label: 'Icon SVG Data',
                defaultvalue: '',
                type: 'html',
                element: 'textarea',
                altered: false,
                translation_id: null,
                isnew: true
              }
            ]
          }
        ],
        dictionary: [
          {
            content_id: 5,
            term: 'Continue',
            translation_id: 3065,
            value: 'Continuar',
            task_id: 31,
            task_dictionary_id: 11,
            isnew: 0,
            altered: 0
          }
        ]
      },
      {
        taskid: 32,
        taskname: 'question-1',
        groups: [
          {
            id: 228,
            name: 'Question',
            attributes: [
              {
                name: 'Question Text',
                contentid: 956,
                value:
                  'Welcome to the Multitasking exercise. Before we begin, please select the statement that best describes your current view on the subject.',
                translationvalue:
                  'Bienvenido al ejercicio sobre realización de varias tareas al mismo tiempo. Antes de comenzar, seleccione la afirmación que mejor describa su opinión actual sobre el tema.',
                placeholder: 'Question Text',
                label: 'Question Text',
                defaultvalue: '',
                type: 'textarea',
                element: 'textarea',
                altered: false,
                translation_id: 3462,
                isnew: false
              },
              {
                name: 'Randomize Answers',
                contentid: 1100,
                value: '1',
                translationvalue: null,
                placeholder: 'Randomize Answers',
                label: 'Randomize Answers',
                defaultvalue: '2',
                type: 'truefalse',
                element: 'select',
                altered: false,
                translation_id: null,
                isnew: true
              }
            ]
          }
        ],
        dictionary: []
      }
    ];
  }
}
