import { Injectable } from '@angular/core';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class MainSectionService {

  people = [
    {
      id: 1,
      name: 'Samarina',
      age: 25,
      images: ['/assets/i7.png', '/assets/i2.jpeg'],
      infos: ['Software Engineer', 'Likes hiking', 'Foodie']
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 30,
      images: ['/assets/i3.jpeg', '/assets/i4.jpeg'],
      infos: ['Marketing Specialist', 'Loves reading', 'Traveler']
    },
    {
      id: 3,
      name: 'Bob Johnson',
      age: 28,
      images: ['/assets/i5.jpeg', '/assets/i6.jpeg'],
      infos: ['Data Scientist', 'Enjoys playing guitar', 'Food enthusiast']
    },
    {
      id: 4,
      name: 'Alice Brown',
      age: 29,
      images: ['/assets/i7.png', '/assets/i1.jpeg'],
      infos: ['Graphic Designer', 'Loves yoga', 'Animal lover']
    },
    {
      id: 5,
      name: 'Mike Davis',
      age: 32,
      images: ['/assets/i2.jpeg', '/assets/i3.jpeg'],
      infos: ['Software Developer', 'Enjoys playing basketball', 'Music lover']
    },
    {
      id: 6,
      name: 'Emily Chen',
      age: 27,
      images: ['/assets/i4.jpeg', '/assets/i5.jpeg'],
      infos: ['Product Manager', 'Loves hiking', 'Foodie']
    },
    {
      id: 7,
      name: 'David Lee',
      age: 31,
      images: ['/assets/i6.jpeg', '/assets/i2.jpeg'],
      infos: ['UX Designer', 'Enjoys playing tennis', 'Traveler']
    },
    {
      id: 8,
      name: 'Sarah Taylor',
      age: 26,
      images: ['/assets/i1.jpeg', '/assets/i5.jpeg'],
      infos: ['Frontend Developer', 'Loves reading', 'Animal lover']
    }
  ];
  

  constructor() { }

  getPeople() {
    return this.people;
  }
  getPersonById(id: number): Person | undefined {
    return this.people.find(person => person.id == id);
  }

}



// import { Person } from './models/person.model';

// export class TinderDataService {
//   private MOCK_PEOPLE: Person[] = [
//     {
//       name: 'Samarina',
//       age: 25,
//       images: ['assets/i7.png', 'assets/i1.jpeg']
//     },
//     {
//       name: 'Jane Smith',
//       age: 30,
//       images: ['assets/i2.jpeg', 'assets/i3.jpeg']
//     }
//     // Adicione mais pessoas conforme necessário
//   ];

//   getPeople(): Person[] {
//     return this.MOCK_PEOPLE;
//   }
// }